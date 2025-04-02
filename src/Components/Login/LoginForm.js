import React, { useState, useContext } from "react";
import { loginUser } from "../../Services/apiService";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; // Asegúrate de que esta librería esté instalada
import './LoginForm.css';
import Header from "../Header/Header";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const hashedPassword = CryptoJS.SHA256(formData.contrasena).toString(CryptoJS.enc.Hex);
  
    const loginData = {
      ...formData,
      contrasena: hashedPassword,
    };
  
    try {
      const response = await loginUser(loginData);
      if (response.success) {
        console.log(formData.nombreUsuario);
        console.log(response);
        // Guarda el token en el contexto de usuario
        setUser({
          nombreUsuario: formData.nombreUsuario,
          rolId: response.rolId,
          token: response.token,  // Guardar el token JWT
          id: response.usuarioId
        });
        navigate("/dashboard"); // Redirigir al dashboard
      } else {
        setMessage(response.message || "Error en el login");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Error en la conexión con el servidor");
      setIsSuccess(false);
    }
  };
  

  return (
    <>
      <Header id="header" />
      <div id="login-container">
        <h2 id="login-title">Iniciar Sesión</h2>
        <form id="login-form" onSubmit={handleSubmit}>
          <input
            id="login-username"
            type="text"
            name="nombreUsuario"
            placeholder="Nombre de Usuario"
            value={formData.nombreUsuario}
            onChange={handleInputChange}
          />
          <input
            id="login-password"
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleInputChange}
          />
          <button id="login-button" type="submit">Iniciar Sesión</button>
        </form>

        {message && (
          <p id="login-message" style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
        )}
        <p id="register-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
