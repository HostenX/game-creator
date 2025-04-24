import axios from "axios";
import Config from "../config/routes";
import sha256 from "crypto-js/sha256";

// Importa la configuración

const apiUrl = Config.apiUrl;

//========================Usuarios==============================

// Función para iniciar sesión
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/Usuario/login`, formData);
    return response.data;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error en la autenticación",
    };
  }
};

// Función para registrar estudiantes
export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/Usuario/register-student`,
      studentData
    );
    console.log("Respuesta completa de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error en la conexión con el servidor",
    };
  }
};

// Función para obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Usuario`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { success: false, message: "Error al obtener usuarios" };
  }
};

// Función para registrar docentes
export const registerTeacher = async (data) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  try {
    const response = await axios.post(
      `${apiUrl}/api/Usuario/register-teacher`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar docente:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al registrar docente",
    };
  }
};

// Función para registrar administradores
export const registerAdmin = async (data) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token; // Asegúrate de que el token esté almacenado en localStorage después del login

  try {
    const response = await axios.post(
      `${apiUrl}/api/Usuario/register-admin`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
      }
    );
    console.log(
      "Respuesta completa de la API desde apiService:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar administrador:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al registrar administrador",
    };
  }
};
// Función para eliminar usuario
export const deleteUser = async (id) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  try {
    const response = await axios.delete(`${apiUrl}/api/Usuario/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al eliminar usuario",
    };
  }
};

// Función para obtener todos los docentes
export const getTeachers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Usuario/teachers`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener docentes",
    };
  }
};

// Función para actualizar docentes
export const updateTeacher = async (id, teacherData) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  console.log(token);
  try {
    const response = await axios.put(
      `${apiUrl}/api/Usuario/update-teacher/${id}`,
      teacherData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar docente",
    };
  }
};

// Función para obtener todos los administradores
export const getAdmins = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Usuario/admins`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener administradores",
    };
  }
};

// Función para actualizar administradores
export const updateAdmin = async (id, adminData) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  try {
    const response = await axios.put(
      `${apiUrl}/api/Usuario/update-admin/${id}`,
      adminData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar administrador:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar administrador",
    };
  }
};

// Función para enviar un informe por correo electrónico
export const sendEmailReport = async (recipientEmail) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  console.log("Token: ", token);
  try {
    const response = await axios.post(
      `${apiUrl}/api/Usuario/send-report`,
      { recipientEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar el informe:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al enviar el informe",
    };
  }
};

//=========================================Minijuegos======================================
// Obtener minijuegos por usuario
export const getMinijuegosByUsuario = async (usuarioId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/Minijuego/ByUsuario/${usuarioId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los minijuegos:", error);
    return { success: false, message: "Error al obtener los minijuegos" };
  }
};

// Crear o editar un minijuego
export const saveMinijuego = async (minijuego) => {
  try {
    if (minijuego.MinijuegoId) {
      const response = await axios.put(
        `${apiUrl}/api/Minijuego/${minijuego.MinijuegoId}`,
        minijuego
      );
      return response.data;
    } else {
      const response = await axios.post(
        `${apiUrl}/api/Minijuego/RegistroMinijuego`,
        minijuego
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error al guardar el minijuego:", error);
    return { success: false, message: "Error al guardar el minijuego" };
  }
};

// Función para crear Temático con Apoyo
export const createTematicoWithApoyo = async (tematicoData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/Tematico/CreateWithApoyo`,
      tematicoData
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear Temático con Apoyo:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear Temático con Apoyo",
    };
  }
};

export const updateMinijuego = async (id, datos) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/Minijuego/EditarMinijuego/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      }
    );
    if (!response.ok) {
      throw new Error("Error al editar el minijuego");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en editarMinijuego:", error);
    return { success: false, message: error.message };
  }
};

export const deleteMinijuego = async (id) => {
  const response = await fetch(`${apiUrl}/api/Minijuego/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el minijuego");
  }
};

export const changeEstadoMinijuego = async (id, estadoId) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/api/Minijuego/ChangeEstado/${id}`,
      { estadoId }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del minijuego:", error);
    throw error;
  }
};

export const exportarResultados = async (
  tipoArchivo,
  usuarioId = null,
  minijuegoId = null,
  curso = null,
  tipoMinijuego = null,
  creadorId = null
) => {
  try {
    const params = new URLSearchParams();

    params.append("tipoArchivo", tipoArchivo);
    if (usuarioId) params.append("usuarioId", usuarioId);
    if (minijuegoId) params.append("minijuegoId", minijuegoId);
    if (curso) params.append("curso", curso);
    if (tipoMinijuego) params.append("tipoMinijuego", tipoMinijuego);
    if (creadorId) params.append("creadorId", creadorId);

    const response = await axios.get(
      `${apiUrl}/api/resultados/exportar/${tipoArchivo}?${params.toString()}`,
      {
        responseType: "blob", // Importante para descargar archivos
      }
    );

    const contentDisposition = response.headers["content-disposition"];
    let filename = `Resultados.${tipoArchivo === "excel" ? "xlsx" : "pdf"}`;

    // Intentar extraer nombre de archivo de content-disposition si está disponible
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al exportar resultados:", error);
    throw error;
  }
};

export const getStudentRanking = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Usuario/ranking`);
    return response.data.ranking?.$values || []; // Retorna el array directamente
  } catch (error) {
    console.error("Error obteniendo el ranking:", error);
    return [];
  }
};

export const updateUserCredentials = async (id, credentials, token) => {
  try {
    // Encriptar la contraseña si se proporciona
    if (credentials.contrasena) {
      credentials.contrasena = sha256(credentials.contrasena).toString();
    }

    const response = await axios.put(
      `${apiUrl}/api/Usuario/update-credentials/${id}`,
      credentials,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en el header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar credenciales:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error en la actualización",
    };
  }
};

export const importarEstudiantes = async (file) => {
  const actualUser = JSON.parse(localStorage.getItem("user"));
  const token = actualUser.token;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${apiUrl}/api/Usuario/import-students`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verifica si la respuesta es exitosa y devuelve solo un mensaje simple
    if (response.data) {
      return {
        success: true,
        message: "Estudiantes Registrados con éxito",
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error al importar estudiantes:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al importar estudiantes",
    };
  }
};

// Funciones para manejar diálogos (antes "apoyos")
export const getDialogos = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/Tematico/GetApoyos`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    // Extraer el array de valores del objeto JSON
    return data.$values || [];
  } catch (error) {
    console.error("Error al obtener diálogos:", error);
    throw error;
  }
};

export const createDialogo = async (dialogoData) => {
  try {
    const response = await fetch(`${apiUrl}/api/Tematico/CreateApoyo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Titulo: dialogoData.titulo,
        Descripcion: dialogoData.descripcion,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al crear diálogo:", error);
    throw error;
  }
};

export const updateDialogo = async (id, dialogoData) => {
  try {
    const response = await fetch(`${apiUrl}/api/Tematico/UpdateApoyo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Titulo: dialogoData.titulo,
        Descripcion: dialogoData.descripcion,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar diálogo:", error);
    throw error;
  }
};

export const deleteDialogo = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/api/Tematico/DeleteApoyo/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar diálogo:", error);
    throw error;
  }
};

// Funciones para manejar temáticos
export const createTematico = async (tematicoData) => {
  try {
    const response = await fetch(`${apiUrl}/api/Tematico/CreateTematico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TituloTematico: tematicoData.tituloTematico,
        Descripcion: tematicoData.descripcion,
        IdApoyo: tematicoData.idDialogo, // Renombrado para mantener consistencia
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al crear temático:", error);
    throw error;
  }
};

export const obtenerResultados = async (
  usuarioId = null,
  minijuegoId = null,
  curso = null,
  tipoMinijuego = null,
  creadorId = null
) => {
  try {
    let url = `${apiUrl}/api/Resultados/filtrar?`;

    // Agregar los parámetros en el orden correcto según el endpoint
    if (usuarioId) url += `usuarioId=${encodeURIComponent(usuarioId)}&`;
    if (curso) url += `curso=${encodeURIComponent(curso)}&`;
    if (minijuegoId) url += `minijuegoId=${encodeURIComponent(minijuegoId)}&`;
    if (tipoMinijuego)
      url += `tipoMinijuego=${encodeURIComponent(tipoMinijuego)}&`;
    if (creadorId) url += `creadorId=${encodeURIComponent(creadorId)}&`;

    // Eliminar el último '&' si existe
    url = url.endsWith("&") ? url.slice(0, -1) : url;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    throw error;
  }
};

export const descargarPlantillaEstudiantes = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/Usuario/download-template`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Obtener el blob de la respuesta
    const blob = await response.blob();

    // Crear una URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento <a> para descargar el archivo
    const a = document.createElement("a");
    a.href = url;
    a.download = "PlantillaImportacionEstudiantes.xlsx";
    document.body.appendChild(a);
    a.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error("Error al descargar la plantilla:", error);
    throw error;
  }
};
