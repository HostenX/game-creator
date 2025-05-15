// src/components/resultados/charts/BarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Componente de gráfico de barras para puntajes promedio
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Gráfico de barras
 */
const BarChartComponent = ({ datos }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={datos}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis
          dataKey="nombre"
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="#fff"
        />
        <YAxis
          label={{
            value: "Puntaje",
            angle: -90,
            position: "insideLeft",
            fill: "#fff",
          }}
          stroke="#fff"
        />
        <Tooltip />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Bar
          dataKey="puntajePromedio"
          name="Puntaje Promedio"
          fill="#0088FE"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;