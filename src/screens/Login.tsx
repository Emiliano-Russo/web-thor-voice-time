import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    // 🔹 If already logged in, redirect to dashboard
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("Redirecting to /dashboard");
      navigate("/dashboard"); // 🔹 Redirect automatically to Dashboard
    }
  }, []);

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.REACT_APP_BACKEND_URI}/auth/discord/callback`);

    // 🔹 Include "guilds" in the scopes
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email%20guilds`;

    window.location.href = discordAuthUrl;
  };

  const handleInviteBot = () => {
    const botClientId = "1215816515211759707"; //process.env.REACT_APP_DISCORD_BOT_CLIENT_ID;
    const permissionInteger = "277058964480";
    console.log("botClientId", botClientId);
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=${permissionInteger}&scope=bot`;

    window.open(inviteUrl, "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="./thor.png" style={{ height: "100px", borderRadius: "10px", margin: "10px" }}></img>
        <h1 style={styles.title}>Welcome to Thor Voice Time</h1>
        <p style={styles.subtitle}>Manage your Discord voice activity logs with ease.</p>
        <button onClick={handleLogin} style={styles.loginButton}>
          Sign in with Discord
        </button>

        <p style={styles.orText}>Don't have the bot yet?</p>

        <button onClick={handleInviteBot} style={styles.inviteButton}>
          Invite the Bot
        </button>
      </div>
    </div>
  );
};

// 🔹 Inline styles for simplicity
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#2c3e50",
  },
  card: {
    textAlign: "center",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#34495e",
    color: "#ecf0f1",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    width: "350px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  loginButton: {
    backgroundColor: "#5865F2",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "15px",
  },
  orText: {
    margin: "10px 0",
    fontSize: "14px",
  },
  inviteButton: {
    backgroundColor: "#1abc9c",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
