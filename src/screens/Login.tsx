import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("rediriendo a /dashboard");
      navigate("/dashboard"); // 🔹 Redirige automáticamente al Dashboard
    }
  }, []);

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.REACT_APP_BACKEND_URI}/auth/discord/callback`);

    // 🔹 Incluye "guilds" en los scopes
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds`;

    window.location.href = discordAuthUrl;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Login with Discord
      </button>
    </div>
  );
};
