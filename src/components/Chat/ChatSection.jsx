import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ChatSection.css";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatDetails from "./ChatDetails";
import Sidebar from "../Sidebar/Sidebar";

function ChatSection() {
  const { ticketId } = useParams();
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChats = async () => {
    try {
      const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/chatusers");
      const users = await res.json();

      const enrichedChats = await Promise.all(
        users.map(async (user) => {
          let preview = "No message";

          try {
            const msgRes = await fetch(`https://ticketing-backend-9uw2.onrender.com/api/messages/${user._id}`);
            const msgs = await msgRes.json();
            if (Array.isArray(msgs) && msgs.length > 0) {
              preview = msgs[0].text || "No message";
            }
          } catch (err) {
            console.warn(`Couldn't fetch messages for ${user._id}`);
          }

          return {
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            avatar: "/assets/icons/user.png",
            messages: [preview],
            firstMessage: preview,
            assignedTo: user.assignedTo || "",
            status: user.status || "Unresolved",
          };
        })
      );

      setChatUsers(enrichedChats);

      if (ticketId) {
        const selected = enrichedChats.find((u) => u._id === ticketId);
        setSelectedChat(selected || enrichedChats[0] || null);
      } else {
        setSelectedChat(enrichedChats[0] || null);
      }
    } catch (err) {
      console.error("Failed to load chat users:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [ticketId]);

  return (
    <div className="chat-section">
      <Sidebar />
      <ChatSidebar
        chats={chatUsers}
        selectedChatId={selectedChat?._id}
        onSelectChat={(chat) => setSelectedChat(chat)}
      />
      <ChatWindow selectedChat={selectedChat} />
      <ChatDetails
        selectedChat={selectedChat}
        onTicketUpdated={fetchChats} // ✅ Add this to trigger refresh
      />
    </div>
  );
}

export default ChatSection;
