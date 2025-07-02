import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import TicketCard from "./TicketCard/TicketCard";
import Sidebar from "../Sidebar/Sidebar";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chatusers");
        const data = await response.json();
        console.log("🎯 Fetched chat users:", data);

        const enriched = await Promise.all(
          data.map(async (ticket, index) => {
            let firstMessage = "No message";

            try {
              const msgRes = await fetch(`https://ticketing-backend-9uw2.onrender.com/api/messages/${ticket._id}`);
              const messages = await msgRes.json();

              if (Array.isArray(messages) && messages.length > 0) {
                // ✅ take the first message from DB
                firstMessage = messages[0].text;
              }
            } catch (err) {
              console.warn("⚠️ Failed to fetch message for", ticket._id);
            }

            const created = new Date(ticket.createdAt || Date.now());
            const postedAt = `Posted at ${created.toLocaleDateString()} ${created.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}`;
            const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return {
              id: `CHAT-${String(index + 1).padStart(3, '0')}`,
              status: ticket.status || "Unresolved",
              message: firstMessage,
              postedAt,
              time,
              user: {
                avatar: "/assets/icons/user.png",
                name: ticket.name || "No Name",
                phone: ticket.phoneNumber || "N/A",
                email: ticket.email || "N/A",
              },
            };
          })
        );

        setTickets(enriched);
      } catch (error) {
        console.error("❌ Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const tabMatch =
      activeTab === "all" ||
      ticket.status?.toLowerCase() === activeTab.toLowerCase();

    const term = searchTerm.toLowerCase();
    const inMessage = ticket.message?.toLowerCase().includes(term);
    const inName = ticket.user?.name?.toLowerCase().includes(term);
    const inEmail = ticket.user?.email?.toLowerCase().includes(term);

    return tabMatch && (inMessage || inName || inEmail);
  });

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h2>Dashboard</h2>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search for ticket"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundImage: "url('/assets/icons/searchbar.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "12px center",
                backgroundSize: "16px",
                paddingLeft: "36px",
              }}
            />
          </div>

          <div className="ticket-tabs">
            <span
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <img
                src="/assets/icons/sms.png"
                alt="All Tickets"
                className="tab-icon"
              />
              All Tickets
            </span>
            <span
              className={`tab ${activeTab === "resolved" ? "active" : ""}`}
              onClick={() => setActiveTab("resolved")}
            >
              Resolved
            </span>
            <span
              className={`tab ${activeTab === "unresolved" ? "active" : ""}`}
              onClick={() => setActiveTab("unresolved")}
            >
              Unresolved
            </span>
          </div>

          <div className="tab-underline" />
        </div>

        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))
        ) : (
          <p style={{ padding: "20px", textAlign: "center" }}>No tickets found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
