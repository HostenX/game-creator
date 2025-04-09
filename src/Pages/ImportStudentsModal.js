import React, { useState } from "react";
import { importarEstudiantes, descargarPlantillaEstudiantes } from "../Services/apiService";
import "./ImportStudentsModal.css";

const ImportStudentsModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

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

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    
    try {
      await descargarPlantillaEstudiantes();
      setMessage("Plantilla descargada correctamente.");
    } catch (error) {
      setMessage("Error al descargar la plantilla.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Importar Estudiantes</h2>
        
        <div className="template-section">
          <p>Descarga la plantilla para importar estudiantes:</p>
          <button 
            onClick={handleDownloadTemplate} 
            disabled={downloadingTemplate}
            className="download-button"
          >
            {downloadingTemplate ? "Descargando..." : "Descargar Plantilla"}
          </button>
        </div>
        
        <div className="import-section">
          <p>Selecciona el archivo Excel con los datos de los estudiantes:</p>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <div className="button-group">
            <button 
              onClick={handleImport} 
              disabled={loading}
              className="import-button"
            >
              {loading ? "Importando..." : "Importar"}
            </button>
            <button onClick={onClose} className="close-button">Cerrar</button>
          </div>
        </div>
        
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ImportStudentsModal;