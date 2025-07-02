import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Analytics from "./components/analytics/Analytics";
import TeamManagement from "./components/Team/TeamManagement";
import ChatSection from "./components/Chat/ChatSection";
import Settings from "./components/settings/settings";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import LandingPage from "./components/landingPage/LandingPage";

import PrivateRoute from "./components/PrivateRoute"; // ⬅️ Make sure this file exists

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact-center"
          element={
            <PrivateRoute>
              <ChatSection />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact-center/:ticketId"
          element={
            <PrivateRoute>
              <ChatSection />
            </PrivateRoute>
          }
        />

        <Route
          path="/team"
          element={
            <PrivateRoute>
              <TeamManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
