import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import io from "socket.io-client";

const socket = io("https://ticketing-backend-9uw2.onrender.com"); // update if deployed

function ChatbotForm({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const chatBodyRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", { roomId: userId });

    socket.on("receiveMessage", (msg) => {
      if (msg.sender === "admin") {
        setMessages((prev) => [...prev, { type: "bot", text: msg.text }]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: messageText }]);
    setInput("");

    try {
      // Only on first message — send form data + message
      if (!hasSentFirstMessage) {
        const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/chatusers/chat-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phone,
            email: formData.email,
            message: messageText,
          }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.error || "Submission failed");

        setUserId(data.data._id);
        setHasSentFirstMessage(true);
        setFormSubmitted(true);

        // Load previous chat
        const msgRes = await fetch(`https://ticketing-backend-9uw2.onrender.com/api/messages/${data.data._id}`);
        const msgs = await msgRes.json();
        const formatted = msgs.map((m) => ({
          type: m.sender === "user" ? "user" : "bot",
          text: m.text,
        }));
        setMessages(formatted);
      } else {
        await fetch("https://ticketing-backend-9uw2.onrender.com/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: userId, sender: "user", text: messageText }),
        });

        socket.emit("sendMessage", {
          roomId: userId,
          message: { sender: "user", text: messageText },
        });
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (formData.name && formData.phone && formData.email) {
      setFormSubmitted(true);
      setMessages([
        { type: "bot", text: "How can I help you?" },
        { type: "bot", text: "Ask me anything!" },
      ]);
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="chatbot-form-container">
      <div className="chatbot-header">
        <div className="chatbot-title-group">
          <img src="/assets/icons/chatbot1.png" alt="Chatbot" className="chatbot-header-icon" />
          <span className="chatbot-title">Hubly</span>
        </div>
        <button className="chatbot-close" onClick={onClose}>✕</button>
      </div>

      <div className="chatbot-body" ref={chatBodyRef}>
        <div className="user-message">Hey!</div>

        {!formSubmitted && (
          <div className="bot-message">
            <img src="/assets/icons/chatbot1.png" alt="bot" className="form-avatar" />
            <div className="chat-form-card">
              <p className="form-title">Introduce Yourself</p>

              <label>Your name</label>
              <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} />

              <label>Your Phone</label>
              <input type="text" name="phone" placeholder="+1 (000) 000-0000" value={formData.phone} onChange={handleChange} />

              <label>Your Email</label>
              <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} />

              <button className="form-submit" onClick={handleFormSubmit}>
                Thank You!
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          placeholder="Write a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!formSubmitted || !formData.name || !formData.phone || !formData.email}
        />
        <button onClick={handleSend} disabled={!formSubmitted || !formData.name || !formData.phone || !formData.email}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatbotForm;
