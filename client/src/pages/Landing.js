// Landing.js
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/App.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-name">
          <p className="App-campus">Campus</p>
          <p className="App-lostfound">Lost & Found</p>
        </div>
        <div>
          <button className="enter-button" onClick={() => navigate("/login")}>
            Enter
          </button>
        </div>
      </header>
    </div>
  );
}

export default Landing;
