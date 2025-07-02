import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import axios from "axios";
import io from "socket.io-client";

const socket = io("https://ticketing-backend-9uw2.onrender.com");

function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const roomId = selectedChat?._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", { roomId });

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://ticketing-backend-9uw2.onrender.com/api/messages/${roomId}`);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomId]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      roomId,
      sender: "admin",
      text: inputValue,
    };

    try {
      const savedMessage = await axios.post("https://ticketing-backend-9uw2.onrender.com/api/messages", newMessage);
      socket.emit("sendMessage", { roomId, message: savedMessage.data });
      setInputValue("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  if (!selectedChat) {
    return <div className="chat-window">Please select a chat</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Ticket# {selectedChat._id}</p>
        <img src="/assets/icons/lock.png" alt="lock" className="header-icon" />
      </div>

      <div className="chat-messages">
        <div className="chat-date-line">
          <hr />
          <span>Today</span>
          <hr />
        </div>

        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "" : "outgoing"}`}
            >
              {msg.sender === "user" && (
                <img
                  src={selectedChat.avatar || "/assets/icons/user.png"}
                  alt="User"
                  className="message-avatar"
                />
              )}
              <div className={`message-content ${msg.sender === "user" ? "" : "admin"}`}>
                <p className="sender-name">{msg.sender}</p>
                <p className="message-text">{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">No messages found.</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {selectedChat.status === "Resolved" ? (
        <div className="chat-resolved-msg">This chat has been resolved</div>
      ) : (
        <div className="chat-input-box">
          <input
            type="text"
            placeholder="Type here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <img
            src="/assets/icons/send.png"
            alt="Send"
            className="send-icon"
            onClick={handleSend}
          />
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
