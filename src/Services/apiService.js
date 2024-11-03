import axios from 'axios'; // Asegúrate de que esta línea esté presente

// Asegúrate de tener configurada la variable de entorno REACT_APP_API_URL
const apiUrl = process.env.REACT_APP_API_URL;

// Función para iniciar sesión
export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${apiUrl}/api/Usuario/login`, formData);
        return response.data;
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return { success: false, message: 'Error en la autenticación' };
    }
};

// Función para registrar estudiantes
export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${apiUrl}/api/Usuario/register-student`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error en la llamada a la API:', error);
        return { success: false };
    }
};

// Función para obtener todos los usuarios
export const getUsuarios = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/Usuario`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
};

// Función para registrar docentes
export const registerTeacher = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/api/Usuario/register-teacher`, data);
        return response.data;
    } catch (error) {
        console.error('Error al registrar docente:', error);
        return { success: false };
    }
};

// Función para registrar administradores
export const registerAdmin = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/api/Usuario/register-admin`, data);
        return response.data;
    } catch (error) {
        console.error('Error al registrar administrador:', error);
        return { success: false };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/Usuario/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return { success: false, message: 'Error al eliminar usuario' }; // Manejo de errores
    }
};

export const getTeachers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Usuario/teachers`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener docentes:', error);
      if (error.response) {
        // Manejar errores de respuesta del servidor
        const { status, data } = error.response;
        throw new Error(`Error al obtener docentes: ${status} - ${data.message}`);
      } else if (error.request) {
        // Manejar errores de solicitud
        throw new Error('Error de red al obtener docentes');
      } else {
        // Manejar otros errores
        throw new Error('Error inesperado al obtener docentes');
      }
    }
  };

export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axios.put(`${apiUrl}/api/Usuario/update-teacher/${id}`, teacherData);
        return response.data; // Devolver el resultado
    } catch (error) {
        console.error('Error al actualizar docente:', error);
        throw error; // Propagar el error
    }
};

// Función para obtener todos los administradores
export const getAdmins = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/Usuario/admins`); // Asegúrate de que tu API tenga esta ruta
        return response.data;
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        return []; // Devuelve un array vacío en caso de error
    }
};

// Función para actualizar administradores
export const updateAdmin = async (id, adminData) => {
    try {
        const response = await axios.put(`${apiUrl}/api/Usuario/update-admin/${id}`, adminData); // Asegúrate de que tu API soporte esta ruta
        return response.data; // Devolver el resultado
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        throw error; // Propagar el error
    }
};