import axios from "axios";
import Config from "../config/routes";

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
    const response = await axios.get(`${apiUrl}/api/Minijuego/ByUsuario/${usuarioId}`);
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
      const response = await axios.put(`${apiUrl}/api/Minijuego/${minijuego.MinijuegoId}`, minijuego);
      return response.data;
    } else {
      const response = await axios.post(`${apiUrl}/api/Minijuego/RegistroMinijuego`, minijuego);
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
    const response = await axios.post(`${apiUrl}/api/Tematico/CreateWithApoyo`, tematicoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear Temático con Apoyo:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear Temático con Apoyo",
    };
  }
};

export const updateMinijuego = async (id, datos) => {
  try {
    const response = await fetch(`${apiUrl}/api/Minijuego/EditarMinijuego/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
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
    const response = await axios.patch(`${apiUrl}/api/Minijuego/ChangeEstado/${id}`, { estadoId });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del minijuego:", error);
    throw error;
  }
};
