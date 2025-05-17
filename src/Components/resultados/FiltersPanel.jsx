// src/components/resultados/FiltersPanel.jsx - Versión actualizada con búsqueda por nombre
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
  setNombreCompleto,  // Nuevo prop para setter del nombre
  nombreCompleto,     // Nuevo prop para valor actual del nombre
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
    setNombreCompleto(estudiante.nombre); // Sincronizar con el filtro por nombre
    setMostrarDropdownEstudiantes(false);
  };
  
  // Manejar cambio en campo de búsqueda por nombre
  const handleNombreCompletoChange = (e) => {
    setNombreCompleto(e.target.value);
    // Si estamos escribiendo, resetear la selección de estudiante específico
    if (estudianteSeleccionado) {
      setEstudianteSeleccionado(null);
    }
  };
  
  // Limpiar selección de estudiante
  const limpiarEstudianteSeleccionado = () => {
    setEstudianteSeleccionado(null);
    setUsuarioId('');
    setBusquedaEstudiante('');
    setNombreCompleto(''); // Limpiar también el filtro por nombre
  };

  return (
    <div className="filtros-container">
      {/* Filtros de búsqueda mejorados */}
      <div className="filtros-busqueda">
        <h3>Filtros de Búsqueda</h3>
        
        {/* Selector de estudiante con búsqueda */}
        <div className="filtro-grupo">
          <label>Estudiante por nombre:</label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={handleNombreCompletoChange}
            placeholder="Buscar por nombre completo..."
            className="input-with-clear"
          />
          {nombreCompleto && (
            <button 
              className="clear-button"
              onClick={() => setNombreCompleto('')}
              title="Limpiar búsqueda por nombre"
            >
              ×
            </button>
          )}
        </div>

        {/* Búsqueda avanzada con selector de estudiante */}
        <div className="filtro-grupo">
          <label>Buscar estudiante específico:</label>
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
                placeholder="Seleccionar estudiante..."
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
    </div>
  );
};

export default FiltersPanel;