// src/components/resultados/charts/ChartStats.jsx
import React from "react";
import { formatTiempo } from "../../utils/formatUtils";

/**
 * Componente de estadísticas para los gráficos de barras y líneas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de estadísticas
 */
const ChartStats = ({ datos }) => {
  if (!datos || datos.length === 0) return null;

  return (
    <div className="estadisticas-resumen">
      <h3>Estadísticas por Minijuego</h3>
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
          {datos.map((item, index) => (
            <tr key={`stat-${index}`}>
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

export default ChartStats;