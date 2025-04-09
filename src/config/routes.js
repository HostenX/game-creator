// IPs o URLs base para la aplicación React
const LOCAL_IP = "http://localhost:3000";  // URL base para la app React en local
const SERVER_IP = "https://192.168.43.48:3000";  // URL base para la app React en servidor

// URLs base para la API
const API_LOCAL = "https://gamificationudecapi.azurewebsites.net";  // URL de la API en Azure
const API_SERVER = "https://gamificationudecapi.azurewebsites.net";  // URL de la API en Azure

// Detecta si estás en localhost
const isLocalhost = window.location.hostname === "localhost";

// Configuración dinámica
const Config = {
  baseUrl: isLocalhost ? LOCAL_IP : SERVER_IP,  // URL base de tu aplicación React
  apiUrl: isLocalhost ? API_LOCAL : API_SERVER,  // URL base de tu API
};

export default Config;