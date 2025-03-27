// src/screens/AnalyticsChart.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export const AnalyticsChart: React.FC = () => {
  const { guildId } = useParams();
  const [data, setData] = useState([]);
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("12");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAnalytics = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    fetch(`${process.env.REACT_APP_BACKEND_URI}/analytics/time-in-server/${guildId}/${year}/${month}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const chartData = json.Users.map((user: any) => ({
          name: user.name,
          hours: user.amountOfTimeInHours,
        }));
        setData(chartData);
      })
      .catch((err) => console.error("Error al obtener datos analíticos:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ textAlign: "center" }}>Total time connected per user</h2>

      {/* 🔽 Filtros de año y mes */}
      <div style={{ marginBottom: 20 }}>
        <label>
          Year:{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ marginRight: 20, width: "6ch" }}
          />
        </label>
        <label>
          Month:{" "}
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => {
              const m = (i + 1).toString().padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </select>
        </label>
        <button onClick={fetchAnalytics} style={{ marginLeft: 20 }}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="h" />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#4caf50" name="Hours Connected" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};
