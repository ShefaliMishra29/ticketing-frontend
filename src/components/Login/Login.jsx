import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://ticketing-backend-9uw2.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error("Server did not return valid JSON.");
      }

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin-dashboard");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="hubly-logo">
          <img src="/assets/icons/hubly-logo.png" alt="Hubly Logo" />
          <span>Hubly</span>
        </div>

        <div className="login-form-wrapper">
          <h3 className="form-title">Sign in to your Hubly Account</h3>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <button type="submit">Sign In</button>

            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>

            <p className="signup-link">
              Don’t have an account? <Link to="/register">Create an account</Link>
            </p>

            {error && <p className="error-text">{error}</p>}
          </form>
        </div>
      </div>

      <div className="login-right">
        <img src="/assets/icons/image 1.png" alt="Login visual" />
      </div>
    </div>
  );
}

export default Login;
