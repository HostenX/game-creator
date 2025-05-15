// src/components/resultados/Charts/ScatterChartEstudiante.jsx
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
  ZAxis,
  Cell,
} from "recharts";
import { EstudianteTooltip, calcularEstadisticasEstudiante } from "../../utils/dataProcessingUtils";
import { formatTiempo } from "../../utils/formatUtils";

// Función para generar colores únicos por minijuego
const generarColorPorMinijuego = (minijuegos) => {
  const colores = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", 
    "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"
  ];
  
  const mapaColores = {};
  minijuegos.forEach((minijuego, index) => {
    mapaColores[minijuego] = colores[index % colores.length];
  });
  
  return mapaColores;
};

/**
 * Componente para mostrar estadísticas por minijuego de un estudiante
 */
export const EstadisticasEstudiante = ({ datos, estudiante }) => {
  if (!datos || datos.length === 0 || !estudiante) return null;
  
  const estadisticas = calcularEstadisticasEstudiante(datos);
  
  return (
    <div className="estadisticas-estudiante">
      <h4>Estadísticas de {estudiante.nombre}</h4>
      
      <table className="stats-table">
        <thead>
          <tr>
            <th>Minijuego</th>
            <th>Intentos</th>
            <th>Puntaje Promedio</th>
            <th>Tiempo Promedio</th>
          </tr>
        </thead>
        <tbody>
          {estadisticas.map((item, index) => (
            <tr key={`stat-estudiante-${index}`}>
              <td>{item.nombre}</td>
              <td>{item.intentos}</td>
              <td>{item.puntajePromedio.toFixed(1)}</td>
              <td>{formatTiempo(item.tiempoPromedio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Componente principal para gráfico de dispersión por estudiante
 */
const ScatterChartEstudiante = ({ puntos, estudiante }) => {
  // Lista de minijuegos únicos para asignar colores
  const minijuegosUnicos = useMemo(() => 
    [...new Set(puntos.map(p => p.minijuego))],
    [puntos]
  );
  
  // Mapa de colores por minijuego
  const coloresPorMinijuego = useMemo(() => 
    generarColorPorMinijuego(minijuegosUnicos),
    [minijuegosUnicos]
  );
  
  // Función para generar la curva de tendencia general
  const generarCurvaTendencia = (datos) => {
    if (!datos || datos.length < 3) return [];
    
    // Extraer vectores X e Y
    const vectorX = datos.map(d => d.x);
    const vectorY = datos.map(d => d.y);
    
    // Regresión lineal simple
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = vectorX.length;
    
    for (let i = 0; i < n; i++) {
      sumX += vectorX[i];
      sumY += vectorY[i];
      sumXY += vectorX[i] * vectorY[i];
      sumX2 += vectorX[i] * vectorX[i];
    }
    
    // Si hay pocos puntos o todos son muy similares, evitar división por cero
    if (n < 2 || Math.abs(n * sumX2 - sumX * sumX) < 1e-10) {
      return [];
    }
    
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    
    // Generar puntos para la línea de tendencia
    const minX = Math.min(...vectorX);
    const maxX = Math.max(...vectorX);
    const paso = (maxX - minX) / 50;
    
    const puntosCurva = [];
    for (let i = 0; i <= 50; i++) {
      const x = minX + i * paso;
      const y = m * x + b;
      puntosCurva.push({ x, y, tipo: 'curva' });
    }
    
    return puntosCurva;
  };
  
  // Generar curva de tendencia
  const curva = useMemo(() => 
    generarCurvaTendencia(puntos),
    [puntos]
  );
  
  if (!puntos || puntos.length === 0 || !estudiante) {
    return (
      <div className="no-datos">
        <p>No hay datos suficientes para generar el gráfico.</p>
      </div>
    );
  }

  return (
    <div className="grafico-estudiante-wrapper">
      <h3>Análisis de Rendimiento del Estudiante</h3>
      <p className="grafico-subtitulo">Estudiante: {estudiante.nombre}</p>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            dataKey="x"
            name="Tiempo (segundos)"
            stroke="#fff"
            label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5, fill: '#fff' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Puntaje"
            stroke="#fff"
            label={{ value: 'Puntaje', angle: -90, position: 'insideLeft', offset: 10, fill: '#fff' }}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip content={<EstudianteTooltip />} />
          <Legend />

          {/* Puntos de datos agrupados por minijuego */}
          <Scatter
            name="Minijuegos"
            data={puntos}
            fill="#00b894"
          >
            {puntos.map((punto, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={coloresPorMinijuego[punto.minijuego] || "#00b894"} 
              />
            ))}
          </Scatter>

          {/* Línea de tendencia general */}
          {curva.length > 0 && (
            <Scatter
              name="Tendencia General"
              data={curva}
              line={{ stroke: '#ffffff', strokeWidth: 2 }}
              shape={() => null}
              legendType="line"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Tabla de estadísticas */}
      <EstadisticasEstudiante 
        datos={puntos} 
        estudiante={estudiante} 
      />
      
      {/* Leyenda de colores */}
      <div className="minijuegos-leyenda">
        <h4>Leyenda de Minijuegos</h4>
        <div className="colores-grid">
          {minijuegosUnicos.map((minijuego, index) => (
            <div key={`leyenda-${index}`} className="color-item">
              <span 
                className="color-muestra" 
                style={{ 
                  backgroundColor: coloresPorMinijuego[minijuego], 
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  marginRight: '8px',
                  borderRadius: '4px'
                }}
              ></span>
              <span className="minijuego-nombre">{minijuego}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScatterChartEstudiante;