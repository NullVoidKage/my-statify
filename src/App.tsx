// App.jsx

import React, { useEffect, useState } from "react";
import "./App.scss";
import Welcome from "./components/Welcome";
import { Footer } from "./components/Footer";
import { MyStatifyChart } from "./components/MyStatify";
import { StatifyCard } from "./components/StatifyCard";
import axios from "axios";
import { Navbar } from "./components/NavBar";
import Spinner from "./components/Spinner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {MyAccount} from "./components/MyAccount";
import Home from "./components/Home";

function App() {
  const CLIENT_ID = '5b065bd3914a4865a90c0aed3e537510';
  // const REDIRECT_URI = "http://localhost:3000/";
  const REDIRECT_URI = "https://my-statify.vercel.app/callback";

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const AUTH_SCOPES = [
    "user-read-private",
    "user-read-currently-playing",
    "user-top-read",
    "user-follow-read",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-read-email",
    "playlist-modify-public",
    "user-modify-playback-state",
    "playlist-modify-private",
    "user-library-read",
  ];
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [followers, setFollowers] = useState<string | null>(null);
  const [birthdate, setBirthDate] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>("");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Add the error state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        ?.split("=")[1]!;

      window.location.hash = "";
      window.localStorage.setItem("token", token || "");
    }

    setToken(token || null);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Set loading state to true

      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Encoding": "gzip",
          },
        });

        const userName = data.display_name || data.id;
        setUserName(userName);
        setUserPhoto(data.images[1]?.url || "");
        setFollowers(data.followers.total);
        setCountry(data.country);
        setBirthDate(data?.created_at || "");
        setUrl(data.external_urls.spotify);
        setError(null); // Clear the error state if successful
        setIsLoading(false); // Set loading state to false when the data is fetched successfully
        if (userName) {
          document.title = `My Statify - ${userName} Spotify Statistics`;

         await axios.post("https://my-statify.vercel.app/api/insert-user", { SpotifyUserName: userName });
     
     
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Handle 401 Unauthorized error here
          setToken(null);
          setUserName(null);
          window.localStorage.removeItem("token");
          setError("Session expired. Please log in again.");
        } else {
          setError("Error fetching user data. Please try again.");
        }
        console.log("Error fetching user data:", error);
      }
      setIsLoading(false);
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUserName(null);
    window.localStorage.removeItem("token");
    document.title = `My Statify`;
    
  };

  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${AUTH_SCOPES.join(
    "%20"
  )}`;

  return (
    // <BrowserRouter>
    <div className="App">
      <Navbar
          userName={userName}
          onLogout={logout}
          userProfilePic={userPhoto}
          authUrl={authUrl}
          error={error}
          
        />

  
      <Routes>
        <Route path="/" element={<Home token={token} userName={userName} logout={logout} userPhoto={userPhoto} error={error} isLoading={isLoading} country={country} followers={followers} url={url} authUrl={authUrl} />} />
        <Route path="/my-account" element={<MyAccount token={token} userPhoto={userPhoto}/> } />
      </Routes>
     <Footer />
      {/* Rest of the code */}

    </div>
    // </BrowserRouter>
  );
}

export default App;
