import React, { useState } from "react";
import { createTematicoWithApoyo } from "../Services/apiService";

const TematicoForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    ApoyoNombre: "",
    ApoyoDescripcion: "",
    TituloTematico: "",
    Descripcion: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createTematicoWithApoyo(formData);
    if (response.success === false) {
      setError(response.message || "Error al guardar Temático con Apoyo.");
    } else {
      setFormData({
        ApoyoNombre: "",
        ApoyoDescripcion: "",
        TituloTematico: "",
        Descripcion: "",
      });
      onSave();
    }
  };

  return (
    <div>
      <h2>Crear Temático y Apoyo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Apoyo:</label>
          <input
            type="text"
            name="ApoyoNombre"
            value={formData.ApoyoNombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción del Apoyo:</label>
          <textarea
            name="ApoyoDescripcion"
            value={formData.ApoyoDescripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Título del Temático:</label>
          <input
            type="text"
            name="TituloTematico"
            value={formData.TituloTematico}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción del Temático:</label>
          <textarea
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default TematicoForm;
