import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/TopTracksMenu.scss";
import { FaSpotify, FaPlusCircle, FaCheck, FaRegHeart,FaHeart } from "react-icons/fa";
import Spinner from "./Spinner";
import ErrorPage from "./ErrorPage";

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: {
    name: string;
    images: Image[];
  };
  liked: boolean;
  uri: string; // Add the uri property
  addedToQueue: boolean; // Add the addedToQueue property
}

interface Artist {
  id: string;
  name: string;
  images: Image[];
  popularity: string;
  genres: String[];
  isFollowing: boolean; // Add the isFollowing property
}

interface Image {
  url: string;
  width: number;
  height: number;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
}

interface TopTracksProps {
  token: string;
}

const TopTracksMenu = ({ token }: TopTracksProps) => {
  const [selectedOption, setSelectedOption] = useState("4 weeks");
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isAddingToQueue, setIsAddingToQueue] = useState<string[]>([]);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [spotifyURL, setSpotifyURL] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopTracks(selectedOption);
    fetchTopArtists(selectedOption);
    fetchTopAlbums(selectedOption);
    fetchTopGenres(selectedOption);
    fetchCurrentlyPlaying();
  }, [selectedOption]);

  const fetchTopTracks = async (option: string) => {
    try {
      let timeRange = "short_term"; // Default time range for 4 weeks
    
      if (option === "6 weeks") {
        timeRange = "medium_term";
      } else if (option === "all time") {
        timeRange = "long_term";
      }
    
      const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: timeRange,
          limit: 10,
        },
      });
    
      // Extract track IDs from the fetched data
      const trackIds = data.items.map((track: any) => track.id);
    
      let likedTracks: boolean[] = [];
      
      // Check if there are track IDs before fetching liked tracks
      if (trackIds.length > 0) {
        try {
          const likedTracksResponse = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              ids: trackIds.join(","), // Pass the track IDs as a comma-separated string
            },
          });
    
          likedTracks = likedTracksResponse.data;
        } catch (likedTracksError) {
          console.error("Error fetching liked tracks:", likedTracksError);
        }
      }
    
      // Combine the liked status with the track data
      const tracksWithLikedStatus = data.items.map((track: any, index: number) => ({
        ...track,
        liked: likedTracks[index] || false, // Default to false if likedTracks[index] is undefined
      }));
    
      setTopTracks(tracksWithLikedStatus);
    } catch (error: any) {
      setError(error.response);
      console.log("Error fetching top tracks:", error);
    }
    
    
  };

  
  

  const fetchTopArtists = async (option: string) => {
    try {
      let timeRange = "short_term"; // Default time range for 4 weeks

      if (option === "6 weeks") {
        timeRange = "medium_term";
      } else if (option === "all time") {
        timeRange = "long_term";
      }

      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: timeRange,
            limit: 10,
          },
        }
      );

      const topArtistsData = await Promise.all(
        data.items.map(async (artist: Artist) => {
          const { data: followingData } = await axios.get(
            `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artist.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const isFollowing = followingData[0];
          return { ...artist, isFollowing };
        })
      );

      setTopArtists(topArtistsData);
      console.log(topArtistsData);
    } catch (error:any) {
      setError(error.response)
      console.log("Error fetching top artist:", error);
    }
  };

  const fetchTopAlbums = async (option: string) => {
    try {
      let timeRange = "short_term"; // Default time range for 4 weeks

      if (option === "6 weeks") {
        timeRange = "medium_term";
      } else if (option === "all time") {
        timeRange = "long_term";
      }

      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: timeRange,
            limit: 10,
          },
        }
      );

      const albums = await Promise.all(
        data.items.map(async (artist: Artist) => {
          const { data: albumData } = await axios.get(
            `https://api.spotify.com/v1/artists/${artist.id}/albums`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                include_groups: "album",
                limit: 1,
              },
            }
          );

          const album = albumData.items[0];
          return album;
        })
      );

      setTopAlbums(albums);
    }catch (error:any) {
      setError(error.response)
      console.log("Error fetching top albums:", error);
    }
  };

  const fetchTopGenres = async (option: string) => {
    try {
      let timeRange = "short_term"; // Default time range for 4 weeks

      if (option === "6 weeks") {
        timeRange = "medium_term";
      } else if (option === "all time") {
        timeRange = "long_term";
      }
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: "long_term", // Fetch top artists for all time
            limit: 10, // Set the desired limit
          },
        }
      );

      const topArtistIds = data.items.map((artist: Artist) => artist.id);

      const genreResponses = await Promise.all(
        topArtistIds.map((id: string) =>
          axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      const topGenres = genreResponses.map((response: any) => {
        const artist = response.data;
        return artist.genres;
      });

      const genres = topGenres.flat();

      // Count the occurrence of each genre
      const genreCounts: { [genre: string]: number } = {};
      genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Sort genres by occurrence in descending order
      const sortedGenres = Object.keys(genreCounts).sort(
        (a, b) => genreCounts[b] - genreCounts[a]
      );

      setTopGenres(sortedGenres);
    } catch (error:any) {
      setError(error.response)
      console.log("Error fetching top genres:", error);
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsCreatingPlaylist(false);
    setIsAddingToQueue([]);
  };

  const createPlaylist = async () => {
    setIsCreatingPlaylist(true);

    try {
      const { data } = await axios.post(
        "https://api.spotify.com/v1/me/playlists",
        {
          name: "Top Tracks Playlist",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const playlistId = data.id;

      const trackUris = topTracks.map((track) => track.uri);

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

      setIsCreatingPlaylist(false);
      window.location.href = `https://open.spotify.com/playlist/${playlistId}`;
    } catch (error:any) {
      setError(error.response)
      console.log("Error creating playlist:", error);
      setIsCreatingPlaylist(false);
    }
  };

  const fetchCurrentlyPlaying = async () => {
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
      console.log(data);
      if (data.is_playing === true) {
        setIsSongPlaying(true);
        console.log(data.is_playing);
      } else {
        setIsSongPlaying(false);
        console.log(data.is_playing);
      }
    } catch (error:any) {
      setError(error.response)
      // setError("Error fetching currently playing track. Please try again.");
      console.log("Error fetching currently playing track:", error);
    }
  };
  const handleAddToQueue = async (trackId: string) => {
    try {
      setIsAddingToQueue((prevAddingToQueue) => [
        ...prevAddingToQueue,
        trackId,
      ]);

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

      setTopTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.id === trackId ? { ...track, addedToQueue: true } : track
        )
      );

      console.log("Track added to queue");
    } catch (error:any) {
      setError(error.response)
      console.log("Error adding track to queue:", error);
    } finally {
      setIsAddingToQueue((prevAddingToQueue) =>
        prevAddingToQueue.filter((id) => id !== trackId)
      );
    }
  };

  const renderContent = () => {
    return topSpotify();
  };

  function topSpotify() {
    return (
      <div>
        {topTracksDisplay()}
        {topArtistDisplay()}
        {/* {topAlbumDisplay()} */}
        {topGenresDisplay()}
      </div>
    );
  }

  function topTracksDisplay() {
    return (
      <div className="top-tracks-content">
        <div className="header-top-tracks">Top Tracks</div>

        <div className="tracks-list">
          {topTracks.map((track, index) => (
            <div key={track.id} className="track-card">
              <div className="track-number">{index + 1}</div>
              <img
                className="track-image"
                src={track.album.images[0].url}
                alt="Album Cover"
              />
              <div className="track-info">
                <div className="track-name">{track.name}</div>

                <div className="track-artists">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </div>
                <div className="spotify-track-container">
                {track.liked ? <FaHeart className="liked-icon" /> : <FaRegHeart className="not-liked-icon" />}

                  {isSongPlaying ? (
                    isAddingToQueue.includes(track.id) && isSongPlaying ? (
                      <>
                        {track.addedToQueue ? (
                          <FaCheck className="added-to-queue-icon" />
                        ) : null}
                      </>
                    ) : (
                      <>
                        {track.addedToQueue ? (
                          <FaCheck className="added-to-queue-icon" />
                        ) : (
                          <FaPlusCircle
                            className="add-to-queue-icon"
                            onClick={() => handleAddToQueue(track.id)}
                          />
                        )}
                      </>
                    )
                  ) : (
                    ""
                  )}
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSpotify className="spotify-icon" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="create-playlist-button"
          onClick={createPlaylist}
          disabled={isCreatingPlaylist}
        >
          {isCreatingPlaylist ? <Spinner /> : "Create Playlist"}
        </button>
      </div>
    );
  }

  function topArtistDisplay() {
   

    const handleSpotifyLinkClick = (artistId: any) => {
      const modifiedURL = `https://open.spotify.com/artist/${artistId}/?ref=YOUR_TRACKING_PARAMETER`;
      setSpotifyURL(modifiedURL);
      window.open(modifiedURL, "_blank");
    };
    return (
      <div className="top-artist-content">
        <div className="header-top-artist">Top Artists</div>

        <div className="artist-list">
          {topArtists.map((artist, index) => (
            <div key={artist.id} className="artist-card">
              <div className="artist-number">{index + 1}</div>
              <img
                className="artist-image"
                src={artist.images[0].url}
                alt="Album Cover"
              />
              <div className="artist-info">
                <div className="artist-name">{artist.name} </div>
                <div className="follow-status">
                      {artist.isFollowing ? "Following" : ""}
                    </div>
                <div className="spotify-artist-container">
                  <div className="artists-link">
                    <FaSpotify
                      className={`spotify-artist ${
                        artist.isFollowing ? "following" : ""
                      }`}
                      onClick={() => handleSpotifyLinkClick(artist.id)}
                    />
                      
                    <div className="artist-popularity">
                      #{artist.popularity}
                    </div>
                 
                  </div>

                  <div className="artists-genres">
                    {artist.genres
                      .map((genre) => genre.slice(0, 20))
                      .join(", ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function topAlbumDisplay() {
    return (
      <div className="top-tracks-content">
        <div className="header-top-tracks">Top Albums</div>

        {topAlbums.map((album, index) => (
          <div key={album.id} className="track-item">
            <div className="track-number">{`${index + 1}`}</div>
            <img
              className="track-image"
              src={album.images[0].url}
              alt="Album Cover"
            />
            <div className="artist-info">
              <div className="albums-name">{album.name}</div>
            </div>
            <div className="spotify-icon-container">
              <a
                href={`https://open.spotify.com/album/${album.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
              >
                <FaSpotify className="spotify-icon" />
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function topGenresDisplay() {
    const topFiveGenres = topGenres.slice(0, 10);
    return (
      <div className="genre-parent">
        <div className="top-genre-header">Top Genres</div>
        <div className="top-genre-content">
          {topFiveGenres.map((genre, index) => (
            <div key={genre} className="genre-item">
              <div className="genre-info">
                <div className="genre-name">{genre}</div>
              </div>
              <div className="spotify-genre-container">
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(
                    genre
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="genre-link"
                >
                  <FaSpotify className="spotify-genre-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (

    <div>
      {error?<ErrorPage errorMessage={error}/>:
    <div className="topTracks-parent">
      <ul className="top-tracks-menu">
        <li
          className={selectedOption === "4 weeks" ? "active" : ""}
          onClick={() => handleOptionClick("4 weeks")}
        >
          1 Month
        </li>
        <li
          className={selectedOption === "6 weeks" ? "active" : ""}
          onClick={() => handleOptionClick("6 weeks")}
        >
          6 Months
        </li>
        <li
          className={selectedOption === "all time" ? "active" : ""}
          onClick={() => handleOptionClick("all time")}
        >
          All Time
        </li>
      </ul>
      {renderContent()}
    </div>
}
    </div>
  );
};

export default TopTracksMenu;
