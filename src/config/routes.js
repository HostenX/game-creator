// IPs o URLs base
const LOCAL_IP = "http://localhost:3000";
const SERVER_IP = "https://192.168.43.48:3000"; // Cambia según tu configuración
const API_LOCAL = "https://localhost:7193";
const API_SERVER = "https://192.168.43.48:7193"; // Cambia según la IP del servidor

// Detecta si estás en localhost
const isLocalhost = window.location.hostname === "localhost";

// Configuración dinámica
const Config = {
  baseUrl: isLocalhost ? LOCAL_IP : SERVER_IP,
  apiUrl: isLocalhost ? API_LOCAL : API_SERVER,
};

export default Config;
