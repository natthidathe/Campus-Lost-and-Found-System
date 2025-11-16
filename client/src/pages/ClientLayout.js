// src/pages/ClientLayout.js
import React, { useState } from "react";
import "../css/client.css";
import { FiBell } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "aws-amplify/auth";


// Sidebar used in all client pages
// Sidebar used in all client pages
const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase()
      ? "sidebar-item active"
      : "sidebar-item";

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <button
            className="menu-icon-vertical"
            aria-label="Close menu"
            onClick={onClose}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* make this a flex column that fills height */}
        <div className="sidebar-menu">
          <Link
            to="/home"
            className={isActive("/home")}
            onClick={onClose}
          >
            Home
          </Link>

          <Link
            to="/report-lost"
            className={isActive("/report-lost")}
            onClick={onClose}
          >
            Report
          </Link>

          {/* --- pinned at bottom --- */}
          <div className="sidebar-bottom">
            <button
              className="sidebar-item logout-button"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


// Reusable layout wrapper for all client pages
function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout functionality
  const handleLogout = async () => {
  try {
    await signOut();          
    navigate("/login");       
  } catch (error) {
    console.error("Error signing out:", error);
  }
};


  const handleBellClick = () => {
    if (location.pathname === "/notifications") {
      navigate(-1);
    } else {
      navigate("/notifications");
    }
  };

  return (
    <div className="page">
      {/* Sidebar drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Top bar */}
      <header className="topbar">
        <button
          className="icon-button menu-icon"
          aria-label="Menu"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="topbar-right">
          <button
            className="icon-button home-outline"
            aria-label="Home"
            onClick={() => navigate("/home")}
          />
          <button
            className="icon-button"
            onClick={handleBellClick}
          >
            <FiBell size={22} />
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="content">
        <div className="content-inner">{children}</div>
      </main>
    </div>
  );
}

export default ClientLayout;
