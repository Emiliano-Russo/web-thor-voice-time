import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const GuildDashboard: React.FC = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Server Dashboard</h1>
        <button onClick={() => navigate(`/connection-logs/${guildId}`)} style={{ padding: "10px 20px" }}>
          Last 7 days connection logs
        </button>
        {/* Ultimas conexiones por usuario */}
      </div>
    </div>
  );
};
