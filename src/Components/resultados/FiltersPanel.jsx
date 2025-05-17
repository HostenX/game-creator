import React, { useState, useEffect, useRef } from "react";

/**
 * Panel de filtros unificado para la tabla de resultados y gráficos
 */
const FiltersPanel = ({
  // Propiedades para filtros de búsqueda
  setUsuarioId,
  setMinijuegoId,
  setCurso,
  curso,
  setNombreCompleto,
  nombreCompleto,
  setTipoMinijuego,
  tipoMinijuego,
  cargarResultados,
  setShowExportModal,
  
  // Propiedades para visualización
  mostrarGraficos,
  setMostrarGraficos,
  
  // Datos para opciones de selección
  resultados,
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  estudiantes,
  estudianteSeleccionado,
  setEstudianteSeleccionado,
  modoVisualizacion,
  setModoVisualizacion,
  
  // Listas de opciones disponibles
  minijuegosDisponibles = [],
  cursosDisponibles = [],
  tiposMinijuegoDisponibles = []
}) => {
  // Estados locales para listas que se extraen de los resultados
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
  const [cursosExtraidos, setCursosExtraidos] = useState([]);
  const [tiposExtraidos, setTiposExtraidos] = useState([]);
  
  // Estados para el selector con búsqueda de estudiantes
  const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
  const [mostrarDropdownEstudiantes, setMostrarDropdownEstudiantes] = useState(false);
  const dropdownRef = useRef(null);

  // Extraer datos de los resultados cuando cargan para utilizarlos en los filtros
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
      
      // Extraer tipos de minijuego únicos
      const tipos = [...new Set(
        resultados.map(item => item.tipoMinijuego || "").filter(Boolean)
      )].sort();
      
      // Extraer estudiantes únicos por nombre completo
      const mapEstudiantes = new Map();
      
      resultados.forEach(resultado => {
        const nombre = resultado.nombreCompleto;
        
        if (nombre && !mapEstudiantes.has(nombre)) {
          // Ya no guardamos el ID, solo el nombre
          mapEstudiantes.set(nombre, { nombre });
        }
      });
      
      // Convertir el Map a un array y ordenar alfabéticamente
      const listaEstudiantes = [...mapEstudiantes.values()]
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      setEstudiantesDisponibles(listaEstudiantes);
      setCursosExtraidos(cursos);
      setTiposExtraidos(tipos);
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
  
  // Aplicar filtros al hacer clic en el botón
  const aplicarFiltros = () => {
    cargarResultados();
  };
  
  // Filtrar estudiantes según la búsqueda
  const estudiantesFiltrados = estudiantesDisponibles.filter(
    estudiante => estudiante.nombre.toLowerCase().includes(busquedaEstudiante.toLowerCase())
  );
  
  // Manejar cambio en selección de minijuego
  const handleMinijuegoChange = (e) => {
    const valor = e.target.value;
    setMinijuegoSeleccionado(valor);
    
    // Si hay valor, configurar el minijuegoId
    if (valor) {
      // Buscar el minijuego en los resultados para encontrar el ID correcto
      const minijuegoSeleccionado = resultados.find(
        r => (r.tituloMinijuego || r.minijuego) === valor
      );
      
      if (minijuegoSeleccionado && minijuegoSeleccionado.minijuegoId) {
        setMinijuegoId(minijuegoSeleccionado.minijuegoId);
      } else {
        // Si no encuentra ID, usar el nombre como valor
        setMinijuegoId(valor);
      }
    } else {
      setMinijuegoId('');
    }
  };
  
  // Manejar cambio en selección de tipo de minijuego
  const handleTipoMinijuegoChange = (e) => {
    setTipoMinijuego(e.target.value);
  };
  
  // Manejar cambio en selección de curso
  const handleCursoChange = (e) => {
    setCurso(e.target.value);
  };
  
  // Manejar selección de estudiante
  const handleEstudianteSelect = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    // No configurar usuarioId, solo el nombre
    setUsuarioId('');
    setBusquedaEstudiante('');
    setNombreCompleto(estudiante.nombre); 
    setMostrarDropdownEstudiantes(false);
  };
  
  // Limpiar selección de estudiante
  const limpiarEstudianteSeleccionado = () => {
    setEstudianteSeleccionado(null);
    setUsuarioId('');
    setBusquedaEstudiante('');
    setNombreCompleto('');
  };

  return (
    <div className="filtros-container">
      {/* Filtros de búsqueda */}
      <div className="filtros-busqueda">
        <h3>Filtros de Búsqueda</h3>
        
        {/* Selector de estudiante con búsqueda */}
        <div className="filtro-grupo">
          <label>Buscar estudiante por nombre:</label>
          <div className="estudiante-selector" ref={dropdownRef}>
            <div className="input-with-clear">
              <input
                type="text"
                value={estudianteSeleccionado ? estudianteSeleccionado.nombre : busquedaEstudiante}
                onChange={(e) => {
                  setBusquedaEstudiante(e.target.value);
                  setEstudianteSeleccionado(null);
                  setUsuarioId('');
                  setNombreCompleto('');
                }}
                onClick={() => setMostrarDropdownEstudiantes(true)}
                placeholder="Buscar por nombre completo..."
              />
              {(estudianteSeleccionado || busquedaEstudiante) && (
                <button 
                  className="clear-button"
                  onClick={limpiarEstudianteSeleccionado}
                  title="Limpiar selección"
                  type="button"
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
                      className={`estudiante-option ${
                        estudianteSeleccionado?.nombre === estudiante.nombre ? 'selected' : ''
                      }`}
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
        
        {/* Selector de tipo de minijuego */}
        <div className="filtro-grupo">
          <label>Tipo de Minijuego:</label>
          <select 
            value={tipoMinijuego || ""}
            onChange={handleTipoMinijuegoChange}
          >
            <option value="">-- Todos los Tipos --</option>
            {tiposExtraidos.map((tipo, index) => (
              <option key={`tipo-${index}`} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de curso */}
        <div className="filtro-grupo">
          <label>Curso:</label>
          <select 
            value={curso || ""} 
            onChange={handleCursoChange}
          >
            <option value="">-- Todos los Cursos --</option>
            {cursosExtraidos.map((cursoOption, index) => (
              <option key={`curso-${index}`} value={cursoOption}>
                {cursoOption}
              </option>
            ))}
          </select>
        </div>

        {/* Botones de acción */}
        <button 
          className="filtrar-btn" 
          onClick={aplicarFiltros}
          type="button"
        >
          Aplicar Filtros
        </button>

        <button
          className="exportar-btn"
          onClick={() => setShowExportModal(true)}
          type="button"
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
          type="button"
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
            <button 
              className="filtrar-btn" 
              onClick={aplicarFiltros}
              type="button"
            >
              Actualizar Visualización
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;