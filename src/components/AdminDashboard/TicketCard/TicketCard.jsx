import React from "react";
import { useNavigate } from "react-router-dom";
import "./TicketCard.css";

function TicketCard({ id, status, message, postedAt, time, user }) {
  const navigate = useNavigate();

  const handleOpenTicket = (e) => {
    e.preventDefault();
    navigate(`/contact-center/${id}`);
  };

  return (
    <div className="ticket-card">
      {/* Top Section */}
      <div className="ticket-card-header">
        <div className="ticket-id">
          <span
            className="status-dot"
            style={{
              backgroundColor:
                status?.toLowerCase() === "resolved" ? "#34A853" : "#FBBC04",
            }}
          />
          <strong>Ticket# {id}</strong>
        </div>
        <div className="ticket-time">
          <p className="posted-time">{postedAt}</p>
          <p className="exact-time">{time}</p>
        </div>
      </div>

      {/* Message Section */}
      <div className="ticket-message">{message || "No message"}</div>

      <hr />

      {/* Footer Section */}
      <div className="ticket-card-footer">
        <div className="user-info">
          <img src={user?.avatar || "/assets/icons/user.png"} alt={user?.name || "User"} />
          <div>
            <p className="name">{user?.name || "Unknown"}</p>
            <p className="phone">{user?.phone || "N/A"}</p>
            <p className="email">{user?.email || "N/A"}</p>
          </div>
        </div>

        <a href="#" className="open-ticket" onClick={handleOpenTicket}>
          Open Ticket
        </a>
      </div>
    </div>
  );
}

export default TicketCard;
