import React from "react";
import headphone from '../../src/imgs/headphone.png';
import "../style/ErrorPage.scss"; // Import the CSS file

interface ErrorPageProps {
  errorMessage: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage }) => {
  return (
    <div className="error-container">
      <img src={headphone} alt="Error" className="error-image" />
      <p className="error-message">{errorMessage}</p>
      <p>Flaticon license</p>
    </div>
  );
};

export default ErrorPage;
