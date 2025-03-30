import React, { useState } from "react";
import { updateUserCredentials } from "../Services/apiService";

const UpdateCredentialsModal = ({ isOpen, onClose }) => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Obtener ID del usuario desde LocalStorage
    if (!user || !user.id) {
      alert("Error: Usuario no encontrado en LocalStorage");
      return;
    }

    const credentials = {
      nombreUsuario: nombreUsuario.trim() || undefined,
      contrasena: contrasena.trim() || undefined,
    };

    const response = await updateUserCredentials(user.id, credentials);
    alert(response.message);
    if (response.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Actualizar Credenciales</h2>
        <label>
          Nuevo Nombre de Usuario:
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </label>
        <label>
          Nueva Contraseña:
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </label>
        <div className="modal-buttons">
          <button onClick={handleUpdate}>Actualizar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredentialsModal;
