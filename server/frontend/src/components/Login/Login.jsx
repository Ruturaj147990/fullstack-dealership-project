import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!userName || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/djangoapp/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      });

      const json = await res.json();
      if (json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        window.location.href = "/";
      } else {
        setMessage(json.error || "Invalid username or password");
      }
    } catch (err) {
      setMessage("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="login_card">
        <h2 className="login_title">Welcome Back</h2>
        <p className="login_subtitle">Sign in to your Cars Dealership account</p>

        {message && <div className="login_alert alert_error">{message}</div>}

        <form onSubmit={handleSubmit} className="login_form">
          <div className="form_group">
            <label htmlFor="login_username">Username</label>
            <input
              id="login_username"
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="login_password">Password</label>
            <input
              id="login_password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login_btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login_footer">
          Don't have an account? <a href="/register">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
