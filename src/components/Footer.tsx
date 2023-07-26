import React from "react";
import {
  FaChartBar,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import "../style/Footer.scss";

export const Footer = () => {
  return (
    <div>
      <footer className="footer-distributed">
        <div className="footer-left">
          <h3>
            My Statify
            <span>
              <FaChartBar />
            </span>
          </h3>

          <div className="footer-links">
            <div>
              <a href="#">Home</a>
            </div>
			<div className="separator"></div>

            <div className="p-and-p">
              <a href="#">Privacy & Policy</a>
            </div>
			<div className="separator"></div>

            <div className="about">
              <a href="#">About</a>
            </div>
          </div>

          <div className="disclaimer">
            This app is not affiliated with Spotify. The use of Spotify's name,
            logo, and trademarks is for descriptive purposes only and does not
            imply endorsement or sponsorship by Spotify.
          </div>
          <p className="footer-company-name">My Statify © 2023</p>
          <div className="footer-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaTiktok />
            </a>
            <a href="#">
              <FaLinkedin />
            </a>
            <a href="#">
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="footer-right">
         

          <form action="#" method="post">
          <div className="contact-us">Contact Us</div>
            <input type="text" name="email" placeholder="Email" />
            <textarea name="message" placeholder="Message"></textarea>
            <button>Send</button>
          </form>
        </div>
      </footer>
    </div>
  );
};
