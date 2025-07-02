import React, { useState } from "react";
import "./Chatbot.css";
import ChatbotForm from "./ChatbotForm";

function ChatbotWidget() {
  const [showForm, setShowForm] = useState(false);

  const handleToggle = () => setShowForm(true);

  return (
    <>
      {showForm ? (
        <ChatbotForm onClose={() => setShowForm(false)} />
      ) : (
        <div className="chatbot-widget">
          {/* Message Popup */}
          <div className="chat-popup" onClick={handleToggle}>
            <img
              src="/assets/icons/chatbot1.png"
              alt="Chatbot"
              className="popup-avatar"
            />
            <div className="popup-text">
              👋 Want to chat about Hubly? I'm a chatbot here to help you find your way.
            </div>
            <button
              className="popup-close"
              onClick={(e) => {
                e.stopPropagation(); // prevents click bubbling to popup
                setShowForm(false);
              }}
            >
              ✕
            </button>
          </div>

          {/* Launcher Icon (bottom right) */}
          <div className="chat-launcher-icon" onClick={handleToggle}>
            <img src="/assets/icons/chatbot3.png" alt="Chat" />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
