import React, { useEffect, useState } from "react";
import "./AddMemberModal.css";

function AddMemberModal({ onClose, onMemberAdded, onMemberUpdated, editData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Member",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        role: editData.role || "Member",
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        method: editData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      };

      const url = editData
        ? `https://ticketing-backend-9uw2.onrender.com/api/team/${editData._id}`
        : `https://ticketing-backend-9uw2.onrender.com/api/team`;

      const res = await fetch(url, config);

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Server error:", error);
        return;
      }

      const data = await res.json();

      if (editData) {
        onMemberUpdated(data);
      } else {
        onMemberAdded(data);
      }

      onClose(); // ✅ close modal
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editData ? "Edit Member" : "Add Team Member"}</h2>
        <p className="modal-desc">New teammate</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>User name</label>
          <input
            type="text"
            placeholder="User name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <label>Email ID</label>
          <input
            type="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <label>Designation</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {editData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
