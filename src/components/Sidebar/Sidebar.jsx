import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutBox, setShowLogoutBox] = useState(false);

  const navItems = [
    { path: "/admin-dashboard", icon: "dashboard.png", label: "Dashboard" },
    { path: "/contact-center", icon: "chat.png", label: "Contact Center" },
    { path: "/analytics", icon: "analytics.png", label: "Analytics" },
   // { path: "/chatbot", icon: "chatbot.png", label: "Chatbot" },
    { path: "/team", icon: "team.png", label: "Team" },
    { path: "/settings", icon: "settings.png", label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {showLogoutBox && <div className="backdrop" onClick={() => setShowLogoutBox(false)}></div>}

      <div className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <img src="/assets/icons/hubly-logo.png" alt="Hubly Logo" />
          </div>

          <div className="nav-icons">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path} className="tooltip-container">
                <img
                  src={`/assets/icons/${item.icon}`}
                  alt={item.label}
                  className={location.pathname === item.path ? "active" : ""}
                />
                <span className="tooltip-text">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="profile-icon" onClick={() => setShowLogoutBox(true)}>
          <img src="/assets/icons/profile.png" alt="Profile" />
        </div>

        {showLogoutBox && (
          <div className="logout-confirm-box animate-slide-fade">
            <p>Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button className="cancel-btn" onClick={() => setShowLogoutBox(false)}>
                Cancel
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
