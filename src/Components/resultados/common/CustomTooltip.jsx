// src/components/common/CustomTooltip.jsx
import React from "react";

/**
 * Tooltip personalizado para gráficos de resultados
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.active - Si el tooltip está activo
 * @param {Array} props.payload - Datos para mostrar en el tooltip
 * @returns {JSX.Element|null} Componente de tooltip o null si no está activo
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0 && payload[0].payload.tipo === "dato") {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#2a1a4a",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      >
        <p>
          <strong>Estudiante:</strong> {data.nombre}
        </p>
        <p>
          <strong>Curso:</strong> {data.curso}
        </p>
        <p>
          <strong>Puntaje:</strong> {data.puntaje}
        </p>
        <p>
          <strong>Tiempo:</strong> {data.tiempo}
        </p>
        <p>
          <strong>Puntos Base:</strong> {data.puntosBase || 0}
        </p>
        <p>
          <strong>Penalidad:</strong> {data.penalidadPuntos || 0}
        </p>
        <p>
          <strong>Fecha:</strong> {data.fecha}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;