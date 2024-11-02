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
