import React from "react";
import headphone from '../../src/imgs/headphone.png';
import "../style/ErrorPage.scss"; // Import the CSS file
import { FaRegSadCry } from "react-icons/fa";

interface ErrorPageProps {
  errorMessage: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage }) => {
  return (
    <div className="error-container">
      <FaRegSadCry className='error-icon'/>
      <p className="error-message">{errorMessage}</p>
      <div className="license-icon">Flaticon license</div>
    </div>
  );
};

export default ErrorPage;
