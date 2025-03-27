import React from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // 🔹 Eliminar token de sesión
    navigate("/"); // 🔹 Redirigir al login
  };

  return (
    <header style={styles.header}>
      <div
        style={{ ...styles.logoContainer, cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate("/dashboard");
        }}
      >
        <img src="/thor.png" alt="Thor Voice Time" style={styles.logo} />
        <h1 style={styles.title}>Thor Voice Time</h1>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Log out
      </button>
    </header>
  );
};

// 🔹 Estilos en línea (puedes moverlos a un CSS si prefieres)
const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "50px",
    height: "50px",
    marginRight: "15px",
    borderRadius: "10px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
};
