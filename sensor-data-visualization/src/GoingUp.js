import React from "react";
import "./GoingDown.css"; // Create this CSS file for styling
import { LuChevronsUp } from "react-icons/lu";import "./App.css"; // Add keyframes here

const GoingUp = () => {
  return (
    <div className="going-down-container">
       <div className="bounce">
    <LuChevronsUp size={200} color=" #530430" />
  </div>
      <h1 className="going-down-title">You're Going Up!</h1>
      <div className="arrow-container">
        <img
          src="https://img.icons8.com/?size=100&id=WalKi77wMcLV&format=png&color=000000"
          alt="Arrow pointing down"
          className="arrow-gif"
        />
      </div>
      <p className="going-down-text">Stay safe and enjoy your journey!</p>
    </div>
  );
};

export default GoingUp;
