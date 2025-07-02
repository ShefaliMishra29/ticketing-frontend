import React from "react";
import { useNavigate } from "react-router-dom";
import "./TicketCard.css";

function TicketCard({ id, status, message, postedAt, time, user }) {
  const navigate = useNavigate();

  const handleOpenTicket = (e) => {
    e.preventDefault(); // prevent default link behavior
    navigate(`/contact-center/${id}`); // route with ticket id
  };

  return (
    <div className="ticket-card">
      {/* Top Section */}
      <div className="ticket-card-header">
        <div className="ticket-id">
          <span
            className="status-dot"
            style={{
              backgroundColor: status === "resolved" ? "#34A853" : "#FBBC04",
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
      <div className="ticket-message">{message}</div>

      <hr />

      {/* Footer Section */}
      <div className="ticket-card-footer">
        <div className="user-info">
          <img src={user.avatar} alt={user.name} />
          <div>
            <p className="name">{user.name}</p>
            <p className="phone">{user.phone}</p>
            <p className="email">{user.email}</p>
          </div>
        </div>

        {/* 👇 Updated Open Ticket link */}
        <a href="#" className="open-ticket" onClick={handleOpenTicket}>
          Open Ticket
        </a>
      </div>
    </div>
  );
}

export default TicketCard;
