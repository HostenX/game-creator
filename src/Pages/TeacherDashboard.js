import React, { useState } from "react";
import MinijuegosTable from "./MinijuegosTable";
import MinijuegoForm from "./MinijuegoForm";
import TematicoForm from "./TematicoForm";
import DialogosManager from "./DialogosManager";
import ResultadosTable from "./ResultadosTable";
import {
  importarEstudiantes,
  descargarPlantillaEstudiantes
} from "../Services/apiService";

const TeacherDashboard = () => {
  const [reload, setReload] = useState(false);
  const [view, setView] = useState("minijuegos"); // "minijuegos", "tematicos", "dialogos" o "resultados"
  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleSave = () => {
    setReload(!reload);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo Excel.");
      return;
    }

    setLoading(true);
    try {
      const result = await importarEstudiantes(file);
      setImportResult(result);
    } catch (error) {
      console.error("Error al importar estudiantes:", error);
      setImportResult({ success: false, message: "Error al importar estudiantes" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      await descargarPlantillaEstudiantes();
    } catch (error) {
      console.error("Error al descargar la plantilla:", error);
      alert("Error al descargar la plantilla");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard del Profesor</h1>
      
      <nav className="dashboard-nav">
        <button 
          className={view === "minijuegos" ? "active" : ""} 
          onClick={() => setView("minijuegos")}
        >
          Ver Minijuegos
        </button>
        <button 
          className={view === "dialogos" ? "active" : ""} 
          onClick={() => setView("dialogos")}
        >
          Consejos de NPC
        </button>
        <button 
          className={view === "tematicos" ? "active" : ""} 
          onClick={() => setView("tematicos")}
        >
          Crear Temáticos
        </button>
        <button 
          className={view === "resultados" ? "active" : ""}
          onClick={() => setView("resultados")}
        >
          Ver Resultados
        </button>
        <button onClick={() => setShowImportModal(true)}>
          Importar Estudiantes
        </button>
      </nav>
      
      <div className="dashboard-content">
        {view === "minijuegos" && (
          <>
            <MinijuegoForm onSave={handleSave} />
            <MinijuegosTable key={reload} />
          </>
        )}
        
        {view === "dialogos" && (
          <DialogosManager onSave={handleSave} />
        )}
        
        {view === "tematicos" && (
          <TematicoForm onSave={handleSave} />
        )}
        
        {view === "resultados" && (
          <ResultadosTable key={reload} />
        )}
      </div>
      
      {showImportModal && (
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
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="button-group">
                <button 
                  onClick={handleImport}
                  disabled={loading}
                  className="import-button"
                >
                  {loading ? "Importando..." : "Importar"}
                </button>
                <button 
                  onClick={() => {
                    setShowImportModal(false);
                    setFile(null);
                    setImportResult(null);
                  }} 
                  className="close-button"
                >
                  Cerrar
                </button>
              </div>
            </div>
            
            {importResult && (
              <div className="import-result">
                <h3>Resultados de la Importación</h3>
                <p className={importResult.success ? "success" : "error"}>
                  {importResult.message}
                </p>
                {importResult.details && (
                  <pre>{JSON.stringify(importResult.details, null, 2)}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;