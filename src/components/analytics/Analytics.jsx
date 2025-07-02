import React, { useEffect, useState } from "react";
import "./Analytics.css";
import Sidebar from "../Sidebar/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    total: 0,
    resolved: 0,
    averageReplyTime: 0,
    missedChatsPerWeek: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("https://ticketing-backend-9uw2.onrender.com/api/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  const resolvedPercent =
    analytics.total > 0
      ? Math.round((analytics.resolved / analytics.total) * 100)
      : 0;

  return (
    <div className="analytics-layout">
      <Sidebar />
      <div className="analytics-content">
        <h2 className="analytics-title">Analytics</h2>

        {/* Missed Chats Line Chart */}
        <div className="analytics-section">
          <h3 className="section-heading">Missed Chats</h3>
          <div className="chart-container" style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={analytics.missedChatsPerWeek}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="missed" stroke="#003366" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Analytics Boxes */}
        <div className="analytics-metrics">
          {/* Average Reply Time */}
          <div className="metric-card">
            <h3 className="section-heading green">Average Reply Time</h3>
            <p className="section-description">
              For highest customer satisfaction rates you should aim to reply to
              an incoming customer’s message in 15 seconds or less.
            </p>
            <p className="value-text green">{analytics.averageReplyTime} secs</p>
          </div>

          {/* Resolved Tickets */}
          <div className="metric-card">
            <h3 className="section-heading green">Resolved Tickets</h3>
            <p className="section-description">
              Callback system with proactive invitations improves customer engagement.
            </p>
            <div className="resolved-chart">
              <CircularProgressbar
                value={resolvedPercent}
                text={`${resolvedPercent}%`}
                styles={buildStyles({
                  pathColor: "#00C000",
                  textColor: "#00C000",
                  trailColor: "#eee",
                  textSize: "24px",
                })}
              />
            </div>
          </div>

          {/* Total Chats */}
          <div className="metric-card">
            <h3 className="section-heading_3">Total Chats</h3>
            <p className="section-description">
              This metric shows the total number of chats across all channels.
            </p>
            <p className="value-text green">{analytics.total} Chats</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
