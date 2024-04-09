import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "./firebaseConfig";

interface Evento {
  id: string;
  timestamp: string;
  event: string;
  userId: string;
  game?: string;
  // otros campos según necesites
}

const userNames = {
  "301206456185913346": "Altoemilius",
  "339950447810969612": "fabimontans",
  "588152515946872883": "DiegoPlusUltra",
  "523684629379547162": "Saborcito",
  "625835283333775360": "Nalesh",
  "868627769465139312": "Jorge",
};

function eventoToColor(event: string) {
  switch (event) {
    case "connected":
      return "green";
      break;
    case "disconnected":
      return "#e32428";
      break;
    case "started-game":
      return "#b3ecf1";
      break;
    case "end-game":
      return "pink";
      break;
    case "online":
      return "#3ded97";
      break;
    case "offline":
      return "#680c07";
      break;
    case "self-muted":
      return "yellow";
      break;
    case "self-unmuted":
      return "yellow";
      break;
    default:
      return "blue";
      break;
  }
}

const organizarEventosPorFecha = (eventos: Evento[]) => {
  return eventos.reduce((acc, evento) => {
    // Obtener la fecha y el día de la semana
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
  }, {} as Record<string, Evento[]>);
};

const descargarComoJson = (datos, nombreArchivo) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(datos))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${nombreArchivo}.json`;

  link.click();
};

const App = () => {
  const [datos, setDatos] = useState<Record<string, Evento[]>>({});
  const [fechasOrdenadas, setFechasOrdenadas] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [password, setPassword] = useState("");

  const handleDescargarDatos = () => {
    descargarComoJson(datos, "datos_voice_log");
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "voice_log"));
    const eventos = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Evento[];
    const datosPorFecha = organizarEventosPorFecha(eventos);
    setDatos(datosPorFecha);
    // Aquí ordenamos las fechas luego de organizar los eventos
    const fechasOrdenadas = Object.keys(datosPorFecha).sort((a, b) => {
      // Extraer la parte de la fecha sin el día de la semana para comparar
      const fechaAString = a.substring(a.indexOf(",") + 2);
      const fechaBString = b.substring(b.indexOf(",") + 2);
      const [diaA, mesA, añoA] = fechaAString.split("/").map(Number);
      const [diaB, mesB, añoB] = fechaBString.split("/").map(Number);
      const fechaA = new Date(añoA, mesA - 1, diaA);
      const fechaB = new Date(añoB, mesB - 1, diaB);

      return fechaA.getTime() - fechaB.getTime();
    });

    setFechasOrdenadas(fechasOrdenadas);
    setFetched(true);
  };

  console.log("fechas ordenadas: ", fechasOrdenadas);

  return (
    <div className="App">
      <img src={require("./assets/thor.jpg")} alt="Thor" />
      <button onClick={handleDescargarDatos}>Magic Download</button>
      {password !== "saborcito" && (
        <input
          placeholder="Password?"
          style={{ textAlign: "center", marginTop: "10px" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      {!fetched && password === "saborcito" && <button onClick={fetchData}>Summon Thor's Insights</button>}
      {fechasOrdenadas.map((dia) => (
        <div key={dia}>
          {/* Aquí se muestra la fecha con el día de la semana incluido */}
          <h2>{dia}</h2>
          {datos[dia].map((evento) => (
            <div
              key={evento.id}
              style={{
                color: eventoToColor(evento.event),
              }}
            >
              {new Date(evento.timestamp).toLocaleTimeString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })} -{" "}
              {evento.event}
              {evento.game && "(" + evento.game + ")"} - {userNames[evento.userId] || "Nombre no encontrado"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
