import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const GuildDashboard: React.FC = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    margin: "10px auto",
    width: "200px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Server Dashboard</h1>
        <button onClick={() => navigate(`/connection-logs/${guildId}`)} style={buttonStyle}>
          Logs
        </button>
        <button onClick={() => navigate(`/analytics/${guildId}`)} style={buttonStyle}>
          Insights
        </button>
      </div>
    </div>
  );
};
