import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

const backendUri = process.env.REACT_APP_BACKEND_URI;

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [botGuilds, setBotGuilds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard useEffect");
    // 🔹 Intentar obtener el token desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    // 🔹 Si hay un token en la URL, guardarlo en localStorage y limpiar la URL
    if (urlToken) {
      localStorage.setItem("auth_token", urlToken);
      window.history.replaceState({}, document.title, "/dashboard");
    }

    // 🔹 Obtener el token desde localStorage
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    // 🔹 Obtener los datos del usuario
    fetch(`${backendUri}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error obteniendo usuario:", err));

    // 🔹 Obtener los servidores donde el bot está presente
    fetch(`${backendUri}/bot/guilds`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("print bot guilds: ", data.botGuilds);
        setBotGuilds(data.botGuilds);
      })
      .catch((err) => console.error("Error obteniendo servidores del bot:", err));
  }, [navigate]);

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {user ? (
          <div style={{ margin: "0 auto", width: "50%" }}>
            <h1>Welcome {user.username}</h1>
            <p>You have {user.ownedGuilds?.length} Servers</p>
            {user.ownedGuilds?.map((guild: any) => {
              const isBotInGuild = botGuilds.includes(guild.id);
              return (
                <div
                  key={guild.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "10px",
                    margin: "10px 0",
                    backgroundColor: isBotInGuild ? "#2ECC71" : "#E74C3C",
                  }}
                >
                  <h3>{guild.name}</h3>
                  <p>ID: {guild.id}</p>
                  <p>Bot {isBotInGuild ? "✅ Present" : "❌ Not Present"}</p>
                  {isBotInGuild && (
                    <button
                      onClick={() => navigate(`/dashboard/${guild.id}`)}
                      style={{ marginTop: "20px", padding: "10px 20px" }}
                    >
                      Open Dashboard
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading users...</p>
        )}
      </div>
    </div>
  );
};
