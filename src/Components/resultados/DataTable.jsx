// src/components/resultados/DataTable.jsx
import React from "react";
import { formatFecha, formatTiempo, tipoMinijuego } from "../../utils/formatUtils";

/**
 * Componente de tabla de datos para mostrar resultados
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de resultados
 */
const DataTable = ({ resultados, loading, error }) => {
  // Renderizar fila de resultado
  const renderizarFila = (resultado, index) => (
    <tr key={`resultado-${resultado.$id || index}`}>
      <td>{resultado.nombreCompleto || "N/A"}</td>
      <td>{resultado.tituloMinijuego || "N/A"}</td>
      <td>
        {resultado.tipoMinijuego ||
          tipoMinijuego(resultado.minijuego) ||
          "N/A"}
      </td>
      <td>{resultado.curso || "N/A"}</td>
      <td>{resultado.puntaje || 0}</td>
      <td>{resultado.puntosBase || 0}</td>
      <td>{resultado.penalidadPuntos || 0}</td>
      <td>
        {resultado.tiempoFormateado ||
          formatTiempo(resultado.tiempoSegundos)}
      </td>
      <td>{resultado.fecha || formatFecha(resultado.fechaResultado)}</td>
    </tr>
  );

  if (loading) {
    return <div className="loading">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (resultados.length === 0) {
    return (
      <div className="no-resultados">
        No se encontraron resultados con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="tabla-container">
      <table className="resultados-tabla">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Minijuego</th>
            <th>Tipo</th>
            <th>Curso</th>
            <th>Puntaje</th>
            <th>Puntos Base</th>
            <th>Penalidad</th>
            <th>Tiempo (mm:ss)</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((resultado, index) =>
            renderizarFila(resultado, index)
          )}
        </tbody>
      </table>
      
      <div className="resultados-stats">
        <p>
          Total de resultados: <strong>{resultados.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default DataTable;