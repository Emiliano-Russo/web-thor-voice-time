import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./screens/Login";
import { Dashboard } from "./screens/Dashboard";
import { ConnectionLogs } from "./screens/ConnectionLogs";
import { GuildDashboard } from "./screens/GuildDashboard";

const App: React.FC = () => {
  // otros campos según necesites
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:guildId" element={<GuildDashboard />} />
        <Route path="/connection-logs/:guildId" element={<ConnectionLogs />} />
      </Routes>
    </Router>
  );
};

export default App;
