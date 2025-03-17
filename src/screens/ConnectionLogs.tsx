import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backendUri = process.env.REACT_APP_BACKEND_URI;

export const ConnectionLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const navigate = useNavigate();
  const { guildId } = useParams(); // 🔹 Obtener guildId desde la URL

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    // 🔹 Obtener los logs del servidor específico
    fetch(`${backendUri}/logs/connections/${guildId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data.logs))
      .catch((err) => console.error("Error obteniendo logs:", err));
  }, [navigate, guildId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Registro de Conexiones - Servidor {guildId}</h1>
      <button onClick={() => navigate("/dashboard")}>⬅ Volver al Dashboard</button>
      <div style={{ margin: "0 auto", width: "70%", textAlign: "left" }}>
        {logs.length > 0 ? (
          logs.reverse().map((log, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <p>
                <strong>Usuario:</strong> {log.userId}
              </p>
              <p>
                <strong>Evento:</strong> {log.event}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(log.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Servidor:</strong> {log.guildId}
              </p>
            </div>
          ))
        ) : (
          <p>No hay registros de conexión para este servidor.</p>
        )}
      </div>
    </div>
  );
};
