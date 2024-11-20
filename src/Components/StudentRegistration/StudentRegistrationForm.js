import React, { useState } from "react";
import { registerStudent } from "../../Services/apiService";
import CryptoJS from 'crypto-js'; // Asegúrate de instalar crypto-js con `npm install crypto-js`
import "./StudentRegistrationForm.css";

const RegisterStudentForm = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    nombreCompleto: "",
    contrasena: "",
    curso: "",
    correoElectronico: "", // Cambiado a correoElectronico
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  // Función para hash de la contraseña
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Hashear la contraseña antes de enviarla
    const hashedFormData = {
      ...formData,
      contrasena: hashPassword(formData.contrasena),
    };

    try {
      const response = await registerStudent(hashedFormData);
      // Verificar la estructura de la respuesta en la consola
      console.log("Respuesta completa de la API:", response);

      if (response.success) {
        setMessage(response.message || "Estudiante registrado con éxito");
        setIsSuccess(true);
        setFormData({
          UsuarioId: "",
          nombreUsuario: "",
          nombreCompleto: "",
          contrasena: "",
          curso: "",
          correoElectronico: "", // Reiniciar el campo de correo electrónico
        });
      } else {
        setMessage(response.message || "Error en el registro. Verifica los datos ingresados");
        console.log(response);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Error en la conexión con el servidor");
      setIsSuccess(false);
    }
  };

  return (
    <div id="register-student-form-container">
      <h2 id="form-title">Registro de Estudiante</h2>
      <form id="register-student-form" onSubmit={handleSubmit}>
        <input
          type="number"
          id="input-usuario-id"
          name="UsuarioId"
          placeholder="Identificación (CC / TI)"
          value={formData.UsuarioId}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="input-nombre-usuario"
          name="nombreUsuario"
          placeholder="Nombre de Usuario"
          value={formData.nombreUsuario}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="input-nombre-completo"
          name="nombreCompleto"
          placeholder="Nombre Completo"
          value={formData.nombreCompleto}
          onChange={handleInputChange}
        />
        <input
          type="password"
          id="input-contrasena"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="input-curso"
          name="curso"
          placeholder="Curso"
          value={formData.curso}
          onChange={handleInputChange}
        />
        <input
          type="email"
          id="input-correo-electronico"
          name="correoElectronico"
          placeholder="Correo Electrónico"
          value={formData.correoElectronico}
          onChange={handleInputChange}
        />
        <button id="submit-button" type="submit">Registrar</button>
      </form>

      {message && (
        <p id="form-message" style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
      )}
      <p id="login-link">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default RegisterStudentForm;
