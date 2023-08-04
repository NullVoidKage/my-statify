import React from 'react';
import Welcome from './Welcome';
import { Footer } from './Footer';
import { MyStatifyChart } from './MyStatify';
import { StatifyCard } from './StatifyCard';
import Spinner from './Spinner';
import { Navbar } from './NavBar';
import RecentlyPlayedTracks from './RecentlyPlayed';
import TopTracksMenu from './TopTracksMenu';
import { Link } from 'react-router-dom';

const Home = ({ token, authUrl, userName, userPhoto, followers, country, url, error, isLoading, logout }: any) => {
  return (
    <div className="App">
      <header className="App-header">
      
        <div id="wrap">
          <div className="login-section">
            {!token ? (
              <>
                <Welcome />
                <a className="btn-slide" href={authUrl}>
                  <span className="circle">
                    <i className="fab fa-spotify"></i>
                  </span>
                  <span className="title">Login to Spotify</span>
                  <span className="title title-hover">Press to login</span>
                </a>
                <StatifyCard />
              </>
            ) : isLoading ? (
              <Spinner />
            ) : (
              <>
                <MyStatifyChart
                  token={token}
                  userName={userName}
                  userPhoto={userPhoto}
                  followers={followers}
                  country={country}
                  url={url}
                />
      
                 {/* <RecentlyPlayedTracks token={token} />
                <TopTracksMenu token={token} /> */}
                {/* Additional components can be added here */}
              </>
            )}
          </div>
        </div>
     
      </header>
    </div>
  );
};

export default Home;
