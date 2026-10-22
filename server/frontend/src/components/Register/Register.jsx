import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!userName || !firstName || !lastName || !email || !password) {
      setMessage("Please fill in all five required fields.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/djangoapp/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const json = await res.json();
      if (json.status === "Authenticated" || json.userName) {
        setIsSuccess(true);
        setMessage(`Registration successful! Welcome, ${json.userName}.`);
        sessionStorage.setItem("username", json.userName);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setIsSuccess(false);
        setMessage(json.error || json.message || "Registration failed. Username may already exist.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Network error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register_container">
      <div className="register_card">
        <h2 className="register_title">Sign Up</h2>
        <p className="register_subtitle">Create your Cars Dealership account</p>

        {message && (
          <div className={`register_alert ${isSuccess ? "alert_success" : "alert_error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register_form">
          <div className="form_group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="firstname">First Name</label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="lastname">Last Name</label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form_group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register_btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="register_footer">
          Already have an account? <a href="/login">Log in here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
