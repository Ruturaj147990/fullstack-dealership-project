import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("username");
    if (user && user !== "null" && user !== "undefined") {
      setUsername(user);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/djangoapp/logout");
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/";
  };

  return (
    <header className="site_header">
      <div className="header_container">
        <a href="/" className="header_brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.9 2 11v5c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
          <span className="brand_text">Cars Dealership</span>
        </a>

        <nav className="header_nav">
          <a href="/" className="nav_link">Home</a>
          <a href="/static/About.html" className="nav_link">About Us</a>
          <a href="/static/Contact.html" className="nav_link">Contact Us</a>
          {username && (
            <a href="/postreview/1" className="nav_link review_dealer_nav_btn">Review Dealer</a>
          )}
        </nav>

        <div className="header_auth">
          {username ? (
            <div className="user_session_bar">
              <span className="logged_in_user">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <strong id="user_display_name">{username}</strong>
              </span>
              <button onClick={handleLogout} className="btn_logout">Logout</button>
            </div>
          ) : (
            <div className="guest_auth_buttons">
              <a href="/login" className="btn_login">Login</a>
              <a href="/register" className="btn_register">Register</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
