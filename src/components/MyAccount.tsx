import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/MyAccount.scss";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface MyAccountProps {
  token: string | null;
  userPhoto: string;
  userName: string | null;
  userId: string | null;
  onLogout: () => void;
}

export function MyAccount({
  token,
  userPhoto,
  userId,
  userName,
  onLogout,
}: MyAccountProps) {
  const [data, setData] = useState<any>(null);
  const [statifyData, setStatifyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: spotifyData } = await axios.get(
          "https://api.spotify.com/v1/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Encoding": "gzip",
            },
          }
        );

        setData(spotifyData);
      } catch (err: any) {
        setError(err.message);
      }

      setIsLoading(false);
    };

    const fetchStatifyData = async () => {
      try {
        const response = await axios.get(
          `https://my-statify.vercel.app/api/select-user?SpotifyUserID=${userId}`
        );

        console.log(response.data);
        setStatifyData(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchStatifyData();

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    console.log("Called Logout");
    setIsLoggingOut(true); // Set the logging out state to true
    setTimeout(() => {
      setIsLoggingOut(false); // Reset the logging out state after 2 seconds
      navigate("/"); // Redirect to the home page

      onLogout(); // Call the logout function passed as props
    }, 2000);
  };

  const deleteAccount = async () => {
    try {
      // Send a DELETE request to the Vercel API endpoint for deleting the user
      const response = await axios.delete(
        `https://my-statify.vercel.app/api/delete-user?SpotifyUserID=${userId}`
      );

      console.log(userId);
      console.log(response);

      if (response.status === 200) {
        handleLogout();
        console.log("Account deleted successfully");
      } else {
        console.error("An error occurred while deleting the account.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the account.");
      console.error(error);
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${month} ${day}, ${year} ${time}`;
  };

  return (
    <div className="my-account-app">
      <div className="account-container">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          // Render your data here
          <div className="account-content">
            <img src={userPhoto} alt="User Photo" />
            <div className="welcome-user">Welcome, {data?.display_name}</div>
            <div className="account1">Spotify ID: {data?.id}</div>
            <div className="account1">Statify ID: {statifyData?.id}</div>
            <div className="account1">
              Created At: {formatDate(statifyData?.createdat)}
            </div>
            <div className="delete-button">
              Delete statify account{" "}
              <FaTrash onClick={() => setShowDeleteModal(true)} />
            </div>
          </div>
        )}
        <div></div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-my-account">Delete My Statify Account?</div>
            <div className="are-you-sure">
              Are you sure you want to delete your account completely?
            </div>
            <input
              type="text"
              placeholder="Type 'DELETE' to confirm"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
            />
            {confirmInput !== "DELETE" && (
              <div className="error-message">
                Please type 'DELETE' to confirm
              </div>
            )}

            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={confirmInput !== "DELETE"}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoggingOut && <Spinner />}
    </div>
  );
}
