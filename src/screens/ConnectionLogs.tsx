import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backendUri = process.env.REACT_APP_BACKEND_URI;

interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  userId: string;
  guildId: string;
}

const userNames: Record<string, string> = {
  "301206456185913346": "Altoemilius",
  "339950447810969612": "fabimontans",
  "588152515946872883": "DiegoPlusUltra",
  "523684629379547162": "Saborcito",
  "625835283333775360": "Nalesh",
  "868627769465139312": "Jorge",
};

const eventoToColor = (event: string) => {
  switch (event) {
    case "connected":
      return "#00FF7F"; // Spring Green
    case "disconnected":
      return "#FF4500"; // Orange Red
    case "started-game":
      return "#1E90FF"; // Dodger Blue
    case "end-game":
      return "#FF69B4"; // Hot Pink
    case "online":
      return "#00BFFF"; // Deep Sky Blue
    case "offline":
      return "#A52A2A"; // Brown
    case "self-muted":
    case "self-unmuted":
      return "#FFD700"; // Gold
    default:
      return "#00CED1"; // Dark Turquoise
  }
};

// 🔹 Función para agrupar eventos por día
const organizarEventosPorFecha = (eventos: LogEntry[]) => {
  return eventos.reduce((acc, evento) => {
    const fecha = new Date(evento.timestamp);
    const fechaConDia = `${fecha.toLocaleDateString("es-AR", { weekday: "long" })}, ${fecha.toLocaleDateString(
      "es-AR"
    )}`;

    if (!acc[fechaConDia]) {
      acc[fechaConDia] = [];
    }

    acc[fechaConDia].push(evento);
    acc[fechaConDia].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return acc;
  }, {} as Record<string, LogEntry[]>);
};

export const ConnectionLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsOrganizados, setLogsOrganizados] = useState<Record<string, LogEntry[]>>({});
  const navigate = useNavigate();
  const { guildId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${backendUri}/logs/connections/${guildId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs);
        setLogsOrganizados(organizarEventosPorFecha(data.logs));
      })
      .catch((err) => console.error("Error obteniendo logs:", err));
  }, [navigate, guildId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Registro de Conexiones - Servidor {guildId}</h1>
      <button onClick={() => navigate("/dashboard")}>⬅ Volver al Dashboard</button>
      <div style={{ margin: "0 auto", width: "70%", textAlign: "center" }}>
        {Object.keys(logsOrganizados).length > 0 ? (
          Object.keys(logsOrganizados).map((fecha) => (
            <div key={fecha}>
              <h2>{fecha}</h2>
              {logsOrganizados[fecha].map((log) => (
                <div
                  key={log.id}
                  style={{
                    color: eventoToColor(log.event),
                    padding: "5px 0",
                  }}
                >
                  {new Date(log.timestamp).toLocaleTimeString("es-AR", {
                    hour12: false,
                    timeZone: "America/Argentina/Buenos_Aires",
                  })}{" "}
                  - {log.event} - {userNames[log.userId] || log.userId}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No hay registros de conexión para este servidor.</p>
        )}
      </div>
    </div>
  );
};
