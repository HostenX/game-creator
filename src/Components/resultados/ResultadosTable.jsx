// src/components/resultados/ResultadosTable.jsx - Versión actualizada con filtro por nombre
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
 * @returns {JSX.Element} Componente de tabla de resultados
 */
const ResultadosTable = () => {
  // Estados para filtros y datos
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para filtros (ahora usamos principalmente selección, no texto)
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [curso, setCurso] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState(""); // Nuevo estado para filtrar por nombre
  
  // Estado para modal de exportación
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Estados para visualización de gráficos
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  
  // Estado para ID del creador (profesor)
  const [creadorId, setCreadorId] = useState(null);

  // Estados para distribución normal
  const [minijuegoSeleccionado, setMinijuegoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [miniJuegosDisponibles, setMiniJuegosDisponibles] = useState([]);
  
  // Estados para visualización por estudiante
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [modoVisualizacion, setModoVisualizacion] = useState("general");
  
  // Nuevo estado para cursos disponibles
  const [cursosDisponibles, setCursosDisponibles] = useState([]);

  // Obtener creador ID al cargar el componente
  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        if (userData?.id) setCreadorId(userData.id);
      }
    } catch (err) {
      console.log("Usuario Creador No encontrado");
    }
  }, []);

  // Cargar resultados cuando tenemos el creadorId
  useEffect(() => {
    if (creadorId !== null) {
      cargarResultados();
    }
  }, [creadorId]);

  // Función para cargar resultados desde la API
  const cargarResultados = async () => {
    setLoading(true);
    try {
      // Si estamos en modo por estudiante y hay un estudiante seleccionado, usamos su nombre
      let nombreCompletoFinal = null;
      
      if (modoVisualizacion === "porEstudiante" && estudianteSeleccionado) {
        nombreCompletoFinal = estudianteSeleccionado.nombre;
        console.log(`Filtro por estudiante: ${nombreCompletoFinal}`);
      } else if (nombreCompleto) {
        nombreCompletoFinal = nombreCompleto;
        console.log(`Filtro por nombre: ${nombreCompletoFinal}`);
      }

      const data = await obtenerResultados(
        null, // No usamos ID, solo nombre
        minijuegoId ? parseInt(minijuegoId) : null,
        curso || null,
        null,
        creadorId,
        nombreCompletoFinal // Pasamos el nombre completo a la API
      );

      let resultadosProcesados = [];

      // Procesar datos según formato recibido
      if (data?.$values) {
        resultadosProcesados = data.$values;
      } else if (Array.isArray(data)) {
        resultadosProcesados = data;
      } else {
        console.warn("Formato de datos desconocido:", data);
        resultadosProcesados = Array.isArray(data) ? data : [];
      }

      // Filtro por minijuego si está seleccionado
      if (minijuegoSeleccionado && (modoVisualizacion === "general" || modoVisualizacion === "porMinijuego")) {
        resultadosProcesados = resultadosProcesados.filter(item => 
          (item.tituloMinijuego || item.minijuego || "Sin nombre") === minijuegoSeleccionado
        );
      }

      setResultados(resultadosProcesados);
      console.log("Resultados cargados:", resultadosProcesados.length);

      // Extraer lista de minijuegos disponibles
      const uniqueMinijuegos = extraerMinijuegosUnicos(resultadosProcesados);
      setMiniJuegosDisponibles(uniqueMinijuegos);
      
      // Extraer cursos disponibles
      const uniqueCursos = [...new Set(
        resultadosProcesados.map(item => item.curso || "").filter(Boolean)
      )].sort();
      setCursosDisponibles(uniqueCursos);
      
    } catch (err) {
      console.error("Error al cargar resultados:", err);
      setError("Error al cargar los resultados. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar resultados
  const handleExport = async (tipoArchivo) => {
    try {
      // Si tenemos un estudiante seleccionado, usamos su nombre
      let nombreCompletoFinal = null;
      
      if (estudianteSeleccionado) {
        nombreCompletoFinal = estudianteSeleccionado.nombre;
      } else if (nombreCompleto) {
        nombreCompletoFinal = nombreCompleto;
      }

      // También pasamos el nombre completo para la exportación
      await exportarResultados(
        tipoArchivo,
        null, // No usamos ID, solo nombre
        minijuegoId ? parseInt(minijuegoId) : null,
        curso || null,
        null,
        creadorId,
        nombreCompletoFinal
      );
      setShowExportModal(false);
    } catch (error) {
      setError(
        "Error al exportar los resultados. Por favor, intenta de nuevo."
      );
    }
  };
  
  // Manejar cambio en modo de visualización
  const handleModoVisualizacionChange = (nuevoModo) => {
    setModoVisualizacion(nuevoModo);
    
    // Solo reseteamos selecciones si cambiamos de modo completamente
    if (nuevoModo === "general") {
      // En modo general podemos mantener las selecciones
    } else if (nuevoModo === "porMinijuego") {
      setEstudianteSeleccionado(null);
      setNombreCompleto(""); // Limpiar el filtro por nombre
    } else if (nuevoModo === "porEstudiante") {
      setMinijuegoSeleccionado("");
    }
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
        setNombreCompleto={setNombreCompleto} // Nueva prop para pasar el setter
        nombreCompleto={nombreCompleto} // Nueva prop para pasar el valor actual
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

        // Propiedades para cursos
        cursosDisponibles={cursosDisponibles}
      />

      {/* Panel de Gráficos */}
      <ChartPanel
        // Propiedades generales
        resultados={resultados}
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

      {/* Tabla de Datos */}
      <DataTable
        resultados={resultados}
        loading={loading}
        error={error}
      />

      {/* Modal de Exportación */}
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default ResultadosTable;