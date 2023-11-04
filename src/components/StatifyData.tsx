import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/StatifyData.scss";
import {
  FaSpotify,
  FaChartBar,
  FaShare,
  FaCameraRetro,
  FaUser,
} from "react-icons/fa";
import * as htmlToImage from "html-to-image";

import {
  fetchWeeklyListening,
  fetchTopTracks,
  fetchTopArtists,
  fetchTopAlbums,
  fetchUserProfile,
  fetchLikedSongs,
  fetchFollowingUsers,
} from "../services/StatifyDataService";
import { formatNumber } from "../utils/FuncUtils";
import ErrorPage from "./ErrorPage";
import { genreToPersonalityMap } from "../constants/constants";

interface StatifyDataProps {
  token: string;
  userName: string | null;
  userProfilePic: string | null;
  followers: string | null;
  country: string | null;
}
interface UserProfile {
  followers: {
    total: number;
  };
  // Other profile properties you might need
}
const StatifyData: React.FC<StatifyDataProps> = ({
  token,
  userName,
  userProfilePic,
  followers,
  country,
}) => {
  const [moodMessage, setMoodMessage] = useState<string>("");
  const [musicPersonality, setMusicPersonality] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [topArtist, setTopArtists] = useState<string>("");
  const [topTrack, setTopTracks] = useState<string>("");
  const [topAlbum, setTopAlbums] = useState<string>("");
  const [topAlbumArtist, setTopAlbumsArtist] = useState<string>("");
  const [isDLoading, setIsDLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [totalLikedSongs, setTotalLikedSongs] = useState<number | null>(null);
  const [following, setFollowing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const domEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeeklyListening(token);
        if (data) {
          const mood = getMoodFromGenres(data.genres);
          const personality = getPersonalityFromGenres(data.genres);

          setMoodMessage(`My mood for this week: ${mood}`);
          setMusicPersonality(personality);
          setGenre(data.genres[0].toUpperCase());
        }
      } catch (error: any) {
        setError(error.response);
        console.log("Error fetching weekly listening:", error);
      }
    };

    const fetchTopData = async () => {
      try {
        const topArtist = await fetchTopArtists(token);
        const topTrack = await fetchTopTracks(token);
        const topAlbum = await fetchTopAlbums("short_term", token); // Pass the 'option' and 'token' arguments
        setTopTracks(topTrack.name);
        setTopArtists(topArtist.name);
        setTopAlbums(topAlbum.name);
        setTopAlbumsArtist(topAlbum.artist);
        console.log("Top Track:", topTrack.name);
        console.log("Top Artist:", topArtist.name);
        console.log("Top Album:", topAlbum.name);
      } catch (error: any) {
        setError(error.response);
        console.log("Error fetching data:", error);
      }
    };

    const fetchUserProfileData = async () => {
      const profileData = await fetchUserProfile(token);
      setUserProfile(profileData);
    };

    const fetchFollowingData = async () => {
      const fetchFollowing = await fetchFollowingUsers(token);
      setFollowing(fetchFollowing);
    };

    const fetchLikedSongsData = async () => {
      const likedSongsCount = await fetchLikedSongs(token);
      setTotalLikedSongs(likedSongsCount);
    };

    if (token) {
      fetchData();
      fetchTopData();
      fetchUserProfileData();
      fetchLikedSongsData();
      fetchFollowingData();
    }
  }, [token]);

  const getMoodFromGenres = (genres: string[]): string => {
    const genreToMoodMap: { [genre: string]: string } = {
      rock: "Energetic 🤘",
      pop: "Upbeat 🎉",
      jazz: "Relaxed 😌",
      classical: "Soothing 🎻",
      hip_hop: "Groovy 🎧",
      country: "Sunny 🔆",
      electronic: "Euphoric 🎶",
      rnb: "Smooth 😎",
      indie: "Dreamy ✨",
    };

    for (const genre of genres) {
      if (genreToMoodMap[genre]) {
        return genreToMoodMap[genre];
      }
    }

    return "Electric 🎵";
  };

  const getPersonalityFromGenres = (genres: string[]): string => {
    for (const genre of genres) {
      if (genreToPersonalityMap[genre]) {
        return genreToPersonalityMap[genre];
      }
    }

    return "Unknown";
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const downloadImage = async () => {
    // Start download
    setIsDLoading(true);
    const dataUrl = await htmlToImage.toPng(domEl.current as HTMLDivElement);

    // Download image
    const link = document.createElement("a");
    link.download = "profile-card.png";
    link.href = dataUrl;
    link.click();
    setIsDLoading(false);
    // End download
  };

  return (
    <div>
      {error ? (
        <ErrorPage errorMessage={error} />
      ) : (
        <div className="statify-parent">
          <div className="open-modal-button">
            Open Profile Card <FaUser className="faUser-statifyData" onClick={handleModalOpen} />
          </div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content" ref={domEl}>
                <span
                  className={`close-button ${isDLoading ? "hidden" : ""}`}
                  onClick={handleModalClose}
                >
                  &times;
                </span>
                <div className="card-container">
                  {userProfilePic ? (
                    <img className="round" src={userProfilePic} alt="user" />
                  ): <img className="round" src="https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png" alt="user"/>}
                  {userName && <div className="name-sdata">{userName}</div>}

                  <div className="profile-data">
                    <div className="followers-header">
                      Followers{" "}
                      <div className="followers-sd">
                        {formatNumber(Number(followers))}
                      </div>
                    </div>

                    <div className="following-header">
                      Following{" "}
                      <div className="following-sd">
                        {" "}
                        {formatNumber(Number(following))}
                      </div>
                    </div>

                    <div className="country-header">
                      Country <div className="country-sd">{country}</div>
                    </div>
                  </div>
                  {/* <div className="profile-data-2">
              <div className="followers">
                  <FaHeart/> <div className="followers-value">    {totalLikedSongs}</div>
                </div>

              </div> */}
                  <div className="content-data">
                    <div className="top-track">
                      <div className="top-label">Top Track</div>
                      <div className="top-value">{topTrack}</div>
                    </div>

                    <div className="top-artist">
                      <div className="top-label">Top Artist</div>
                      <div className="top-value">{topArtist}</div>
                    </div>

                    <div className="top-album">
                      <div className="top-label">Top Album</div>
                      <div className="top-value">
                        {topAlbum} - {topAlbumArtist}
                      </div>
                    </div>

                    {/* <div className="top-genre">
                    <div className="top-label">Top Genre</div>
                    <div className="top-value">{genre}</div>
                  </div> */}
                    <div className="music-personality">Music Personality</div>
                    <div className="personality-value">{musicPersonality}</div>

                    <div className="mood">
                      <div className="w-mood">Weekly Mood</div>
                      <div className="m-message">{moodMessage}</div>
                    </div>

                    <div className="icon-container">
                      <div className="spotify-container">
                        <FaSpotify />
                        <div className="spotify-data-icon">
                          Spotify Statistics
                        </div>
                      </div>
                      <div className="chart-container">
                        <FaChartBar />
                        <div className="chart-data-icon">my-statify.com</div>
                      </div>
                      <div
                        className={`share-container-data ${
                          isDLoading ? "hidden" : ""
                        }`}
                      >
                        <FaCameraRetro onClick={downloadImage} />
                        <div className="share-data-icon">Share to my story</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatifyData;
