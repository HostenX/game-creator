import React, { useState, useEffect } from "react";
import { obtenerResultados, exportarResultados } from "../../Services/apiService";
import FiltersPanel from "./FiltersPanel";
import ChartPanel from "./ChartPanel";
import DataTable from "./DataTable";
import ExportModal from "./ExportModal";
import { extraerMinijuegosUnicos } from "../utils/dataProcessingUtils";
import "./FilterStyles.css"; // Importamos los estilos

/**
 * Componente principal de la tabla de resultados con filtros mejorados
 * que se integra correctamente con los endpoints de la API
 */
const ResultadosTable = () => {
  // Estados para datos de resultados
  const [resultados, setResultados] = useState([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para filtros según la API
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [curso, setCurso] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoMinijuego, setTipoMinijuego] = useState("");
  
  // Estado para modal de exportación
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Estados para visualización de gráficos
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [reload, setReload] = useState(false);
  
  // Estado para ID del creador (profesor)
  const [creadorId, setCreadorId] = useState(null);

  // Estados para distribución en gráficos
  const [minijuegoSeleccionado, setMinijuegoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [miniJuegosDisponibles, setMiniJuegosDisponibles] = useState([]);
  
  // Estados para visualización por estudiante
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [modoVisualizacion, setModoVisualizacion] = useState("general");
  
  // Estados para opciones de filtrado
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [tiposMinijuegoDisponibles, setTiposMinijuegoDisponibles] = useState([]);

  // Obtener creador ID al cargar el componente
  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        if (userData?.id) setCreadorId(userData.id);
      }
    } catch (err) {
      console.error("Error al obtener usuario creador:", err);
    }
  }, []);

  // Cargar resultados cuando tenemos el creadorId
  useEffect(() => {
    if (creadorId !== null) {
      cargarResultados();
    }
  }, [creadorId, reload]);

  // Aplicar filtros localmente también cuando cambian
  useEffect(() => {
    aplicarFiltrosLocales();
  }, [minijuegoSeleccionado, nombreCompleto, curso, tipoMinijuego, resultados]);

  // Esta función aplica filtros localmente para mejorar la experiencia
  const aplicarFiltrosLocales = () => {
    if (!resultados || resultados.length === 0) {
      setResultadosFiltrados([]);
      return;
    }

    let filtered = [...resultados];

    // Filtro por nombre completo
    if (nombreCompleto) {
      filtered = filtered.filter(
        r => r.nombreCompleto && r.nombreCompleto.includes(nombreCompleto)
      );
    }

    // Filtro por minijuego (usando el nombre)
    if (minijuegoSeleccionado) {
      filtered = filtered.filter(
        r => (r.tituloMinijuego || r.minijuego) === minijuegoSeleccionado
      );
    }

    // Filtro por curso
    if (curso) {
      filtered = filtered.filter(r => r.curso === curso);
    }

    // Filtro por tipo de minijuego
    if (tipoMinijuego) {
      filtered = filtered.filter(r => r.tipoMinijuego === tipoMinijuego);
    }

    setResultadosFiltrados(filtered);
  };

  // Función para cargar resultados desde la API
  const cargarResultados = async () => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores
    
    try {
      // Preparar parámetros para alinearse con la API
      let nombreCompletoFinal = null;
      
      if (modoVisualizacion === "porEstudiante" && estudianteSeleccionado) {
        nombreCompletoFinal = estudianteSeleccionado.nombre;
      } else if (nombreCompleto) {
        nombreCompletoFinal = nombreCompleto;
      }

      // Alineación exacta con los parámetros de la API
      const data = await obtenerResultados(
        usuarioId ? parseInt(usuarioId) : null,
        curso || null,
        minijuegoId || null, // Cambiado para usar ID o nombre según sea necesario
        tipoMinijuego || null,
        creadorId,
        nombreCompletoFinal
      );

      // Procesamiento de la respuesta
      let resultadosProcesados = [];

      if (data?.$values) {
        resultadosProcesados = data.$values;
      } else if (Array.isArray(data)) {
        resultadosProcesados = data;
      } else {
        console.warn("Formato de datos desconocido:", data);
        resultadosProcesados = Array.isArray(data) ? data : [];
      }

      setResultados(resultadosProcesados);
      setResultadosFiltrados(resultadosProcesados); // Inicialmente mostrar todos
      console.log("Resultados cargados:", resultadosProcesados.length);

      // Extraer datos para opciones de filtrado
      const uniqueMinijuegos = extraerMinijuegosUnicos(resultadosProcesados);
      setMiniJuegosDisponibles(uniqueMinijuegos);
      
      // Extraer tipos de minijuego disponibles
      const uniqueTipos = [...new Set(
        resultadosProcesados.map(item => item.tipoMinijuego || "").filter(Boolean)
      )].sort();
      setTiposMinijuegoDisponibles(uniqueTipos);
      
      // Extraer cursos disponibles
      const uniqueCursos = [...new Set(
        resultadosProcesados.map(item => item.curso || "").filter(Boolean)
      )].sort();
      setCursosDisponibles(uniqueCursos);
      
    } catch (err) {
      console.error("Error al cargar resultados:", err);
      setError("Error al cargar los resultados. Por favor, intenta de nuevo.");
      setResultadosFiltrados([]); // Limpiar resultados en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar resultados con filtros aplicados
  const handleExport = async (tipoArchivo) => {
    try {
      setLoading(true);
      
      // Obtener el nombre completo para filtrar según el modo de visualización actual
      let nombreCompletoFinal = null;
      
      if (modoVisualizacion === "porEstudiante" && estudianteSeleccionado) {
        nombreCompletoFinal = estudianteSeleccionado.nombre;
      } else if (nombreCompleto) {
        nombreCompletoFinal = nombreCompleto;
      }

      // Alineación con los parámetros de la API para exportación
      await exportarResultados(
        tipoArchivo,
        usuarioId ? parseInt(usuarioId) : null,
        minijuegoId || null,
        curso || null,
        tipoMinijuego || null,
        creadorId,
        nombreCompletoFinal
      );
      
      setShowExportModal(false);
    } catch (error) {
      console.error("Error al exportar:", error);
      setError("Error al exportar los resultados. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambio en modo de visualización
  const handleModoVisualizacionChange = (nuevoModo) => {
    setModoVisualizacion(nuevoModo);
    
    // Resetear filtros según el modo
    if (nuevoModo === "general") {
      // En modo general mantenemos las selecciones
    } else if (nuevoModo === "porMinijuego") {
      setEstudianteSeleccionado(null);
      setNombreCompleto("");
      setUsuarioId("");
    } else if (nuevoModo === "porEstudiante") {
      setMinijuegoSeleccionado("");
      setMinijuegoId("");
    }
  };

  // Forzar recarga de datos
  const recargarDatos = () => {
    // Limpiar todos los filtros
    setMinijuegoSeleccionado("");
    setMinijuegoId("");
    setCurso("");
    setTipoMinijuego("");
    setNombreCompleto("");
    setEstudianteSeleccionado(null);
    setUsuarioId("");
    
    // Recargar datos
    setReload(!reload);
  };

  // Reunir todos los filtros actuales en un objeto
  const obtenerFiltrosActuales = () => {
    return {
      usuarioId: usuarioId || null,
      minijuegoId: minijuegoId || null,
      nombreCompleto: nombreCompleto || (estudianteSeleccionado ? estudianteSeleccionado.nombre : null),
      curso: curso || null,
      tipoMinijuego: tipoMinijuego || null,
      creadorId: creadorId || null,
      minijuegoSeleccionado: minijuegoSeleccionado || null
    };
  };

  return (
    <div className="resultados-container">
      <h2>Resultados de Minijuegos</h2>
      
      {/* Panel de Filtros Mejorado */}
      <FiltersPanel
        // Propiedades para filtros de búsqueda
        setUsuarioId={setUsuarioId}
        setMinijuegoId={setMinijuegoId}
        setCurso={setCurso}
        curso={curso}
        setNombreCompleto={setNombreCompleto}
        nombreCompleto={nombreCompleto}
        setTipoMinijuego={setTipoMinijuego}
        tipoMinijuego={tipoMinijuego}
        cargarResultados={cargarResultados}
        setShowExportModal={setShowExportModal}
        
        // Propiedades para visualización
        mostrarGraficos={mostrarGraficos}
        setMostrarGraficos={setMostrarGraficos}
        
        // Propiedades para filtros de minijuego
        minijuegoSeleccionado={minijuegoSeleccionado}
        setMinijuegoSeleccionado={setMinijuegoSeleccionado}
        
        // Propiedades para filtros de estudiante
        resultados={resultados}
        estudianteSeleccionado={estudianteSeleccionado}
        setEstudianteSeleccionado={setEstudianteSeleccionado}
        
        // Propiedades para modo de visualización
        modoVisualizacion={modoVisualizacion}
        setModoVisualizacion={handleModoVisualizacionChange}

        // Listas de opciones para filtros
        minijuegosDisponibles={miniJuegosDisponibles}
        cursosDisponibles={cursosDisponibles}
        tiposMinijuegoDisponibles={tiposMinijuegoDisponibles}
      />

      {/* Panel de Gráficos */}
      <ChartPanel
        // Propiedades generales
        resultados={resultadosFiltrados} // Usar los resultados filtrados
        mostrarGraficos={mostrarGraficos}
        
        // Propiedades para visualización por minijuego
        minijuegoSeleccionado={minijuegoSeleccionado}
        setMinijuegoSeleccionado={setMinijuegoSeleccionado}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        miniJuegosDisponibles={miniJuegosDisponibles}
        
        // Propiedades para visualización por estudiante
        estudianteSeleccionado={estudianteSeleccionado}
        
        // Modo de visualización
        modoVisualizacion={modoVisualizacion}
      />

      {/* Mensaje de error si existe */}
      {error && <div className="error-message">{error}</div>}

      {/* Tabla de Datos - Usar los resultados filtrados */}
      <DataTable
        resultados={resultadosFiltrados}
        loading={loading}
        error={error}
        onReload={recargarDatos}
      />

      {/* Modal de Exportación Mejorado */}
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        filtrosActuales={obtenerFiltrosActuales()}
      />
    </div>
  );
};

export default ResultadosTable;