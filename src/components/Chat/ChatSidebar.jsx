import React from "react";
import "./ChatSidebar.css";

function ChatSidebar({ chats, selectedChatId, onSelectChat }) {
  return (
    <div className="chat-sidebar">
      <h2 className="sidebar-heading">Contact Center</h2>
      <div className="sidebar-subheading">Chats</div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${chat._id === selectedChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.avatar || "/assets/icons/user.png"}
              alt="User"
              className="chat-avatar"
            />
            <div className="chat-info">
              <div className="chat-name">{chat.name || "Unnamed"}</div>
              <div className="chat-preview">
                {typeof chat.firstMessage === "string" && chat.firstMessage.trim()
                  ? chat.firstMessage
                  : "No message"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
