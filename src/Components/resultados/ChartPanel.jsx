// src/components/resultados/ChartPanel.jsx - Con importaciones actualizadas
import React from "react";
import BarChartComponent from "./Charts/BarChart";
import LineChartComponent from "./Charts/LineChart";
import PieChartComponent from "./Charts/PieChart";
import ScatterChartComponent from "./Charts/ScatterChart";
import ScatterChartEstudiante from "./Charts/ScatterChartEstudiante";
import ChartStats from "./Charts/ChartStats";

// Importar directamente desde el índice para evitar problemas de ruta
import { 
  procesarDatosGraficos, 
  procesarDatosPie,
  procesarDatosDistribucion,
  procesarDatosEstudiante
} from "../utils/dataProcessingUtils";

/**
 * Panel principal de gráficos que contiene selector y renderiza el gráfico seleccionado
 */
const ChartPanel = ({ 
  resultados,
  mostrarGraficos,
  // Propiedades para visualización por minijuego
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin, 
  miniJuegosDisponibles,
  // Propiedades para visualización por estudiante
  estudianteSeleccionado,
  // Modo de visualización
  modoVisualizacion = "general"
}) => {
  // Estado para el tipo de gráfico seleccionado
  const [tipoGrafico, setTipoGrafico] = React.useState("barras");

  if (!mostrarGraficos || resultados.length === 0) return null;

  // Procesar datos según el tipo de gráfico
  const datosGraficos = procesarDatosGraficos(resultados);
  const datosPie = procesarDatosPie(resultados);
  
  // Datos para gráfico de dispersión por minijuego
  const datosDispersion = procesarDatosDistribucion(
    resultados, 
    minijuegoSeleccionado, 
    fechaInicio, 
    fechaFin
  );
  
  // Datos para gráfico de dispersión por estudiante
  const datosEstudiante = estudianteSeleccionado 
    ? procesarDatosEstudiante(resultados, estudianteSeleccionado)
    : [];

  // Renderizar gráficos de análisis general
  const renderizarGraficoGeneral = () => {
    switch (tipoGrafico) {
      case "barras":
        return (
          <>
            <BarChartComponent datos={datosGraficos} />
            <ChartStats datos={datosGraficos} />
          </>
        );
      case "lineas":
        return (
          <>
            <LineChartComponent datos={datosGraficos} />
            <ChartStats datos={datosGraficos} />
          </>
        );
      case "pie":
        return <PieChartComponent datos={datosPie} />;
      default:
        return null;
    }
  };
  
  // Renderizar gráfico de análisis por estudiante
  const renderizarGraficoEstudiante = () => {
    if (!estudianteSeleccionado) {
      return (
        <div className="seleccion-requerida">
          <p>Por favor, selecciona un estudiante para visualizar su rendimiento.</p>
        </div>
      );
    }
    
    return (
      <ScatterChartEstudiante
        puntos={datosEstudiante}
        estudiante={estudianteSeleccionado}
      />
    );
  };
  
  // Renderizar gráfico de análisis por minijuego
  const renderizarGraficoMinijuego = () => {
    return (
      <ScatterChartComponent
        puntos={datosDispersion}
        minijuegoSeleccionado={minijuegoSeleccionado}
        minijuegosDisponibles={miniJuegosDisponibles}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        setMinijuegoSeleccionado={setMinijuegoSeleccionado}
      />
    );
  };
  
  // Renderizar el contenido según el modo de visualización
  const renderizarContenido = () => {
    switch (modoVisualizacion) {
      case "porEstudiante":
        return renderizarGraficoEstudiante();
      case "porMinijuego":
        return renderizarGraficoMinijuego();
      case "general":
      default:
        return (
          <>
            <div className="selector-grafico">
              <label>Tipo de Gráfico:</label>
              <select
                value={tipoGrafico}
                onChange={(e) => setTipoGrafico(e.target.value)}
              >
                <option value="barras">Puntaje Promedio por Minijuego</option>
                <option value="lineas">Tiempo Promedio por Minijuego</option>
                <option value="pie">Distribución de Intentos</option>
              </select>
            </div>

            <div className="grafico-wrapper">{renderizarGraficoGeneral()}</div>
          </>
        );
    }
  };

  return (
    <div className="graficos-container">
      {renderizarContenido()}
    </div>
  );
};

export default ChartPanel;