import React, { useState } from "react";
import { saveMinijuego } from "../Services/apiService";

const MinijuegoForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    Titulo: "",
    Descripcion: "",
    EstadoId: 1,
    TipoMinijuego: "",
    TematicoId: 0, // Campo numérico para el ID temático
    ValoresPregunta: "",
    ValoresRespuesta: "",
    RespuestaCorrecta: "",
    PenalidadPuntos: 0,
    PuntosBase: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await saveMinijuego(formData);
    if (result.success) {
      onSave();
    } else {
      console.error("Error al guardar:", result.message);
    }
  };

  const renderDynamicFields = () => {
    switch (formData.TipoMinijuego) {
      case "Ecuacion":
        return (
          <>
            <div>
              <label>Valores de la pregunta (e.g., 2 + _ = 3):</label>
              <input
                type="text"
                name="ValoresPregunta"
                value={formData.ValoresPregunta}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Valores de respuesta (e.g., 1, 2, 3):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "Frase":
        return (
          <>
            <div>
              <label>Valores de la pregunta (e.g., Había _ vez un _):</label>
              <input
                type="text"
                name="ValoresPregunta"
                value={formData.ValoresPregunta}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Valores de respuesta (e.g., una, valiente):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Respuesta correcta:</label>
              <input
                type="text"
                name="RespuestaCorrecta"
                value={formData.RespuestaCorrecta}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "Balanza":
        return (
          <>
            <div>
              <label>Valores de respuesta (e.g., 1.5, 2.5):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "Conectar":
        return (
          <>
            <div>
              <label>Valores de la pregunta (e.g., 2+2, 1+1):</label>
              <input
                type="text"
                name="ValoresPregunta"
                value={formData.ValoresPregunta}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Valores de respuesta (e.g., 4, 2):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
              />
            </div>
          </>
        );
      default:
        return <p>Seleccione un tipo de minijuego para configurar sus campos.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input
          type="text"
          name="Titulo"
          value={formData.Titulo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          name="Descripcion"
          value={formData.Descripcion}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado:</label>
        <input
          type="number"
          name="EstadoId"
          value={formData.EstadoId}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Temático ID:</label>
        <input
          type="number"
          name="TematicoId"
          value={formData.TematicoId}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipo de Minijuego:</label>
        <select
          name="TipoMinijuego"
          value={formData.TipoMinijuego}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          <option value="Ecuacion">Ecuación</option>
          <option value="Frase">Frase</option>
          <option value="Balanza">Balanza</option>
          <option value="Conectar">Conectar</option>
        </select>
      </div>
      {renderDynamicFields()}
      <div>
        <label>Puntos base:</label>
        <input
          type="number"
          name="PuntosBase"
          value={formData.PuntosBase}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Penalidad de puntos:</label>
        <input
          type="number"
          name="PenalidadPuntos"
          value={formData.PenalidadPuntos}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default MinijuegoForm;
