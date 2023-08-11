import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlusCircle,
  FaCheck,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import "../style/RecentlyPlayed.scss";
import ErrorPage from "./ErrorPage";

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: {
    name: string;
    images: Image[];
  };
  uri: string; // Add the uri property
  addedToQueue: boolean; // New property to track if the track is added to the queue
  liked: boolean;
}

interface Artist {
  id: string;
  name: string;
}

interface Image {
  url: string;
  width: number;
  height: number;
}

interface RecentlyPlayedTracksProps {
  token: string;
}

const RecentlyPlayedTracks = ({ token }: RecentlyPlayedTracksProps) => {
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchRecentlyPlayedTracks();
  }, []);
  const fetchRecentlyPlayedTracks = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50, // Increase the limit to get more tracks since we're filtering duplicates
          },
        }
      );

      const trackIds = data.items.map((item: any) => item.track.id);
      const { data: likedTracks } = await axios.get(
        "https://api.spotify.com/v1/me/tracks/contains",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: trackIds.join(","),
          },
        }
      );

      // Filter duplicate tracks
      const seenTrackIds = new Set<string>();
      const uniqueRecentlyPlayedTracks = data.items
        .filter((item: any) => {
          if (seenTrackIds.has(item.track.id)) {
            return false;
          } else {
            seenTrackIds.add(item.track.id);
            return true;
          }
        })
        .map((item: any, index: number) => ({
          ...item.track,
          liked: likedTracks[index],
        }));

      setRecentTracks(uniqueRecentlyPlayedTracks);
    } catch (error:any) {
      setError(error.response)
      console.log("Error fetching recently played tracks:", error);
    }
  };
  

  const createPlaylist = async () => {
    try {
      const { data } = await axios.post(
        "https://api.spotify.com/v1/me/playlists",
        {
          name: "Recently Played Tracks",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const playlistId = data.id;
      const trackUris = recentTracks.map((track) => track.uri);

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = `https://open.spotify.com/playlist/${playlistId}`;
    } catch (error:any) {
      setError(error.response)
      console.log("Error creating playlist:", error);
    }
  };

  const handleToggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  const handleAddToQueue = async (trackId: string) => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
          `spotify:track:${trackId}`
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecentTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.id === trackId ? { ...track, addedToQueue: true } : track
        )
      );
      console.log("Track added to queue");
    }catch (error:any) {
      setError(error.response)
      console.log("Error adding track to queue:", error);
    }
  };
  return (
    <div>
       {error ? <ErrorPage errorMessage={error}/> : ''}
    <div className="recent-tracks-container">
      <div className="recent-tracks-header" onClick={handleToggleContent}>
        {showContent ? (
          <>
            <h2 className="recent-tracks-heading">
              Hide recently played tracks
            </h2>
            <FaChevronUp className="toggle-icon" />
          </>
        ) : (
          <>
            <h2 className="recent-tracks-heading">
              Show recently played tracks
            </h2>
            <FaChevronDown className="toggle-icon" />
          </>
        )}
      </div>
      {showContent && (
        <div className="recent-tracks-list">
          {recentTracks.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className="recent-track-item-played"
            >
              <div className="recent-track-number">{index + 1}</div>
              <img
                className="recent-track-image"
                src={track.album.images[0].url}
                alt="Album Cover"
              />
              <div className="recent-track-info">
                <div className="recent-track-name">{track.name}</div>
                <div className="recent-track-artists">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </div>
                <div className="added-to-queue-icon-container">
                {track.liked ? <FaHeart className="liked-icon-recently" /> : <FaRegHeart className="like-icon-recently" />}

                {track.addedToQueue ? (
                  <FaCheck className="added-to-queue-icon" />
                ) : (
                  <FaPlusCircle
                    className="add-to-queue-icon"
                    onClick={() => handleAddToQueue(track.id)}
                  />
                )}

              </div>
              </div>
             
            </div>
          ))}
          <button className="create-playlist-recent" onClick={createPlaylist}>
            Create Playlist
          </button>
        </div>
      )}
    </div>
    </div>
  );
  
};

export default RecentlyPlayedTracks;
