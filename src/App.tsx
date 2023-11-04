// App.jsx

import React, { useEffect, useState } from "react";
import "./App.scss";
import { Footer } from "./components/Footer";
import axios from "axios";
import { Navbar } from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import {MyAccount} from "./components/MyAccount";
import Home from "./components/Home";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { About } from "./components/AboutUs";
import { AUTH_SCOPES, SPOTIFY_CREDS, STATIFY_URL } from "./constants/constants";


function App() {
  const isLocalEnvironment = process.env.REACT_APP_ENV === 'local';


  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserID] = useState<string| null>(null);
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
      // Redirect back to the home page after successful login
      window.location.href = SPOTIFY_CREDS.REDIRECT_URI_LOCAL; // Update this with your actual home page URL
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
        const spotID = data.id; 
        setUserName(userName);
        setUserID(spotID);
        setUserPhoto(data.images[1]?.url || "");
        setFollowers(data.followers.total);
        setCountry(data.country);
        setBirthDate(data?.created_at || "");
        setUrl(data.external_urls.spotify);
        setError(null); // Clear the error state if successful
        setIsLoading(false); // Set loading state to false when the data is fetched successfully
        if (userName) {
          document.title = `My Statify - ${userName} Spotify Statistics`;
          await axios.post(`${STATIFY_URL}insert-user`, {
            SpotifyID: spotID,
            SpotifyUserName: userName
          });
          
     
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
//isLocalEnvironment ? SPOTIFY_CREDS.REDIRECT_URI_LOCAL : 
  const authUrl = `${SPOTIFY_CREDS.AUTH_ENDPOINT}?client_id=${SPOTIFY_CREDS.CLIENT_ID}&redirect_uri=${SPOTIFY_CREDS.REDIRECT_URI_PROD}&response_type=${SPOTIFY_CREDS.RESPONSE_TYPE}&scope=${AUTH_SCOPES.join("%20")}`;


  return (
    // <BrowserRouter>
    <div className="App">
      <Navbar
          userName={userName}
          onLogout={logout}
          userProfilePic={userPhoto}
          authUrl={authUrl}
          error={error}
          token={token}
        />

  
      <Routes>
        <Route path="/" element={<Home token={token} userName={userName} logout={logout} userPhoto={userPhoto} error={error} isLoading={isLoading} country={country} followers={followers} url={url} authUrl={authUrl} />} />
        <Route path="/my-account" element={<MyAccount token={token} userPhoto={userPhoto} userId={userId} userName={userName} onLogout={logout}/> } />


        <Route path="/privacy-policy" element={<PrivacyPolicy /> } />
        <Route path="/about" element={<About /> } />
      </Routes>
     <Footer />
      {/* Rest of the code */}

    </div>
    // </BrowserRouter>
  );
}

export default App;
