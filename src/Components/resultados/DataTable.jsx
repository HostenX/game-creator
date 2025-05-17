import React from "react";
import { formatFecha, formatTiempo, tipoMinijuego } from "../utils/formatUtils";

/**
 * Componente de tabla de datos para mostrar resultados
 */
const DataTable = ({ resultados, loading, error, onReload }) => {
  const renderizarFila = (resultado, index) => (
    <tr key={`resultado-${resultado.$id || resultado.resultadoId || index}`}>
      <td>{resultado.nombreCompleto || "N/A"}</td>
      <td>{resultado.tituloMinijuego || "N/A"}</td>
      <td>
        {resultado.tipoMinijuego ||
          tipoMinijuego(resultado.minijuego) ||
          "N/A"}
      </td>
      <td>{resultado.curso || "N/A"}</td>
      <td>{resultado.puntaje || resultado.puntajeObtenido || 0}</td>
      <td>{resultado.puntosBase || 0}</td>
      <td>{resultado.penalidadPuntos || 0}</td>
      <td>
        {resultado.tiempoFormateado ||
          formatTiempo(resultado.tiempoEjecucion || resultado.tiempoSegundos)}
      </td>
      <td>{resultado.fecha || formatFecha(resultado.fechaResultado)}</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="reload-btn" onClick={onReload}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!resultados || resultados.length === 0) {
    return (
      <div className="no-resultados">
        <p>No se encontraron resultados con los filtros aplicados.</p>
        <button className="filtrar-btn" onClick={onReload}>
          Limpiar filtros y cargar todos
        </button>
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
        <button className="exportar-btn" onClick={onReload}>
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default DataTable;