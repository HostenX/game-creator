// src/components/resultados/ExportModal.jsx
import React from "react";

/**
 * Modal para exportar resultados
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element|null} Modal o null si no debe mostrarse
 */
const ExportModal = ({ show, onClose, onExport }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Exportar Resultados</h2>
        <p>
          Selecciona el formato para exportar los resultados con los filtros
          actuales:
        </p>

        <div className="modal-buttons">
          <button onClick={() => onExport("pdf")}>Generar PDF</button>
          <button onClick={() => onExport("excel")}>
            Generar Excel
          </button>
          <button onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;