import React, { useState, useEffect } from "react";
import { saveMinijuego } from "../Services/apiService";

const MinijuegoForm = ({ onSave }) => {
  // Estados del componente
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones para el estado del minijuego
  const estadoOpciones = [
    { valor: 1, etiqueta: "Activo" },
    { valor: 2, etiqueta: "Inactivo" },
    { valor: 3, etiqueta: "En revisión" }
  ];

  // Obtener usuario del localStorage al cargar
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.id) {
      setUser(userData);
    } else {
      setError("No se encontró información de usuario. Por favor inicie sesión.");
    }
  }, []);

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    Titulo: "",
    Descripcion: "",
    EstadoId: 3, // Valor por defecto: "En revisión"
    TipoMinijuego: "",
    TematicoId: 0,
    ValoresPregunta: "",
    ValoresRespuesta: "",
    RespuestaCorrecta: "",
    PenalidadPuntos: 0,
    PuntosBase: 0,
    UsuarioCreadorId: 0,
    CursoMinijuego: ""
  });

  // Actualizar ID de usuario cuando esté disponible
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ 
        ...prev, 
        UsuarioCreadorId: user.id,
        CursoMinijuego: user.curso || "" // Asume que el curso está en el usuario
      }));
    }
  }, [user]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("Id") || name === "PuntosBase" || name === "PenalidadPuntos" 
        ? parseInt(value) || 0 
        : value
    });
    // Limpiar mensajes al editar
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const requiredFields = {
      Titulo: "El título es requerido",
      TipoMinijuego: "Debe seleccionar un tipo de minijuego"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field] || !formData[field].toString().trim()) {
        setError(message);
        return false;
      }
    }

    // Validaciones específicas por tipo de minijuego
    switch(formData.TipoMinijuego) {
      case "Frase":
        if (!formData.RespuestaCorrecta) {
          setError("Debe proporcionar una respuesta correcta para minijuegos de Frase");
          return false;
        }
        break;
      case "Conectar":
      case "Ecuacion":
        if (!formData.ValoresPregunta || !formData.ValoresRespuesta) {
          setError("Debe completar todos los campos requeridos para este tipo de minijuego");
          return false;
        }
        break;
    }

    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await saveMinijuego(formData);
      
      if (result.success) {
        setSuccess("Minijuego creado exitosamente!");
        onSave(); // Callback para actualizar lista o redireccionar
      } else {
        setError(result.message || "Error al guardar el minijuego");
      }
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar campos dinámicos según el tipo de minijuego
  const renderDynamicFields = () => {
    switch (formData.TipoMinijuego) {
      case "Frase":
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label>Frase incompleta (ej: "Había _ vez un _")</label>
              <input
                type="text"
                name="ValoresPregunta"
                value={formData.ValoresPregunta}
                onChange={handleChange}
                placeholder="Use _ para los espacios en blanco"
                required
              />
            </div>
            <div className="form-group">
              <label>Opciones de respuesta (separadas por comas):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
                placeholder="ej: una, valiente, pequeño"
                required
              />
            </div>
            <div className="form-group">
              <label>Respuesta correcta (ej: "una,valiente")</label>
              <input
                type="text"
                name="RespuestaCorrecta"
                value={formData.RespuestaCorrecta}
                onChange={handleChange}
                placeholder="Ingrese las respuestas correctas separadas por comas"
                required
              />
            </div>
          </div>
        );
      case "Conectar":
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label>Elementos a conectar (separados por comas):</label>
              <input
                type="text"
                name="ValoresPregunta"
                value={formData.ValoresPregunta}
                onChange={handleChange}
                placeholder="ej: 2+2, 3+3, 4+4"
                required
              />
            </div>
            <div className="form-group">
              <label>Resultados (en el mismo orden, separados por comas):</label>
              <input
                type="text"
                name="ValoresRespuesta"
                value={formData.ValoresRespuesta}
                onChange={handleChange}
                placeholder="ej: 4, 6, 8"
                required
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="info-message">
            Seleccione un tipo de minijuego para configurar sus campos específicos.
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="minijuego-form">
      {/* 1. Mensajes de estado (error/success) */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
  
      {/* 2. Campos básicos del formulario */}
      <div className="form-group">
        <label>Título*</label>
        <input
          type="text"
          name="Titulo"
          value={formData.Titulo}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="Descripcion"
          value={formData.Descripcion}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group">
        <label>Curso*</label>
        <input
          type="text"
          name="CursoMinijuego"
          value={formData.CursoMinijuego}
          onChange={handleChange}
          required
        />
      </div>

      {/* Selector de Estado */}
      <div className="form-group">
        <label>Estado*</label>
        <select
          name="EstadoId"
          value={formData.EstadoId}
          onChange={handleChange}
          required
        >
          {estadoOpciones.map(opcion => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>
  
      {/* 3. Selector de Tipo de Minijuego */}
      <div className="form-group">
        <label>Tipo de Minijuego*</label>
        <select
          name="TipoMinijuego"
          value={formData.TipoMinijuego}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un tipo</option>
          <option value="Frase">Frase incompleta</option>
          <option value="Conectar">Conectar conceptos</option>
        </select>
      </div>
  
      {/* 4. Campos dinámicos (renderizados por renderDynamicFields) */}
      {renderDynamicFields()}
  
      {/* 5. Campos numéricos en fila */}
      <div className="form-row">
        <div className="form-group">
          <label>Puntos base</label>
          <input
            type="number"
            name="PuntosBase"
            value={formData.PuntosBase}
            onChange={handleChange}
            min="0"
          />
        </div>
  
        <div className="form-group">
          <label>Penalidad por error</label>
          <input
            type="number"
            name="PenalidadPuntos"
            value={formData.PenalidadPuntos}
            onChange={handleChange}
            min="0"
          />
        </div>
  
        <div className="form-group">
          <label>Temático ID</label>
          <input
            type="number"
            name="TematicoId"
            value={formData.TematicoId}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>
  
      {/* 6. Campos ocultos */}
      <input type="hidden" name="UsuarioCreadorId" value={formData.UsuarioCreadorId} />
      <input type="hidden" name="EstadoId" value={formData.EstadoId} />
  
      {/* 7. Botón de envío */}
      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Guardando...
          </>
        ) : "Guardar Minijuego"}
      </button>
    </form>
  );
};

export default MinijuegoForm;