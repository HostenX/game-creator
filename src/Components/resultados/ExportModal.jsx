import React from "react";

/**
 * Modal mejorado para exportar resultados
 */
const ExportModal = ({ show, onClose, onExport }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Exportar Resultados</h2>
        
        <p>
          Se exportarán los resultados con los filtros actuales aplicados.
        </p>
        
        <div className="export-info">
          <p>Selecciona el formato para la exportación:</p>
          
          <div className="format-options">
            <div className="format-option">
              <div className="format-icon">📊</div>
              <div className="format-details">
                <h3>Excel</h3>
                <p>Formato de hoja de cálculo. Ideal para análisis de datos y gráficos personalizados.</p>
              </div>
            </div>
            
            <div className="format-option">
              <div className="format-icon">📄</div>
              <div className="format-details">
                <h3>PDF</h3>
                <p>Documento portátil. Ideal para impresión y compartir en formato no editable.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <button 
            onClick={() => onExport("excel")}
            className="export-excel-btn"
          >
            Exportar a Excel
          </button>
          
          <button 
            onClick={() => onExport("pdf")}
            className="export-pdf-btn"
          >
            Exportar a PDF
          </button>
          
          <button 
            onClick={onClose}
            className="cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;