import React, { useState } from 'react';
import { registerStudent } from '../../Services/apiService';

const RegisterStudentForm = () => {
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        nombreCompleto: '',
        contrasena: '',
        curso: ''
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // Para controlar si es un mensaje de éxito o error.

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerStudent(formData);
            console.log(response.success); // Para verificar qué datos devuelve la API
            
            // Verifica si la respuesta es exitosa
            if (response.success) {
                setMessage(response.message || 'Estudiante registrado con éxito'); // Muestra el mensaje de éxito
                setIsSuccess(true); // Marca como éxito
                // Limpiar formulario si es necesario
                setFormData({
                    UsuarioId: '',
                    nombreUsuario: '',
                    nombreCompleto: '',
                    contrasena: '',
                    curso: ''
                });
            } else {
                // Si la respuesta no tiene `success` como true, muestra el mensaje de error
                setMessage(response.message || 'Error en el registro. Verifica los datos ingresados');
                setIsSuccess(false); // Marca como error
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
            setIsSuccess(false);
        }
    };
    
    
    

    return (
        <div>
            <h2>Registro de Estudiante</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="UsuarioId"
                    placeholder="Identificacion (CC / TI)"
                    value={formData.UsuarioId}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="nombreUsuario"
                    placeholder="Nombre de Usuario"
                    value={formData.nombreUsuario}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="nombreCompleto"
                    placeholder="Nombre Completo"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="contrasena"
                    placeholder="Contraseña"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="curso"
                    placeholder="Curso"
                    value={formData.curso}
                    onChange={handleInputChange}
                />
                <button type="submit">Registrar</button>
            </form>

            {message && (
                <p style={{ color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default RegisterStudentForm;
