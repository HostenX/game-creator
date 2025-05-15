// src/components/resultados/ResultadosTable.jsx - Con depuración mejorada para estudiantes
import React, { useState, useEffect } from "react";
import { exportarResultados, obtenerResultados } from "../../Services/apiService";
import FiltersPanel from "./FiltersPanel";
import ChartPanel from "./ChartPanel";
import DataTable from "./DataTable";
import ExportModal from "./ExportModal";
import { extraerMinijuegosUnicos } from "../utils/dataProcessingUtils";

/**
 * Componente principal de la tabla de resultados
 * @returns {JSX.Element} Componente de tabla de resultados
 */
const ResultadosTable = () => {
  // Estados para filtros y datos
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [curso, setCurso] = useState("");
  
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
  
  // Nuevos estados para visualización por estudiante
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [modoVisualizacion, setModoVisualizacion] = useState("general");

  // Depuración - Revisar los datos de resultados
  useEffect(() => {
    if (resultados.length > 0) {
      // Mostrar los primeros 2 resultados para verificar la estructura
      console.log("Muestra de resultados (primeros 2):", resultados.slice(0, 2));
      
      // Verificar campos de estudiantes
      const estudiantesCampos = resultados.map(r => ({
        usuarioId: r.usuarioId,
        idUsuario: r.idUsuario,
        nombreCompleto: r.nombreCompleto,
        nombre: r.nombre
      })).slice(0, 5);
      
      console.log("Campos de estudiantes (muestra):", estudiantesCampos);
    }
  }, [resultados]);

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
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;

      // Si estamos en modo por estudiante y hay un estudiante seleccionado, usamos su ID
      let usuarioIdFinal = usuarioIdNum;
      if (modoVisualizacion === "porEstudiante" && estudianteSeleccionado) {
        usuarioIdFinal = estudianteSeleccionado.id;
        console.log(`Filtro automático por estudiante: ${estudianteSeleccionado.nombre} (ID: ${usuarioIdFinal})`);
      }

      // Si estamos en modo por minijuego, podríamos usar su ID, pero lo haremos por filtrado posterior
      const data = await obtenerResultados(
        usuarioIdFinal,
        minijuegoIdNum,
        curso || null,
        null,
        creadorId
      );

      let resultadosProcesados = [];

      // Procesar datos según formato recibido
      if (data?.$values) {
        resultadosProcesados = data.$values;
        console.log("Datos recibidos en formato $values");
      } else if (Array.isArray(data)) {
        resultadosProcesados = data;
        console.log("Datos recibidos en formato array");
      } else {
        console.warn("Formato de datos desconocido:", data);
        resultadosProcesados = Array.isArray(data) ? data : [];
      }

      // Verificar estructura de los primeros elementos
      if (resultadosProcesados.length > 0) {
        console.log("Estructura del primer resultado:", Object.keys(resultadosProcesados[0]));
        
        // Verificar campos específicos para estudiantes
        const camposEstudiante = {
          usuarioId: resultadosProcesados[0].usuarioId,
          idUsuario: resultadosProcesados[0].idUsuario,
          nombreCompleto: resultadosProcesados[0].nombreCompleto,
          nombre: resultadosProcesados[0].nombre
        };
        console.log("Campos de estudiante en primer resultado:", camposEstudiante);
      }

      // Filtrar por curso si se proporciona
      if (curso && curso.trim() !== "") {
        resultadosProcesados = resultadosProcesados.filter((item) =>
          item.curso?.toLowerCase().includes(curso.toLowerCase())
        );
      }

      // Aplicar los filtros adicionales para unificar la experiencia
      console.log("Resultados recibidos:", resultadosProcesados.length);
      
      // Filtro por minijuego si está seleccionado (modo general o porMinijuego)
      if (minijuegoSeleccionado && (modoVisualizacion === "general" || modoVisualizacion === "porMinijuego")) {
        console.log(`Filtrando por minijuego: ${minijuegoSeleccionado}`);
        resultadosProcesados = resultadosProcesados.filter(item => 
          (item.tituloMinijuego || item.minijuego || "Sin nombre") === minijuegoSeleccionado
        );
      }

      setResultados(resultadosProcesados);
      console.log("Resultados finales:", resultadosProcesados.length);

      // Extraer lista de minijuegos disponibles
      const uniqueMinijuegos = extraerMinijuegosUnicos(resultadosProcesados);
      setMiniJuegosDisponibles(uniqueMinijuegos);
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
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;

      await exportarResultados(
        tipoArchivo,
        usuarioIdNum,
        minijuegoIdNum,
        curso || null,
        null,
        creadorId
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
    } else if (nuevoModo === "porEstudiante") {
      setMinijuegoSeleccionado("");
    }
  };

  return (
    <div className="resultados-container">
      <h2>Resultados de Minijuegos</h2>

      {/* Panel de Filtros Unificado */}
      <FiltersPanel
        // Propiedades para filtros de búsqueda
        usuarioId={usuarioId}
        setUsuarioId={setUsuarioId}
        minijuegoId={minijuegoId}
        setMinijuegoId={setMinijuegoId}
        curso={curso}
        setCurso={setCurso}
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