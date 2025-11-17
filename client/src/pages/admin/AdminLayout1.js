import React, { useState } from "react";
import "../../css/admin.css";
import { FiBell } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "aws-amplify/auth";


// Sidebar used in all admin pages
const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase()
      ? "sidebar-item active"
      : "sidebar-item";

  return (
    <>
      {/* click outside to close */}
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

        {/* flex column so we can push logout to bottom */}
        <div className="sidebar-menu">
          <Link
            to="/admin/dashboard"
            className={isActive("/admin/dashboard")}
            onClick={onClose}
          >
            Home
          </Link>

          <Link
            to="/admin/items"
            className={isActive("/admin/items")}
            onClick={onClose}
          >
            Item List
          </Link>

          <Link
            to="/admin/report-found"
            className={isActive("/admin/report-found")}
            onClick={onClose}
          >
            Report
          </Link>
          <Link
            to="/admin/ownerlist"
            className={isActive("/admin/ownerlist")}
            onClick={onClose}
          >
            Owner List
          </Link>

        

          <Link
            to="/admin/matching"
            className={isActive("/admin/matching")}
            onClick={onClose}
          >
            Matching List
          </Link>

          {/* ---- Logout pinned at bottom ---- */}
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

// Reusable layout wrapper for all admin pages
function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          {/* home icon – go to admin dashboard */}
          <button
            className="icon-button home-outline"
            aria-label="Home"
            onClick={() => navigate("/admin/dashboard")}
          />
          {/* bell icon */}
          <button className="icon-button" onClick={handleBellClick}>
            <FiBell size={22} />
          </button>
        </div>
      </header>

      {/* Main content area – page-specific content goes here */}
      <main className="content">
        <div className="content-inner">{children}</div>
      </main>
    </div>
  );
}

export default ClientLayout;