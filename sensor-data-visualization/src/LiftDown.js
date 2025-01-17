import React from "react";
import "./GoingDown.css"; // Create this CSS file for styling
import { FaAnglesDown } from "react-icons/fa6";
import "./App.css"; // Add keyframes here

const LiftDown = () => {
  return (
    <div className="going-down-container">
       <div className="bounce">
    <FaAnglesDown size={200} color=" #530430" />
  </div>
      <h1 className="going-down-title">You're Going Down!</h1>
      <div className="arrow-container">
        <img
          src="https://img.icons8.com/?size=100&id=fW8wvICtEgcp&format=png&color=000000"          alt="Arrow pointing down"
          className="arrow-gif"
        />
      </div>
      <p className="going-down-text">Stay safe and enjoy your journey!</p>
    </div>
  );
};

export default LiftDown;
