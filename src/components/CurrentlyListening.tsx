import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/CurrentlyListening.scss";
import NowPlaying from "./NowPlaying";
import * as htmlToImage from "html-to-image";
import {
  FaSpotify,
  FaCamera,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";

interface CurrentlyPlaying {
  id: string; // Add the id property

  name: string;
  artist: string;
  album: string;
  image: string;
  releaseDate: string;
}

interface CurrentlyListeningProps {
  token: string;
}

export function CurrentlyListening({ token }: CurrentlyListeningProps) {
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null); // Added lyrics state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const domEl = useRef<HTMLDivElement>(null);
  const [isImageDownloaded, setIsImageDownloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const fetchCurrentlyPlaying = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Encoding": "gzip",
          },
        }
      );
  
      if (data.item) {
        const currentlyPlayingData: CurrentlyPlaying = {
          id: data.item.id, // Assign the song ID
          name: data.item.name,
          artist: data.item.artists[0].name,
          album: data.item.album.name,
          image: data.item.album.images[0]?.url || "",
          releaseDate: data.item.album.release_date,
        };
  
        // Only update the currently playing track if it has changed
        if (data.item.id !== currentlyPlaying?.id) {
          setCurrentlyPlaying(currentlyPlayingData);
          setIsPlaying(data.is_playing);
        }
      } else {
        setCurrentlyPlaying(null);
        setLyrics(null);
      }
    } catch (error) {
      setError("Error fetching currently playing track. Please try again.");
      console.log("Error fetching currently playing track:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const nextSong = async () => {
    try {
      await axios.post("https://api.spotify.com/v1/me/player/next", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Fetch the updated currently playing track
      setTimeout(fetchCurrentlyPlaying, 500);
    } catch (error) {
      console.log("Error playing the next song:", error);
    }
  };
  

  const previousSong = async () => {
    try {
      await axios.post("https://api.spotify.com/v1/me/player/previous", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(fetchCurrentlyPlaying, 500);

    } catch (error) {
      console.log("Error playing the previous song:", error);
    }
  };

  const stopSong = async () => {
    try {
      await axios.put("https://api.spotify.com/v1/me/player/pause", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsPlaying(false);

    } catch (error) {
      console.log("Error stopping the song:", error);
    }
  };

  const playSong = async () => {
    try {
      await axios.put("https://api.spotify.com/v1/me/player/play", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsPlaying(true);

    } catch (error) {
      console.log("Error playing the song:", error);
    }
  };

  const downloadImage = async () => {
    setIsDownloading(true); // Start download

    const dataUrl = await htmlToImage.toPng(domEl.current as HTMLDivElement);

    // Download image
    const link = document.createElement("a");
    link.download = "Statify-nowplaying.png";
    link.href = dataUrl;
    link.click();
    setIsDownloading(false); // End download
  };

  useEffect(() => {
    if (token) {
      fetchCurrentlyPlaying();
    }
  }, [token]);


  if (isLoading) {
    return <p>Loading currently playing track...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentlyPlaying) {
    return null; // Don't render the component if currentlyPlaying is null
  }


  return (
    <div
      className={`return-div ${isDownloading ? "is-downloading" : ""}`}
      ref={domEl}
    >
      <div className="now-playing">
        <div className="container">
          <div className="content">
            <NowPlaying />
            <img
              className="img-album"
              src={currentlyPlaying?.image}
              alt="Album Art"
            />
            <div className="info">
              <div className="track-name-recently">
                {currentlyPlaying?.name}
              </div>
              <div className="artist-name-recently">
                {currentlyPlaying?.artist}
              </div>
              <div className="controls">
                <div className="control-buttons">
                  <FaStepBackward
                    className="control-icon-small"
                    onClick={previousSong}
                  />
                  {isPlaying ? (
                    <FaPause
                      className="control-icon-small"
                      onClick={stopSong}
                    />
                  ) : (
                    <FaPlay className="control-icon-small" onClick={playSong} />
                  )}
                  <FaStepForward
                    className="control-icon-small"
                    onClick={nextSong}
                  />
                </div>
              </div>
              <div className="icons-container">
                <FaSpotify className="spotify-icon-recently" />
                <FaCamera
                  className={`fiCamera-playing ${
                    isDownloading ? "hidden" : ""
                  }`}
                  onClick={downloadImage}
                />
             
              </div>
              <div className="statify">/my-statify.com</div>
            </div>
          </div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>
      </div>
    </div>
  );
}
