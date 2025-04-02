import React, { useState } from "react";
import { importarEstudiantes } from "../Services/apiService";
import "./ImportStudentsModal.css"; // Asegúrate de crear este archivo CSS

const ImportStudentsModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage("Por favor, selecciona un archivo Excel.");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await importarEstudiantes(file);
      setMessage(response.message);
    } catch (error) {
      setMessage("Error al importar estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Importar Estudiantes</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button onClick={handleImport} disabled={loading}>
          {loading ? "Importando..." : "Importar"}
        </button>
        <button onClick={onClose}>Cerrar</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ImportStudentsModal;
