import React from "react";
import "../style/ErrorPage.scss"; // Create a CSS file for styling the error page

interface ErrorPageProps {
  errorMessage: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <path
            fill="#FF4545"
            d="M32 0C14.33 0 0 14.33 0 32s14.33 32 32 32 32-14.33 32-32S49.67 0 32 0zm0 60c-15.46 0-28-12.54-28-28s12.54-28 28-28 28 12.54 28 28-12.54 28-28 28z"
          />
          <path
            fill="#FFF"
            d="M32 12a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm2 32a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm-4 0a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"
          />
        </svg>
      </div>
      <p className="error-message">{errorMessage}</p>
      <div className="attribution">
        Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a> are licensed by CC BY 4.0
      </div>
    </div>
  );
};

export default ErrorPage;
