// src/components/resultados/FiltersPanel.jsx - Versión corregida para los campos reales
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

  // Extraer estudiantes directamente de los resultados visibles
  useEffect(() => {
    if (resultados && resultados.length > 0) {
      console.log("Total de resultados para extraer estudiantes:", resultados.length);
      
      // Extraer minijuegos únicos
      const minijuegos = [...new Set(
        resultados.map(item => 
          item.tituloMinijuego || item.minijuego || "Sin nombre"
        )
      )];
      
      // Extraer estudiantes únicos por nombre completo
      // Creamos un Map usando el nombre completo como clave para evitar duplicados
      const mapEstudiantes = new Map();
      
      resultados.forEach(resultado => {
        // Usamos el nombre completo como identificador único
        const nombre = resultado.nombreCompleto;
        
        // Sólo agregamos si tenemos un nombre válido y no lo habíamos agregado antes
        if (nombre && !mapEstudiantes.has(nombre)) {
          // Usamos el $id como ID para la selección si está disponible
          const id = resultado.$id || resultado.id || nombre;
          mapEstudiantes.set(nombre, { id, nombre });
        }
      });
      
      // Convertimos el Map a un array y ordenamos alfabéticamente
      const listaEstudiantes = [...mapEstudiantes.values()]
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      console.log("Estudiantes extraídos:", listaEstudiantes);
      
      setMinijuegosDisponibles(minijuegos);
      setEstudiantesDisponibles(listaEstudiantes);
    }
  }, [resultados]);
  
  // Aplicar filtros tanto a la tabla como a los gráficos
  const aplicarFiltros = () => {
    cargarResultados();
  };
  
  // Manejar cambios en los filtros de dropdown directamente
  const handleMinijuegoChange = (e) => {
    setMinijuegoSeleccionado(e.target.value);
  };
  
  const handleEstudianteChange = (e) => {
    const estudianteNombre = e.target.value;
    if (estudianteNombre) {
      const estudiante = estudiantesDisponibles.find(e => e.nombre === estudianteNombre);
      console.log("Estudiante seleccionado:", estudiante);
      setEstudianteSeleccionado(estudiante);
      // Actualizamos el valor del campo usuarioId para filtrar por este estudiante
      setUsuarioId(estudiante.id);
    } else {
      setEstudianteSeleccionado(null);
      setUsuarioId("");
    }
  };

  return (
    <div className="filtros-container">
      {/* Filtros de búsqueda unificados */}
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

        <button className="filtrar-btn" onClick={aplicarFiltros}>
          Aplicar Filtros
        </button>

        <button
          className="exportar-btn"
          onClick={() => setShowExportModal(true)}
        >
          Exportar Resultados
        </button>
      </div>

      {/* Opciones de visualización */}
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
                  onChange={handleMinijuegoChange}
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
                  value={estudianteSeleccionado ? estudianteSeleccionado.nombre : ""}
                  onChange={handleEstudianteChange}
                >
                  <option value="">-- Todos los Estudiantes --</option>
                  {estudiantesDisponibles.length > 0 ? (
                    estudiantesDisponibles.map((estudiante, index) => (
                      <option key={`estudiante-${index}`} value={estudiante.nombre}>
                        {estudiante.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Cargando estudiantes...</option>
                  )}
                </select>
              </div>
            )}
            
            {/* Botón para aplicar filtros de gráficos */}
            <button className="filtrar-btn" onClick={aplicarFiltros}>
              Actualizar Visualización
            </button>
            
            {/* Información de depuración */}
            <div className="debug-info" style={{ fontSize: '0.8em', color: '#aaa', marginTop: '10px' }}>
              {estudiantesDisponibles.length > 0 ? (
                <p>Estudiantes disponibles: {estudiantesDisponibles.length}</p>
              ) : (
                <p>No hay estudiantes disponibles</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;