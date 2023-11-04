import "../style/MyStatifyChart.scss";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as htmlToImage from "html-to-image";
import { FaSpotify } from "react-icons/fa";
import { CurrentlyListening } from "./CurrentlyListening";
import StatifyData from "./StatifyData";
import { fetchLikedSongs } from "../services/StatifyDataService";
import ErrorPage from "./ErrorPage";
interface MyStatifyProps {
  token: string;
  userName: string | null;
  userPhoto: string;
  followers: string | null;
  country: string | null;
  url: string | null;
}

interface Track {
  id: string;
  name: string;
  artists: string[];
  album: string;
  images: { url: string }[];
}

interface Artist {
  artists: string[];
  album: string;
  images: { url: string }[];
}

export function MyStatifyChart({
  token,
  userName,
  userPhoto,
  followers,
  country,
  url,
}: MyStatifyProps) {
  const [topSong, setTopSong] = useState<Track | null>(null);
  const [topArtist, setTopArtist] = useState<string | null>(null);
  const [topArtistImage, setTopArtistImage] = useState<string | null>(null);
  const [topGenre, setTopGenre] = useState<string | null>(null);
  const [musicPersonality, setMusicPersonality] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear(); // Get the current year
  const chartRef = useRef<HTMLDivElement>(null);
  const domEl = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [allTimeMinutesPlayed, setAllTimeMinutesPlayed] = useState<
    number | null
  >(null);
  const [totalLikedSongs, setTotalLikedSongs] = useState<number | null>(null);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const [topSongPhoto, setTopSongPhoto] = useState<string | undefined>();

  useEffect(() => {
    const fetchAllTimeMinutesPlayed = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              time_range: "long_term",
              limit: 1,
            },
          }
        );

        const minutesPlayed = response.data.items[0]?.duration_ms / 60000 || 0;
        setAllTimeMinutesPlayed(minutesPlayed);
      } catch (error) {
        console.error("Error fetching all-time minutes played:", error);
      }
    };

    const fetchFollowingUsers = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/following?type=artist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const followingUsers = response.data.artists.items.map(
          (user: { id: string; name: string }) => ({
            id: user.id,
            name: user.name,
          })
        );
        const followingCount = response.data.artists.total; // Get the total count of following users
        return followingCount;
      } catch (error) {
        console.error("Error fetching following users:", error);
        return 0; // Return 0 if there's an error
      }
    };

    fetchFollowingUsers();

    const fetchTopData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const songResponse = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 1,
            },
          }
        );

        const artistResponse = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 1,
            },
          }
        );

        const topSongData: Track | null = songResponse.data.items[0]
          ? {
              id: songResponse.data.items[0].id,
              name: songResponse.data.items[0].name,
              artists: songResponse.data.items[0].artists.map(
                (artist: any) => artist.name
              ),
              album: songResponse.data.items[0].album.name,
              images: songResponse.data.items[0].album.images,
            }
          : null;

        const topArtistData: string | null = artistResponse.data.items[0]
          ? artistResponse.data.items[0].name
          : null;
      
        const topArtistImage: string =
          artistResponse.data.items[0].images[1].url;
        const artistIds = artistResponse.data.items
          .map((artist: any) => artist.id)
          .join(",");
        const genreResponse = await axios.get(
          `https://api.spotify.com/v1/artists?ids=${artistIds}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const genres = genreResponse.data.artists
          .flatMap((artist: any) => artist.genres)
          .filter((genre: string) => genre !== "[]");
        const genreCountMap: { [key: string]: number } = {};
        genres.forEach((genre: string) => {
          genreCountMap[genre] = (genreCountMap[genre] || 0) + 1;
        });

        const topGenreData: string | null = Object.keys(genreCountMap).reduce(
          (a, b) => (genreCountMap[a] > genreCountMap[b] ? a : b)
        );

        setTopSong(topSongData);
        setTopArtist(topArtistData);
        setTopGenre(topGenreData);
        setTopArtistImage(topArtistImage);
        setFollowing(await fetchFollowingUsers());
        setTopSongPhoto(songResponse.data.items[0].album.images[0].url);
        if (topGenreData) {
          setMusicPersonality(getMusicPersonality(topGenreData));
        }
      } catch (error) {
        setError(
          "Error fetching Spotify Data or no Spotify Data available. Please try again."
        );
        console.error("Error fetching top data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLikedSongsData = async () => {
      const fetchLiked = await fetchLikedSongs(token);
      setTotalLikedSongs(fetchLiked);
    };
    if (token) {
      fetchAllTimeMinutesPlayed();
      fetchTopData();
      fetchLikedSongsData();
    }
  }, [token]);

  const getMusicPersonality = (genre: string): string | null => {
    // Music personality descriptions based on genre
    switch (genre) {
      case "pop":
        return "Extroverted, honest, and conventional.";
      case "rap":
        return "High self-esteem and were generally more outgoing than fans of other styles.";
      case "hip hop":
        return "Despite the stereotype that rap lovers are aggressive or violent, researchers found no such link.";
      case "country":
        return "Typically identified as hardworking, conventional, outgoing, and conservative.";
      case "rock":
      case "heavy metal":
        return "Rock and heavy metal fans often project images of anger, bravado, and aggression.";
      case "indie":
        return "Fans of the indie genre register as introverted, intellectual, and creative.";
      case "dance":
        return "Those who prefer dance music are typically outgoing, assertive, and open to experience.";
      case "classical":
        return "Classical music lovers are generally somewhat introverted but at ease with themselves.";
      case "jazz":
        return "Sophisticated people, lovers of jazz and classical music, are creative, sensitive and self-confident.";
      case "blues":
        return "Gentle and at ease with the world, are creative and outgoing.";
      case "soul":
        return "Fans of jazz, blues, and soul are typically extroverted with high self-esteem.";
      default:
        return null;
    }
  };

  const downloadImage = async () => {
    setIsDownloading(true); // Start download
    const dataUrl = await htmlToImage.toPng(domEl.current as HTMLDivElement);

    // Download image
    const link = document.createElement("a");
    link.download = "statity-profile.png";
    link.href = dataUrl;
    link.click();

    setIsDownloading(false); // End download
  };


  function profileCard() {
    return (
     
      <div className="card-profile">
        <figure className="snip1336">
          <img src={userPhoto} className="cover-photo" alt="" />
          <figcaption>
            <img src={userPhoto} alt="" className="profile" />
            <h2>
              <div className="user-name">{userName}</div>
              <div className="span-follow">
                <span className="followers-span">Followers </span>{" "}
                <div className="followers-value">{followers}</div>
                <span className="span-space"></span>
                <span className="following-span">Following </span>
                <div className="following-value">{following}</div>
              </div>

              <div className="country">
                <span>
                  Liked Songs <span className="span-space"></span>
                </span>
                <div className="country-value">{totalLikedSongs} </div>
              </div>

              <div className="country">
                <span>
                  Country <span className="span-space"></span>
                </span>
                <div className="country-value">{country} </div>
              </div>
             

              <div className={`bottom-section`}>
                <div className="spotify-myspotichart">Open Spotify</div>
                <FaSpotify
                  className="spotify-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    if (url) {
                      window.location.href = url;
                    }
                  }}
                />
              </div>
              
              <div>
                <StatifyData
                  token={token}
                  userName={userName}
                  userProfilePic={userPhoto}
                  followers={followers}
                  country={country}
                />
              </div>
          
              <div>
           
              </div>
           
            </h2>
          </figcaption>
        </figure>
        <CurrentlyListening token={token} />
      </div>
    );
  }

  return (
    <div
      className={`parentDiv ${isDownloading ? "is-downloading" : ""}`}
      ref={domEl}
    >
      {error ? <ErrorPage errorMessage={error}/>: profileCard()}
    </div>
  );
}
