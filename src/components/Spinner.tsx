import React from "react";
import "../style/Spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
