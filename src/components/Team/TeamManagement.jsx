import React, { useState, useEffect } from "react";
import "./TeamManagement.css";
import Sidebar from "../Sidebar/Sidebar";
import { FaUserPlus } from "react-icons/fa";
import AddMemberModal from "./AddMemberModal";

function TeamManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/team", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTeamMembers(data);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      }
    };

    if (token) fetchMembers();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://ticketing-backend-9uw2.onrender.com/api/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTeamMembers((prev) => prev.filter((member) => member._id !== id));
      } else {
        console.error("Failed to delete member");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  return (
    <div className="team-layout">
      <Sidebar />
      <div className="team-content">
        <h2 className="team-title">Team</h2>

        <div className="team-table">
          <div className="team-header">
            <span>Full Name</span>
            <span>Phone</span>
            <span>Email</span>
            <span>Role</span>
            <span></span>
          </div>

          {teamMembers.map((member) => (
            <div className="team-row" key={member._id}>
              <div className="team-name">
                <img
                  src="/assets/icons/user2.png"
                  alt="Avatar"
                  className="avatar"
                />
                <span>{member.name}</span>
              </div>
              <span>{member.phone || "+1 (000) 000-0000"}</span>
              <span>{member.email}</span>
              <span>{member.role || "User"}</span>
              <span className="actions">
                {member.role !== "Admin" && (
                  <>
                    <img
                      src="/assets/icons/edit.png"
                      alt="Edit"
                      className="icon-img"
                      onClick={() => {
                        setEditMember(member);
                        setShowModal(true);
                      }}
                    />
                    <img
                      src="/assets/icons/delete.png"
                      alt="Delete"
                      className="icon-img"
                      onClick={() => handleDelete(member._id)}
                    />
                  </>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="add-btn-wrapper">
          <button
            className="add-team-btn"
            onClick={() => {
              setEditMember(null);
              setShowModal(true);
            }}
          >
            <FaUserPlus className="add-icon" style={{ marginRight: "6px" }} />
            Add Team members
          </button>
        </div>
      </div>

      {showModal && (
        <AddMemberModal
          onClose={() => {
            setShowModal(false);
            setEditMember(null);
          }}
          onMemberAdded={(newMember) =>
            setTeamMembers((prev) => [...prev, newMember])
          }
          onMemberUpdated={(updatedMember) =>
            setTeamMembers((prev) =>
              prev.map((m) =>
                m._id === updatedMember._id ? updatedMember : m
              )
            )
          }
          editData={editMember}
        />
      )}
    </div>
  );
}

export default TeamManagement;
