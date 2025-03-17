import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./screens/Login";
import { Dashboard } from "./screens/Dashboard";
import { ConnectionLogs } from "./screens/ConnectionLogs";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/connection-logs/:guildId" element={<ConnectionLogs />} />
      </Routes>
    </Router>
  );
};

export default App;
