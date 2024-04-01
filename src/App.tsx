import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "./firebaseConfig";

interface Evento {
  id: string;
  timestamp: string;
  event: string;
  userId: string;
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

const organizarEventosPorFecha = (eventos: Evento[]) => {
  return eventos.reduce((acc, evento) => {
    const fecha = new Date(evento.timestamp).toLocaleDateString();
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(evento);
    acc[fecha].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return acc;
  }, {} as Record<string, Evento[]>);
};

const App = () => {
  const [datos, setDatos] = useState<Record<string, Evento[]>>({});
  const [fechasOrdenadas, setFechasOrdenadas] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "voice_log"));
    const eventos = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Evento[];
    const datosPorFecha = organizarEventosPorFecha(eventos);
    setDatos(datosPorFecha);
    // Aquí ordenamos las fechas luego de organizar los eventos
    const fechasOrdenadas = Object.keys(datosPorFecha).sort((a, b) => {
      // Convertir la fecha de 'd/M/yyyy' a objetos Date para comparar
      const [diaA, mesA, añoA] = a.split("/").map(Number);
      const [diaB, mesB, añoB] = b.split("/").map(Number);
      // Date toma meses de 0-11, por eso restamos 1
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
          <h2>{dia}</h2>
          {datos[dia].map((evento) => (
            <div
              key={evento.id}
              style={{
                color: evento.event === "connected" ? "green" : evento.event.includes("self") ? "yellow" : "red",
              }}
            >
              {new Date(evento.timestamp).toLocaleTimeString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })} -{" "}
              {evento.event} - {userNames[evento.userId] || "Nombre no encontrado"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
