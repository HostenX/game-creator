// src/components/resultados/charts/ScatterChart.jsx
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "../../common/CustomTooltip";
import { generarCurvaTendencia } from "../../utils/chartUtils";
import { calcularMediaYDesviacion } from "../../utils/chartUtils";
import { formatTiempo } from "../../../utils/formatUtils";

/**
 * Componente para filtros de la distribución
 */
export const FiltrosDistribucion = ({
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  miniJuegosDisponibles,
}) => (
  <div className="filtros-distribucion">
    <div className="filtro-grupo">
      <label>Seleccionar Minijuego (obligatorio):</label>
      <select
        value={minijuegoSeleccionado}
        onChange={(e) => setMinijuegoSeleccionado(e.target.value)}
        required
      >
        <option value="">-- Seleccionar Minijuego --</option>
        {miniJuegosDisponibles.map((minijuego, index) => (
          <option key={`minijuego-${index}`} value={minijuego}>
            {minijuego}
          </option>
        ))}
      </select>
    </div>

    <div className="filtro-grupo">
      <label>Fecha Inicio:</label>
      <input
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />
    </div>

    <div className="filtro-grupo">
      <label>Fecha Fin:</label>
      <input
        type="date"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />
    </div>
  </div>
);

/**
 * Componente de estadísticas para el minijuego seleccionado
 */
export const EstadisticasMinijuego = ({ datos, minijuegoSeleccionado }) => {
  if (datos.length === 0) return null;

  const tiempos = datos.map((d) => d.x); // Tiempos en X
  const puntajes = datos.map((d) => d.y); // Puntajes en Y

  const { media: mediaTiempo } = calcularMediaYDesviacion(tiempos);
  const { media: mediaPuntaje } = calcularMediaYDesviacion(puntajes);

  const minTiempo = Math.min(...tiempos);
  const maxTiempo = Math.max(...tiempos);
  const minPuntaje = Math.min(...puntajes);
  const maxPuntaje = Math.max(...puntajes);

  const statItems = [
    { label: "Total estudiantes", value: datos.length },
    { label: "Tiempo promedio", value: formatTiempo(mediaTiempo) },
    { label: "Tiempo mínimo", value: formatTiempo(minTiempo) },
    { label: "Tiempo máximo", value: formatTiempo(maxTiempo) },
    { label: "Puntaje promedio", value: mediaPuntaje.toFixed(1) },
    { label: "Puntaje mínimo", value: minPuntaje },
    { label: "Puntaje máximo", value: maxPuntaje },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <div key={`stat-${index}`} className="stat-item">
          <span className="stat-label">{item.label}:</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente principal de gráfico de dispersión con línea de tendencia
 */
const ScatterChartComponent = ({
  puntos,
  minijuegoSeleccionado,
  minijuegosDisponibles,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  setMinijuegoSeleccionado,
}) => {
  // Generar la curva de tendencia con el algoritmo mejorado
  const curva = generarCurvaTendencia(puntos, 2, 100);

  return (
    <>
      <FiltrosDistribucion
        minijuegoSeleccionado={minijuegoSeleccionado}
        setMinijuegoSeleccionado={setMinijuegoSeleccionado}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        miniJuegosDisponibles={minijuegosDisponibles}
      />

      {!minijuegoSeleccionado ? (
        <div className="aviso-seleccion">
          <p>Por favor, selecciona un minijuego para visualizar el gráfico.</p>
        </div>
      ) : puntos.length === 0 ? (
        <div className="no-datos">
          <p>No hay datos suficientes para generar el gráfico con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grafico-distribucion-wrapper">
          <h3>Análisis de Puntaje vs Tiempo</h3>
          <p className="grafico-subtitulo">Minijuego: {minijuegoSeleccionado}</p>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                type="number"
                dataKey="x"
                name="Tiempo (segundos)"
                stroke="#fff"
                label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                domain={['auto', 'auto']}
                allowDataOverflow={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Puntaje"
                stroke="#fff"
                label={{ value: 'Puntaje', angle: -90, position: 'insideLeft', offset: 10, fill: '#fff' }}
                domain={['auto', 'auto']}
                allowDataOverflow={false}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Puntos de datos */}
              <Scatter
                name="Intentos"
                data={puntos}
                fill="#00b894"
                shape="circle"
              />

              {/* Curva de tendencia */}
              {curva.length > 0 && (
                <Scatter
                  name="Tendencia"
                  data={curva}
                  line={{ stroke: '#FFA726', strokeWidth: 2 }}
                  shape={() => null}
                  legendType="line"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>

          <div className="estadisticas-distribucion">
            <h4>Estadísticas de {minijuegoSeleccionado}</h4>
            <EstadisticasMinijuego
              datos={puntos}
              minijuegoSeleccionado={minijuegoSeleccionado}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ScatterChartComponent;