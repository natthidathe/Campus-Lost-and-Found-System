import React from "react";
import './css/App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import logo from './assets/logo.png';

function Home() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
