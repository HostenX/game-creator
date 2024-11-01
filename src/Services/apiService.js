const apiUrl = process.env.REACT_APP_API_URL;

export const registerStudent = async (studentData) => {
    try {
        console.log('API URL:', apiUrl);

        const response = await fetch(`${apiUrl}/api/Usuario/register-student`, { // Aquí usé comillas invertidas.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la llamada a la API:', error);
        return { success: false };
    }
};

// src/services/apiService.js

export const loginUser = async (formData) => {
    try {
        const response = await fetch(`${apiUrl}/api/Usuario/login`, { // Cambia esta URL según tu configuración
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return { success: false, message: 'Error en la autenticación' };
    }
};
