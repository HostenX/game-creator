// src/components/resultados/charts/PieChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Componente de gráfico circular para distribución de intentos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Gráfico circular
 */
const PieChartComponent = ({ datos }) => {
  // Colores para el gráfico circular
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={160}
          fill="#8884d8"
          dataKey="value"
        >
          {datos.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} intentos`, "Cantidad"]}
        />
        <Legend wrapperStyle={{ color: "#fff" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;