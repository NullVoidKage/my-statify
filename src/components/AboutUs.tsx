import React from "react"; // Import your CSS file
import "../style/AboutUs.scss";

export function About() {
  return (
    <div className="about">
      <h2>About my-statify</h2>
      <p>
        my-statify is a project developed by Nikko Ferwelo, a self-taught
        developer passionate about providing users with insightful statistics
        about their Spotify usage.
      </p>

      <p>
        With my-statify, you can uncover a wealth of information that goes
        beyond just your favorite songs. Dive into your top tracks, discover
        your most-played artists, explore your music personality, and even share
        your musical journey with friends through captivating visual charts.
      </p>
    </div>
  );
}
