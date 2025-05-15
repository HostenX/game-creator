// src/components/resultados/FiltersPanel.jsx - Versión mejorada
import React, { useState, useEffect } from "react";

/**
 * Panel de filtros unificado para la tabla de resultados y gráficos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de panel de filtros
 */
const FiltersPanel = ({
  // Propiedades originales
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
  
  // Nuevas propiedades para listas desplegables
  resultados,
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  estudiantes,
  estudianteSeleccionado,
  setEstudianteSeleccionado,
  modoVisualizacion,
  setModoVisualizacion,
}) => {
  // Estados locales para las listas desplegables
  const [minijuegosDisponibles, setMinijuegosDisponibles] = useState([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);

  // Extraer listas únicas de minijuegos y estudiantes cuando cambian los resultados
  useEffect(() => {
    if (resultados && resultados.length > 0) {
      // Extraer minijuegos únicos
      const minijuegos = [...new Set(
        resultados.map(item => 
          item.tituloMinijuego || item.minijuego || "Sin nombre"
        )
      )];
      
      // Extraer estudiantes únicos
      const estudiantes = [];
      const estudiantesIds = new Set();
      
      resultados.forEach(item => {
        const id = item.usuarioId || item.idUsuario;
        const nombre = item.nombreCompleto || item.nombre || "Sin nombre";
        
        // Evitar duplicados usando el ID como clave
        if (id && !estudiantesIds.has(id)) {
          estudiantesIds.add(id);
          estudiantes.push({ id, nombre });
        }
      });
      
      // Ordenar alfabéticamente por nombre
      estudiantes.sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      setMinijuegosDisponibles(minijuegos);
      setEstudiantesDisponibles(estudiantes);
      
      // Depuración
      console.log("Estudiantes encontrados:", estudiantes);
    }
  }, [resultados]);

  return (
    <div className="filtros-container">
      {/* Filtros originales */}
      <div className="filtros-busqueda">
        <h3>Filtros de Búsqueda</h3>
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
      </div>

      {/* Filtros para gráficos */}
      <div className="filtros-graficos">
        <h3>Visualización de Datos</h3>
        
        <button
          className={`graficos-btn ${mostrarGraficos ? 'active' : ''}`}
          onClick={() => setMostrarGraficos(!mostrarGraficos)}
        >
          {mostrarGraficos ? "Ocultar Gráficos" : "Mostrar Gráficos"}
        </button>
        
        {mostrarGraficos && (
          <>
            <div className="filtro-grupo">
              <label>Modo de Visualización:</label>
              <select 
                value={modoVisualizacion} 
                onChange={(e) => setModoVisualizacion(e.target.value)}
              >
                <option value="general">General</option>
                <option value="porMinijuego">Por Minijuego</option>
                <option value="porEstudiante">Por Estudiante</option>
              </select>
            </div>
            
            {(modoVisualizacion === 'porMinijuego' || modoVisualizacion === 'general') && (
              <div className="filtro-grupo">
                <label>Minijuego:</label>
                <select
                  value={minijuegoSeleccionado}
                  onChange={(e) => setMinijuegoSeleccionado(e.target.value)}
                >
                  <option value="">-- Todos los Minijuegos --</option>
                  {minijuegosDisponibles.map((minijuego, index) => (
                    <option key={`minijuego-${index}`} value={minijuego}>
                      {minijuego}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {(modoVisualizacion === 'porEstudiante' || modoVisualizacion === 'general') && (
              <div className="filtro-grupo">
                <label>Estudiante:</label>
                <select
                  value={estudianteSeleccionado ? estudianteSeleccionado.id : ""}
                  onChange={(e) => {
                    const estudianteId = e.target.value;
                    if (estudianteId) {
                      const estudiante = estudiantesDisponibles.find(e => e.id.toString() === estudianteId);
                      setEstudianteSeleccionado(estudiante);
                    } else {
                      setEstudianteSeleccionado(null);
                    }
                  }}
                >
                  <option value="">-- Todos los Estudiantes --</option>
                  {estudiantesDisponibles.map((estudiante, index) => (
                    <option key={`estudiante-${index}`} value={estudiante.id}>
                      {estudiante.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;