import React, { useState } from "react";
import { updateUserCredentials } from "../Services/apiService";

const UpdateCredentialsModal = ({ isOpen, onClose }) => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleUpdate = async () => {
    // Obtener usuario y token desde LocalStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user.id) {
      alert("Error: Usuario no encontrado en LocalStorage");
      return;
    }

    // Extraer el token del objeto user en localStorage
    const token = user.token;
    
    if (!token) {
      alert("Error: Token no encontrado en LocalStorage");
      return;
    }

    const credentials = {
      nombreUsuario: nombreUsuario.trim() || undefined,
      contrasena: contrasena.trim() || undefined,
    };

    // Enviar token junto con la solicitud
    const response = await updateUserCredentials(user.id, credentials, token);
    alert(response.message);
    if (response.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Actualizar Credenciales</h2>
        
        <div className="form-group">
          <label>Nuevo Nombre de Usuario:</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={handleUpdate}>Actualizar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredentialsModal;