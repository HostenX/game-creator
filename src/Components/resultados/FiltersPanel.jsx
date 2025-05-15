// src/components/resultados/FiltersPanel.jsx
import React from "react";

/**
 * Panel de filtros para la tabla de resultados
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de panel de filtros
 */
const FiltersPanel = ({
  usuarioId,
  setUsuarioId,
  minijuegoId,
  setMinijuegoId,
  curso,
  setCurso,
  cargarResultados,
  setShowExportModal,
  mostrarGraficos,
  setMostrarGraficos,
}) => {
  return (
    <div className="filtros-container">
      <div className="filtro-grupo">
        <label>ID de Usuario:</label>
        <input
          type="text"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          placeholder="Filtrar por ID de usuario"
        />
      </div>

      <div className="filtro-grupo">
        <label>ID de Minijuego:</label>
        <input
          type="text"
          value={minijuegoId}
          onChange={(e) => setMinijuegoId(e.target.value)}
          placeholder="Filtrar por ID de minijuego"
        />
      </div>

      <div className="filtro-grupo">
        <label>Curso:</label>
        <input
          type="text"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          placeholder="Filtrar por curso"
        />
      </div>

      <button className="filtrar-btn" onClick={cargarResultados}>
        Aplicar Filtros
      </button>

      <button
        className="exportar-btn"
        onClick={() => setShowExportModal(true)}
      >
        Exportar Resultados
      </button>

      <button
        className="graficos-btn"
        onClick={() => setMostrarGraficos(!mostrarGraficos)}
      >
        {mostrarGraficos ? "Ocultar Gráficos" : "Mostrar Gráficos"}
      </button>
    </div>
  );
};

export default FiltersPanel;