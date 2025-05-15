// src/components/resultados/Charts/ScatterChart.jsx - Versión mejorada
import React, { useMemo } from "react";
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
import CustomTooltip from "../common/CustomTooltip";
import { calcularMediaYDesviacion } from "../../utils/chartUtils";
import { formatTiempo } from "../../utils/formatUtils";

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
 * Función mejorada para generar la curva de tendencia
 * @param {Array} datos - Puntos de datos para generar la curva
 */
const generarCurvaTendenciaMejorada = (datos) => {
  if (!datos || datos.length < 3) return [];
  
  // Extraer vectores X e Y
  const vectorX = datos.map(d => d.x);
  const vectorY = datos.map(d => d.y);
  
  // Verificar la variabilidad en Y
  const minY = Math.min(...vectorY);
  const maxY = Math.max(...vectorY);
  const rangoY = maxY - minY;
  
  // Si todos los valores Y son casi iguales (menos de 1% de variación)
  // usamos un enfoque de línea plana en lugar de polinomial
  if (rangoY < 0.01 * maxY) {
    const mediaY = vectorY.reduce((sum, y) => sum + y, 0) / vectorY.length;
    const minX = Math.min(...vectorX);
    const maxX = Math.max(...vectorX);
    
    // Crear línea horizontal en la media de Y
    return [
      { x: minX, y: mediaY, tipo: 'curva' },
      { x: maxX, y: mediaY, tipo: 'curva' }
    ];
  }
  
  // Para datos con poca variación pero no completamente planos,
  // usamos una regresión lineal simple en lugar de polinomial
  if (rangoY < 0.1 * maxY) {
    // Calcular regresión lineal simple (y = mx + b)
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = vectorX.length;
    
    for (let i = 0; i < n; i++) {
      sumX += vectorX[i];
      sumY += vectorY[i];
      sumXY += vectorX[i] * vectorY[i];
      sumX2 += vectorX[i] * vectorX[i];
    }
    
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    
    // Generar puntos para la línea
    const minX = Math.min(...vectorX);
    const maxX = Math.max(...vectorX);
    const paso = (maxX - minX) / 20;
    
    const puntos = [];
    for (let x = minX; x <= maxX; x += paso) {
      const y = m * x + b;
      puntos.push({ x, y, tipo: 'curva' });
    }
    
    return puntos;
  }
  
  // Si hay suficiente variación, usar la regresión polinomial (implementada en chartUtils)
  // Esta parte usaría la generarCurvaTendencia de chartUtils
  // Por ahora usamos una implementación simplificada
  const minX = Math.min(...vectorX);
  const maxX = Math.max(...vectorX);
  const paso = (maxX - minX) / 50;
  
  // Regresión polinomial simplificada para este ejemplo
  const puntos = [];
  for (let i = 0; i <= 50; i++) {
    const x = minX + i * paso;
    // Cálculo simple para la demostración - normalmente usaríamos la regresión polinomial
    let sumY = 0, sumW = 0;
    
    // Interpolación con pesos inversamente proporcionales a la distancia
    for (let j = 0; j < vectorX.length; j++) {
      const dist = Math.abs(x - vectorX[j]);
      const peso = dist < 0.001 ? 1000 : 1 / (dist * dist);
      sumY += vectorY[j] * peso;
      sumW += peso;
    }
    
    const y = sumW > 0 ? sumY / sumW : 0;
    puntos.push({ x, y, tipo: 'curva' });
  }
  
  return puntos;
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
  // Generar curva de tendencia con detección de casos especiales
  const curva = useMemo(() => 
    generarCurvaTendenciaMejorada(puntos), 
    [puntos]
  );
  
  // Calcular el dominio del eje Y adecuado
  const calcularDominioY = () => {
    if (!puntos || puntos.length === 0) return ['auto', 'auto'];
    
    const valores = puntos.map(p => p.y);
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    
    // Si los valores son casi iguales, ampliar el rango para mejor visualización
    if (Math.abs(max - min) < 0.01 * max) {
      const media = (max + min) / 2;
      const margen = media * 0.05; // 5% de margen
      return [Math.max(0, media - margen), media + margen];
    }
    
    return ['auto', 'auto'];
  };

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
                domain={calcularDominioY()}
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