// StatifyService.ts

import axios from "axios";
interface Artist {
  id: string;
  name: string;

  popularity: string;
  genres: String[];
  isFollowing: boolean; 
}
export const fetchWeeklyListening = async (token: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: "short_term",
        limit: 1,
      },
    });

    return data.items[0];
  } catch (error) {
    console.log("Error fetching weekly listening:", error);
    return null;
  }
}
export const fetchTopTracks = async (token: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: "short_term",
        limit: 1,
      },
    });

    return data.items[0];
  } catch (error) {
    console.log("Error fetching top tracks:", error);
    return null;
  }
};

export const fetchTopArtists = async (token: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: "short_term",
        limit: 1,
      },
    });

    return data.items[0];
  } catch (error) {
    console.log("Error fetching top artists:", error);
    return null;
  }
};
export const fetchTopAlbums = async (option: string, token: string) => {
  try {
    let timeRange = "short_term"; // Default time range for 4 weeks

    if (option === "6 weeks") {
      timeRange = "medium_term";
    } else if (option === "all time") {
      timeRange = "long_term";
    }

    const { data: topArtistsData } = await axios.get(
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

    const albumRequests = topArtistsData.items.map(async (artist: Artist) => {
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
      console.log(album);

      // Get the first artist and image from the album
      if (album && album.artists.length > 0 && album.images.length > 0) {
        const artist = album.artists[0].name;
        const image = album.images[0].url;
        return { ...album, artist, image };
      }

      return null;
    });

    // Wait for all album requests to complete
    const albums = await Promise.all(albumRequests);

    // Filter out any null values and get the first album from the resulting array
    const topAlbum = albums.find((album) => album !== null);
    console.log(topAlbum);
    return topAlbum;
  } catch (error) {
    console.log("Error fetching top albums:", error);
    return null;
  }
  

};

export const fetchUserProfile = async (token: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return null;
  }
};


export const fetchLikedSongs = async (token: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 1, // Set the limit to 1 to only get the total count
      },
    });

    return data.total;
  } catch (error) {
    console.log("Error fetching liked songs:", error);
    return null;
  }
};







export const fetchFollowingUsers = async (token: string) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/following?type=artist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("users");
    // console.log(response);
    const followingUsers = response.data.artists.items.map(
      (user: { id: string; name: string }) => ({
        id: user.id,
        name: user.name,
      })
    );

    // console.log("users");
    // console.log(followingUsers);

    const followingCount = response.data.artists.total; // Get the total count of following users
    // console.log("Following Count:", followingCount);
    return followingCount;
  } catch (error) {
    console.error("Error fetching following users:", error);
    return 0; // Return 0 if there's an error
  }
};



