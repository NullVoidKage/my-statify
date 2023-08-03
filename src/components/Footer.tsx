

import React, { useEffect, useState } from "react";
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
// import ProfileStatify from "./statify-profile";

const ContactForm = () => {
  const [status, setStatus] = useState("Submit");
  // useEffect(() => {
  //   // Call the ProfileStatify function when the component mounts
  //   ProfileStatify()
  //     .then((response) => {
  //       console.log(response); // Log the response from the database operation
  //     })
  //     .catch((error) => {
  //       console.error("Error executing ProfileStatify:", error);
  //     });
  // }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");

    const { name, email,message } = e.target.elements;
    const data = {
      name: name.value,
      email: email.value,
      message: message.value,
    };

    try {
      const response = await fetch("https://my-statify.vercel.app/api/contact", {
        // mode: 'no-cors',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === "Message Sent") {
        setStatus("Sent");
      } else {
        setStatus("Error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="contact-us">Contact Us</div>
      <input type="text" name="name" placeholder="Name" required />
      <input type="text" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required></textarea>
      <button type="submit" disabled={status === "Sending..."}>
        {status}
      </button>
    </form>
  );
};

export const Footer = () => {
  return (
    <div>
      <footer className="footer-distributed">
        {/* ... Your existing footer content ... */}
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
          <ContactForm />
        </div>
      </footer>
    </div>
  );
};

