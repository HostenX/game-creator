// src/components/resultados/ChartPanel.jsx
import React from "react";
import BarChartComponent from "./Charts/BarChart";
import LineChartComponent from "./Charts/LineChart";
import PieChartComponent from "./Charts/PieChart";
import ScatterChartComponent from "./Charts/ScatterChart";
import ChartStats from "./Charts/ChartStats";
import { 
  procesarDatosGraficos, 
  procesarDatosPie,
  procesarDatosDistribucion
} from "../utils/dataProcessingUtils";

/**
 * Panel principal de gráficos que contiene selector y renderiza el gráfico seleccionado
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Panel de gráficos
 */
const ChartPanel = ({ 
  resultados,
  mostrarGraficos,
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin, 
  miniJuegosDisponibles
}) => {
  // Estado para el tipo de gráfico seleccionado
  const [tipoGrafico, setTipoGrafico] = React.useState("barras");

  if (!mostrarGraficos || resultados.length === 0) return null;

  // Procesar datos según el tipo de gráfico
  const datosGraficos = procesarDatosGraficos(resultados);
  const datosPie = procesarDatosPie(resultados);
  const datosDispersion = procesarDatosDistribucion(
    resultados, 
    minijuegoSeleccionado, 
    fechaInicio, 
    fechaFin
  );

  // Renderizar el gráfico seleccionado
  const renderizarGrafico = () => {
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
      case "distribucion":
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
      default:
        return null;
    }
  };

  return (
    <div className="graficos-container">
      <div className="selector-grafico">
        <label>Tipo de Gráfico:</label>
        <select
          value={tipoGrafico}
          onChange={(e) => setTipoGrafico(e.target.value)}
        >
          <option value="barras">Puntaje Promedio por Minijuego</option>
          <option value="lineas">Tiempo Promedio por Minijuego</option>
          <option value="pie">Distribución de Intentos</option>
          <option value="distribucion">
            Distribución Normal (Puntaje vs Tiempo)
          </option>
        </select>
      </div>

      <div className="grafico-wrapper">{renderizarGrafico()}</div>
    </div>
  );
};

export default ChartPanel;