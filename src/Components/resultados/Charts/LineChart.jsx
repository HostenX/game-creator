// src/components/resultados/charts/LineChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Componente de gráfico de líneas para tiempos promedio
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Gráfico de líneas
 */
const LineChartComponent = ({ datos }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
            value: "Tiempo (seg)",
            angle: -90,
            position: "insideLeft",
            fill: "#fff",
          }}
          stroke="#fff"
        />
        <Tooltip />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Line
          type="monotone"
          dataKey="tiempoPromedio"
          name="Tiempo Promedio (seg)"
          stroke="#00C49F"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;