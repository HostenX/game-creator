import React, { useState } from "react";
import MinijuegosTable from "./MinijuegosTable";
import MinijuegoForm from "./MinijuegoForm";
import TematicoForm from "./TematicoForm";
import DialogosManager from "./DialogosManager";
import ResultadosTable from "./ResultadosTable";
import {
  importarEstudiantes,
} from "../Services/apiService";

const TeacherDashboard = () => {
  const [reload, setReload] = useState(false);
  const [view, setView] = useState("minijuegos"); // "minijuegos", "tematicos", "dialogos" o "resultados"
  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const handleSave = () => {
    setReload(!reload);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo Excel.");
      return;
    }
    try {
      const result = await importarEstudiantes(file);
      setImportResult(result);
    } catch (error) {
      console.error("Error al importar estudiantes:", error);
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
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleImport}>Importar</button>
            <button onClick={() => setShowImportModal(false)}>Cerrar</button>
            {importResult && (
              <div>
                <h3>Resultados de la Importación</h3>
                <pre>{JSON.stringify(importResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;