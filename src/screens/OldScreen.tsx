import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore"; // Importa Timestamp de firebase
import db from "../firebaseConfig";

interface Evento {
  id: string;
  timestamp: Timestamp; // Cambiado a Timestamp de Firestore
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
}

const organizarEventosPorFecha = (eventos: Evento[]) => {
  return eventos.reduce((acc, evento) => {
    // Convertir el timestamp de Firestore a Date
    const fecha = evento.timestamp.toDate();
    const fechaConDia = `${fecha.toLocaleDateString("es-AR", { weekday: "long" })}, ${fecha.toLocaleDateString(
      "es-AR"
    )}`;
    if (!acc[fechaConDia]) {
      acc[fechaConDia] = [];
    }
    acc[fechaConDia].push(evento);
    acc[fechaConDia].sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());
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

export const OldScreen = () => {
  const [datos, setDatos] = useState<Record<string, Evento[]>>({});
  const [fechasOrdenadas, setFechasOrdenadas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar el loading spinner
  const [fetched, setFetched] = useState(false);
  const [password, setPassword] = useState("");

  const handleDescargarDatos = () => {
    descargarComoJson(datos, "datos_voice_log");
  };

  const fetchData = async () => {
    console.log("fetching data...");
    setIsLoading(true); // Mostrar el spinner al iniciar la búsqueda de datos
    const querySnapshot = await getDocs(collection(db, "voice_log"));
    const eventos = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Evento[];
    const datosPorFecha = organizarEventosPorFecha(eventos);
    setDatos(datosPorFecha);
    const fechasOrdenadas = Object.keys(datosPorFecha).sort((a, b) => {
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
    setIsLoading(false); // Ocultar el spinner cuando los datos estén cargados
  };

  const fetchRecentData = async () => {
    console.log("fetching recent data....");
    setIsLoading(true); // Mostrar el spinner al iniciar la búsqueda de datos recientes
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const q = query(collection(db, "voice_log"), where("timestamp", ">=", Timestamp.fromDate(threeDaysAgo)));

    const querySnapshot = await getDocs(q);
    const eventos = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Evento[];
    const datosPorFecha = organizarEventosPorFecha(eventos);
    setDatos(datosPorFecha);
    const fechasOrdenadas = Object.keys(datosPorFecha).sort((a, b) => {
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
    setIsLoading(false); // Ocultar el spinner cuando los datos estén cargados
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
      {!fetched && password === "saborcito" && (
        <>
          <button onClick={fetchData}>Summon Thor's Insights</button>
          <button onClick={fetchRecentData}>Recent Summon Thor's Insights</button>
        </>
      )}
      {isLoading ? ( // Mostrar el spinner si isLoading es true
        <div>Loading...</div>
      ) : (
        fechasOrdenadas.map((dia) => (
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
                {evento.timestamp
                  .toDate()
                  .toLocaleTimeString("es-AR", { hour12: false, timeZone: "America/Argentina/Buenos_Aires" })}{" "}
                - {evento.event}
                {evento.game && "(" + evento.game + ")"} - {userNames[evento.userId] || "Nombre no encontrado"}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
