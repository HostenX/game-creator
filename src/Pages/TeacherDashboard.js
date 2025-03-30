import React, { useState } from "react";
import MinijuegosTable from "./MinijuegosTable";
import MinijuegoForm from "./MinijuegoForm";
import TematicoForm from "./TematicoForm";
import { exportarResultados, importarEstudiantes } from "../Services/apiService";

const TeacherDashboard = () => {
  const [reload, setReload] = useState(false);
  const [view, setView] = useState("minijuegos"); // "minijuegos" o "tematicos"
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const handleSave = () => {
    setReload(!reload);
  };

  const handleExport = async (type) => {
    try {
      await exportarResultados(type, usuarioId || null, minijuegoId || null);
      setShowModal(false);
    } catch (error) {
      console.error("Error al exportar:", error);
    }
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
    <div>
      <h1>Dashboard del Profesor</h1>
      <div>
        <button onClick={() => setView("minijuegos")}>Ver Minijuegos</button>
        <button onClick={() => setView("tematicos")}>Crear Temáticos</button>
        <button onClick={() => setShowModal(true)}>Exportar a Documento</button>
        <button onClick={() => setShowImportModal(true)}>Importar Estudiantes</button>
      </div>
      {view === "minijuegos" ? (
        <>
          <MinijuegoForm onSave={handleSave} />
          <MinijuegosTable key={reload} />
        </>
      ) : (
        <TematicoForm onSave={handleSave} />
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Exportar Resultados</h2>
            <label>ID de Usuario:</label>
            <input
              type="text"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              placeholder="Opcional"
            />
            <label>ID de Minijuego:</label>
            <input
              type="text"
              value={minijuegoId}
              onChange={(e) => setMinijuegoId(e.target.value)}
              placeholder="Opcional"
            />
            <button onClick={() => handleExport("pdf")}>Generar PDF</button>
            <button onClick={() => handleExport("excel")}>Generar Excel</button>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
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
