import React, { useState, useContext } from 'react';
import { loginUser } from '../../Services/apiService';
import { AuthContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        contrasena: ''
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate(); // Usar useNavigate

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
            const response = await loginUser(formData);
            if (response.success) {
                console.log(formData.nombreUsuario);
                console.log(response);
                // Guarda el rol y otra información relevante en el contexto de usuario
                setUser({ nombreUsuario: formData.nombreUsuario, rolId: response.rolId });
                navigate('/dashboard'); // Redirigir al dashboard
            } else {
                setMessage(response.message || 'Error en el login');
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('Error en la conexión con el servidor');
            setIsSuccess(false);
        }
    };
    

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombreUsuario"
                    placeholder="Nombre de Usuario"
                    value={formData.nombreUsuario}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="contrasena"
                    placeholder="Contraseña"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                />
                <button type="submit">Iniciar Sesión</button>
            </form>

            {message && (
                <p style={{ color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoginForm;
