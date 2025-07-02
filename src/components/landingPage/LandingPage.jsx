import React from "react";
import "./LandingPage.css";
import ChatbotWidget from '../Chatbot/ChatbotWidget';
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/assets/icons/hubly-logo.png" alt="Logo" />
          <span>Hubly</span>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">Log in</Link>
          <Link to="/register" className="signup-btn">Sign Up</Link>

        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Grow Your Business Faster with Hubly CRM</h1>
          <p>Manage leads, automate workflows, and close deals effortlessly—all in one powerful platform.</p>
          <div className="cta-buttons">
            <button className="get-started">Get started</button>
            <button className="watch-video">
              <span className="play-icon">▶</span> Watch Video
            </button>
          </div>
        </div>

        <div className="hero-visuals">
          <img src="/assets/icons/Landing1.png" alt="Meeting" className="main-image" />
          <img src="/assets/icons/Landing2.png" alt="Calendar" className="calendar" />
          <img src="/assets/icons/Landing3.png" alt="Graph" className="graph" />
        </div>
      </div>

      {/* Trusted Logos */}
      <div className="trusted-logos">
        <img src="/assets/icons/Adobe.png" alt="Adobe" className="trusted-logo" />
        <img src="/assets/icons/Adobe.png" alt="Elastic" className="trusted-logo"/>
        <img src="/assets/icons/Adobe.png" alt="Opendoor" className="trusted-logo" />
        <img src="/assets/icons/Adobe.png" alt="Airtable" className="trusted-logo" />
      </div>
      <ChatbotWidget />
    </div>
  );
}

export default LandingPage;