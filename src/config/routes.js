// IPs o URLs base
const LOCAL_IP = "http://localhost:8090";
const SERVER_IP = "https://192.168.43.48:8090"; // Cambia según tu configuración
const API_LOCAL = "https://localhost:4450/GameAPI";
const API_SERVER = "https://192.168.43.48:4450/GameAPI"; // Cambia según la IP del servidor

// Detecta si estás en localhost
const isLocalhost = window.location.hostname === "localhost";

// Configuración dinámica
const Config = {
  baseUrl: isLocalhost ? LOCAL_IP : SERVER_IP,
  apiUrl: isLocalhost ? API_LOCAL : API_SERVER,
};

export default Config;
