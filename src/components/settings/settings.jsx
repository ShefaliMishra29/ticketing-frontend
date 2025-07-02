import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./settings.css";

function Settings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ STEP 1: Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const [firstName, ...rest] = data.name?.split(" ") || [""];
          const lastName = rest.join(" ");
          setFormData({
            firstName,
            lastName,
            email: data.email || "",
          });
        } else {
          console.error("Profile fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ STEP 2: Verify current password
  const handleCurrentPasswordChange = async (e) => {
    const value = e.target.value;
    setCurrentPassword(value);
    setPasswordError("");
    setIsCurrentPasswordValid(null);

    if (value.length < 4) return;

    try {
      const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/users/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: value }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsCurrentPasswordValid(true);
      } else {
        setIsCurrentPasswordValid(false);
        setPasswordError("Password doesn't match");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      setPasswordError("Server error");
      setIsCurrentPasswordValid(false);
    }
  };

  // ✅ STEP 3: Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCurrentPasswordValid && newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    const updatePayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
    };

    if (isCurrentPasswordValid && newPassword) {
      updatePayload.password = newPassword;
    }

    try {
      const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully");
        localStorage.setItem("user", JSON.stringify(data.user));
        setNewPassword("");
        setConfirmNewPassword("");
        setCurrentPassword("");
        setIsCurrentPasswordValid(null);
        setPasswordError("");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="settings-layout">
      <Sidebar />
      <div className="settings-content">
        <h2 className="page-title">Settings</h2>

        <div className="settings-card">
          <h3 className="card-title">Edit Profile</h3>

          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="info-icon">i</span>
              </div>
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                />
              </div>
              {isCurrentPasswordValid === false && (
                <p className="error-text">{passwordError}</p>
              )}
              {isCurrentPasswordValid === true && (
                <p className="success-text">Password verified</p>
              )}
            </div>

            {isCurrentPasswordValid && (
              <>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
