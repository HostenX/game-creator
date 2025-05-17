// src/components/resultados/FiltersPanel.jsx - Versión mejorada con búsqueda
import React, { useState, useEffect, useRef } from "react";

/**
 * Panel de filtros unificado para la tabla de resultados y gráficos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de panel de filtros mejorado
 */
const FiltersPanel = ({
  // Propiedades de filtrado y visualización
  setUsuarioId,
  setMinijuegoId,
  setCurso,
  cargarResultados,
  setShowExportModal,
  mostrarGraficos,
  setMostrarGraficos,
  
  // Propiedades para visualización
  resultados,
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  estudiantes,
  estudianteSeleccionado,
  setEstudianteSeleccionado,
  modoVisualizacion,
  setModoVisualizacion,
  
  // Cursos disponibles (Si tienes esta información)
  cursosDisponibles = []
}) => {
  // Estados locales para las listas desplegables
  const [minijuegosDisponibles, setMinijuegosDisponibles] = useState([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
  const [cursosExtraidos, setCursosExtraidos] = useState([]);
  
  // Estados para el selector con búsqueda
  const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
  const [mostrarDropdownEstudiantes, setMostrarDropdownEstudiantes] = useState(false);
  const dropdownRef = useRef(null);

  // Extraer datos de los resultados cuando cargan
  useEffect(() => {
    if (resultados && resultados.length > 0) {
      console.log("Procesando resultados para extraer datos de filtrado...");
      
      // Extraer minijuegos únicos
      const minijuegos = [...new Set(
        resultados.map(item => 
          item.tituloMinijuego || item.minijuego || "Sin nombre"
        )
      )].sort();
      
      // Extraer cursos únicos
      const cursos = [...new Set(
        resultados.map(item => item.curso || "").filter(Boolean)
      )].sort();
      
      // Extraer estudiantes únicos por nombre completo
      const mapEstudiantes = new Map();
      
      resultados.forEach(resultado => {
        const nombre = resultado.nombreCompleto;
        
        if (nombre && !mapEstudiantes.has(nombre)) {
          const id = resultado.usuarioId || resultado.$id || resultado.id || nombre;
          mapEstudiantes.set(nombre, { id, nombre });
        }
      });
      
      // Convertir el Map a un array y ordenar alfabéticamente
      const listaEstudiantes = [...mapEstudiantes.values()]
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      setMinijuegosDisponibles(minijuegos);
      setCursosExtraidos(cursos);
      setEstudiantesDisponibles(listaEstudiantes);
    }
  }, [resultados]);
  
  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdownEstudiantes(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Aplicar filtros
  const aplicarFiltros = () => {
    cargarResultados();
  };
  
  // Filtrar estudiantes según la búsqueda
  const estudiantesFiltrados = estudiantesDisponibles.filter(
    estudiante => estudiante.nombre.toLowerCase().includes(busquedaEstudiante.toLowerCase())
  );
  
  // Manejar cambio en selección de minijuego
  const handleMinijuegoChange = (e) => {
    setMinijuegoSeleccionado(e.target.value);
    setMinijuegoId(e.target.value ? minijuegosDisponibles.indexOf(e.target.value) + 1 : '');
  };
  
  // Manejar cambio en selección de curso
  const handleCursoChange = (e) => {
    setCurso(e.target.value);
  };
  
  // Manejar selección de estudiante
  const handleEstudianteSelect = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setUsuarioId(estudiante.id);
    setBusquedaEstudiante('');
    setMostrarDropdownEstudiantes(false);
  };
  
  // Limpiar selección de estudiante
  const limpiarEstudianteSeleccionado = () => {
    setEstudianteSeleccionado(null);
    setUsuarioId('');
    setBusquedaEstudiante('');
  };

  return (
    <div className="filtros-container">
      {/* Filtros de búsqueda mejorados */}
      <div className="filtros-busqueda">
        <h3>Filtros de Búsqueda</h3>
        
        {/* Selector de estudiante con búsqueda */}
        <div className="filtro-grupo">
          <label>Estudiante:</label>
          <div className="estudiante-selector" ref={dropdownRef}>
            <div className="input-with-clear">
              <input
                type="text"
                value={estudianteSeleccionado ? estudianteSeleccionado.nombre : busquedaEstudiante}
                onChange={(e) => {
                  setBusquedaEstudiante(e.target.value);
                  setEstudianteSeleccionado(null);
                  setUsuarioId('');
                }}
                onClick={() => setMostrarDropdownEstudiantes(true)}
                placeholder="Buscar estudiante..."
              />
              {(estudianteSeleccionado || busquedaEstudiante) && (
                <button 
                  className="clear-button"
                  onClick={limpiarEstudianteSeleccionado}
                  title="Limpiar selección"
                >
                  ×
                </button>
              )}
            </div>
            
            {mostrarDropdownEstudiantes && (
              <div className="estudiantes-dropdown">
                {estudiantesFiltrados.length > 0 ? (
                  estudiantesFiltrados.map((estudiante, index) => (
                    <div 
                      key={`estudiante-option-${index}`}
                      className={`estudiante-option ${estudianteSeleccionado?.id === estudiante.id ? 'selected' : ''}`}
                      onClick={() => handleEstudianteSelect(estudiante)}
                    >
                      {estudiante.nombre}
                    </div>
                  ))
                ) : (
                  <div className="no-resultados">No se encontraron estudiantes</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selector de minijuego */}
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

        {/* Selector de curso */}
        <div className="filtro-grupo">
          <label>Curso:</label>
          <select 
            onChange={handleCursoChange}
          >
            <option value="">-- Todos los Cursos --</option>
            {cursosExtraidos.map((curso, index) => (
              <option key={`curso-${index}`} value={curso}>
                {curso}
              </option>
            ))}
          </select>
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
                <option value="general">Vista General</option>
                <option value="porMinijuego">Por Minijuego</option>
                <option value="porEstudiante">Por Estudiante</option>
              </select>
            </div>
            
            {/* Botón para actualizar visualización */}
            <button className="filtrar-btn" onClick={aplicarFiltros}>
              Actualizar Visualización
            </button>
          </>
        )}
      </div>
      
      {/* CSS para el componente */}
      <style jsx>{`
        .filtros-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .filtros-busqueda, .filtros-graficos {
          background-color: var(--primary-dark);
          padding: 15px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .filtro-grupo {
          margin-bottom: 15px;
        }
        
        .filtro-grupo label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .estudiante-selector {
          position: relative;
        }
        
        .input-with-clear {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-with-clear input {
          padding-right: 30px;
          width: 100%;
        }
        
        .clear-button {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #ccc;
          font-size: 18px;
          cursor: pointer;
          padding: 0 5px;
        }
        
        .clear-button:hover {
          color: #fff;
        }
        
        .estudiantes-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          background-color: var(--primary);
          border: 1px solid var(--primary-light);
          border-radius: 0 0 var(--border-radius) var(--border-radius);
          z-index: 10;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .estudiante-option {
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .estudiante-option:hover, .estudiante-option.selected {
          background-color: var(--accent);
        }
        
        .no-resultados {
          padding: 12px;
          text-align: center;
          color: #ccc;
        }
        
        @media (max-width: 768px) {
          .filtros-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FiltersPanel;