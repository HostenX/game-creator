import React, { useState, useEffect } from "react";
import { ESTADO_LABELS } from "./MinijuegosTable";

const EditMinijuegoModal = ({ isOpen, onClose, minijuego, onSave }) => {
  const [formData, setFormData] = useState({
    Titulo: "",
    Descripcion: "",
    EstadoId: "",
    TematicoId: "",
    TipoMinijuego: "",
    PuntosBase: "",
    PenalidadPuntos: "",
    ValoresPregunta: "",
    ValoresRespuesta: "",
    RespuestaCorrecta: "",
  });

  useEffect(() => {
    if (minijuego) {
      setFormData({
        ...minijuego,
      });
    }
  }, [minijuego]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderDynamicFields = () => {
    switch (formData.TipoMinijuego) {
      case "Ecuacion":
        return (
          <>
            <label>Valores de la pregunta:</label>
            <input type="text" name="ValoresPregunta" value={formData.ValoresPregunta} onChange={handleChange} />
            <label>Valores de respuesta:</label>
            <input type="text" name="ValoresRespuesta" value={formData.ValoresRespuesta} onChange={handleChange} />
          </>
        );
      case "Frase":
        return (
          <>
            <label>Valores de la pregunta:</label>
            <input type="text" name="ValoresPregunta" value={formData.ValoresPregunta} onChange={handleChange} />
            <label>Valores de respuesta:</label>
            <input type="text" name="ValoresRespuesta" value={formData.ValoresRespuesta} onChange={handleChange} />
            <label>Respuesta correcta:</label>
            <input type="text" name="RespuestaCorrecta" value={formData.RespuestaCorrecta} onChange={handleChange} />
          </>
        );
      case "Balanza":
        return (
          <>
            <label>Valores de respuesta:</label>
            <input type="text" name="ValoresRespuesta" value={formData.ValoresRespuesta} onChange={handleChange} />
          </>
        );
      case "Conectar":
        return (
          <>
            <label>Valores de la pregunta:</label>
            <input type="text" name="ValoresPregunta" value={formData.ValoresPregunta} onChange={handleChange} />
            <label>Valores de respuesta:</label>
            <input type="text" name="ValoresRespuesta" value={formData.ValoresRespuesta} onChange={handleChange} />
          </>
        );
      default:
        return <p>Seleccione un tipo de minijuego para configurar sus campos.</p>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ ...formData, minijuegoId: minijuego.minijuegoId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Minijuego</h2>
        <form onSubmit={handleSubmit}>
          <label>Título:</label>
          <input type="text" name="Titulo" value={formData.Titulo} onChange={handleChange} />
          
          <label>Descripción:</label>
          <textarea name="Descripcion" value={formData.Descripcion} onChange={handleChange} />
          
          <label>Estado:</label>
          <select name="EstadoId" value={formData.EstadoId} onChange={handleChange}>
            {Object.entries(ESTADO_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <label>Temático ID:</label>
          <input type="number" name="TematicoId" value={formData.TematicoId} onChange={handleChange} />
          
          <label>Tipo de Minijuego:</label>
          <select name="TipoMinijuego" value={formData.TipoMinijuego} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Ecuacion">Ecuación</option>
            <option value="Frase">Frase</option>
            <option value="Balanza">Balanza</option>
            <option value="Conectar">Conectar</option>
          </select>
          
          {renderDynamicFields()}
          
          <label>Puntos base:</label>
          <input type="number" name="PuntosBase" value={formData.PuntosBase} onChange={handleChange} />
          
          <label>Penalidad de puntos:</label>
          <input type="number" name="PenalidadPuntos" value={formData.PenalidadPuntos} onChange={handleChange} />
          
          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMinijuegoModal;
