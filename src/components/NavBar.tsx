import React, { useState, useRef, useEffect } from "react";
import "../style/NavBar.scss";
import { FaChartBar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Spinner from "./Spinner";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = ({
  userName,
  userProfilePic,
  onLogout,
  error,

}: {
  userName: string | null;
  userProfilePic: string | null;
  onLogout: () => void;
  authUrl: string;
  error: string | null;

}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State variable for logout action
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();

  const handleToggleDropdown = () => {
    
    setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(logoutRef.current && logoutRef.current.contains(event.target as Node))
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true); // Set the logging out state to true
    setTimeout(() => {
      setIsLoggingOut(false); // Reset the logging out state after 2 seconds
      navigate("/"); // Redirect to the home page

      onLogout(); // Call the logout function passed as props
    }, 2000);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <a className="title" href="/">
            My Stat <div className="ify">ify</div>
          </a>
          <FaChartBar />
        </div>

        <div className="navbar-menu">
          {userName && (
            <div
              className="navbar-user"
              // onClick={handleToggleDropdown}
             
            >
              {userProfilePic && (
                <img className="user-pic" src={userProfilePic} alt="User" />
              )}
              
            </div>
            
          )}
          {userName && (
            <div className="navbar-user" onClick={handleToggleDropdown}  ref={dropdownRef}>
              <div className="navbar-username">{userName}</div>
              {isDropdownOpen ? (
                <FaChevronUp className="dropdown-icon" />
              ) : (
                <FaChevronDown className="dropdown-icon" />
              )}
              {isDropdownOpen && (
                <div className="dropdown">
                  <ul>
                  
                    <li onClick={() => navigate("/my-account")}>My Account</li>

                    <li
                      className="nav-list-2"
                      ref={logoutRef}
                      onClick={handleLogout} // Call handleLogout instead of onLogout
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isLoggingOut && <Spinner />}
    </nav>
  );
};
