import React, { useState, useEffect } from "react";
import "./ChatDetails.css";

function ChatDetails({ selectedChat, onTicketUpdated }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [hasAssigned, setHasAssigned] = useState(false);
  const [status, setStatus] = useState("Unresolved");
  const [isResolved, setIsResolved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      setAssignedTo(selectedChat.assignedTo || "");
      setHasAssigned(false);
      setStatus(selectedChat.status || "Unresolved");
      setIsResolved(selectedChat.status === "Resolved");
    }
  }, [selectedChat]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/team");
        const data = await res.json();
        setTeamMembers(data);
      } catch (err) {
        console.error("❌ Failed to fetch team members:", err);
      }
    };
    fetchTeam();
  }, []);

  const updateAssignedTo = async (value) => {
    try {
      const res = await fetch(
        `https://ticketing-backend-9uw2.onrender.com/api/chat-users/${selectedChat._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignedTo: value }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setHasAssigned(true);
        onTicketUpdated?.();
      } else {
        console.error("❌ Update failed:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  const updateStatus = async (value) => {
    try {
      const res = await fetch(
        `https://ticketing-backend-9uw2.onrender.com/api/chat-users/${selectedChat._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: value }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        onTicketUpdated?.();
      } else {
        console.error("❌ Status update failed:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  const handleAssignChange = (e) => {
    const value = e.target.value;
    setAssignedTo(value);
    updateAssignedTo(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (value === "Resolved") {
      setShowConfirm(true);
    } else {
      setStatus("Unresolved");
      setIsResolved(false);
      updateStatus("Unresolved");
      selectedChat.status = "Unresolved";
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setStatus("Resolved");
    setIsResolved(true);
    updateStatus("Resolved");
    selectedChat.status = "Resolved";
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setStatus("Unresolved");
  };

  if (!selectedChat) return null;

  return (
    <div className="chat-details">
      <div className="details-header">
        <img
          src={selectedChat.avatar || "/assets/icons/user.png"}
          alt="User"
          className="details-avatar"
        />
        <h3>{selectedChat.name}</h3>
      </div>

      <div className="details-section">
        <label>Name</label>
        <input type="text" value={selectedChat.name} readOnly />

        <label>Phone</label>
        <input type="text" value={selectedChat.phoneNumber || selectedChat.phone} readOnly />

        <label>Email</label>
        <input type="email" value={selectedChat.email} readOnly />
      </div>

      <div className="details-section">
        <label>Assign Teammate</label>
        <select value={assignedTo} onChange={handleAssignChange} disabled={hasAssigned}>
          <option value="">-- Select Teammate --</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>

        <label>Status</label>
        <select value={status} onChange={handleStatusChange} disabled={isResolved}>
          <option>Unresolved</option>
          <option>Resolved</option>
        </select>

        {showConfirm && (
          <div className="confirmation-box">
            <p>Chat will be closed</p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatDetails;
