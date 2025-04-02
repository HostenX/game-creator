import React, { useState, useEffect } from "react";
import { ESTADO_LABELS } from "./MinijuegosTable";

const EditMinijuegoModal = ({ isOpen, onClose, minijuego, onSave }) => {
  // Estados adicionales para control de errores y carga
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatear las opciones de estado para el selector
  const estadoOpciones = Object.entries(ESTADO_LABELS).map(([valor, etiqueta]) => ({
    valor: parseInt(valor),
    etiqueta
  }));

  // Estado del formulario con valores iniciales
  const [formData, setFormData] = useState({
    minijuegoId: 0,
    Titulo: "",
    Descripcion: "",
    EstadoId: 3, // Valor por defecto: "En revisión"
    TematicoId: 0,
    TipoMinijuego: "",
    PuntosBase: 0,
    PenalidadPuntos: 0,
    ValoresPregunta: "",
    ValoresRespuesta: "",
    RespuestaCorrecta: "",
    CursoMinijuego: ""
  });

  // Actualizar el formulario cuando se recibe un minijuego para editar
  useEffect(() => {
    if (minijuego) {
      console.log("Recibiendo datos en el modal:", minijuego);
      
      // Normalizar nombres de propiedades (primera letra mayúscula vs minúscula)
      const normalizedData = {
        minijuegoId: minijuego.minijuegoId,
        Titulo: minijuego.Titulo || minijuego.titulo || "",
        Descripcion: minijuego.Descripcion || minijuego.descripcion || "",
        EstadoId: parseInt(minijuego.EstadoId || minijuego.estadoId) || 3,
        TematicoId: parseInt(minijuego.TematicoId || minijuego.tematicoId) || 0,
        TipoMinijuego: minijuego.TipoMinijuego || minijuego.tipoMinijuego || "",
        PuntosBase: parseInt(minijuego.PuntosBase || minijuego.puntosBase) || 0,
        PenalidadPuntos: parseInt(minijuego.PenalidadPuntos || minijuego.penalidadPuntos) || 0,
        ValoresPregunta: minijuego.ValoresPregunta || minijuego.valoresPregunta || "",
        ValoresRespuesta: minijuego.ValoresRespuesta || minijuego.valoresRespuesta || "",
        RespuestaCorrecta: minijuego.RespuestaCorrecta || minijuego.respuestaCorrecta || "",
        CursoMinijuego: minijuego.CursoMinijuego || minijuego.cursoMinijuego || ""
      };
      
      console.log("Datos normalizados:", normalizedData);
      setFormData(normalizedData);
    }
  }, [minijuego]);

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
      case "Balanza":
        if (!formData.ValoresRespuesta) {
          setError("Debe proporcionar los valores de respuesta para minijuegos de Balanza");
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
      // Asegurar que todos los datos necesarios están incluidos
      const dataToSave = {
        ...formData,
        minijuegoId: minijuego.minijuegoId
      };
      
      console.log("Enviando datos para guardar:", dataToSave);
      
      // Usar el onSave proporcionado por el componente padre
      const result = await onSave(dataToSave);
      
      if (result && result.success) {
        setSuccess("Minijuego actualizado exitosamente!");
        // Cerrar modal después de un breve retraso para que el usuario vea el mensaje
        setTimeout(() => onClose(), 1500);
      } else {
        setError((result && result.message) || "Error al actualizar el minijuego");
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
      case "Ecuacion":
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label>Valores de la pregunta:</label>
              <input 
                type="text" 
                name="ValoresPregunta" 
                value={formData.ValoresPregunta} 
                onChange={handleChange}
                placeholder="Ingrese los valores de la ecuación"
                required 
              />
            </div>
            <div className="form-group">
              <label>Valores de respuesta:</label>
              <input 
                type="text" 
                name="ValoresRespuesta" 
                value={formData.ValoresRespuesta} 
                onChange={handleChange}
                placeholder="Ingrese las posibles respuestas"
                required 
              />
            </div>
          </div>
        );
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
      case "Balanza":
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label>Valores de respuesta:</label>
              <input 
                type="text" 
                name="ValoresRespuesta" 
                value={formData.ValoresRespuesta} 
                onChange={handleChange}
                placeholder="Ingrese los valores para la balanza"
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

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Minijuego</h2>
        
        {/* Mensajes de error/éxito */}
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="minijuego-form">
          {/* Campo oculto para el ID */}
          <input 
            type="hidden" 
            name="minijuegoId" 
            value={formData.minijuegoId} 
          />
          
          {/* Campos básicos del formulario */}
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
          
          {/* Campo de Curso */}
          <div className="form-group">
            <label>Curso</label>
            <input
              type="text"
              name="CursoMinijuego"
              value={formData.CursoMinijuego || ""}
              onChange={handleChange}
            />
          </div>
          
          {/* Selector de Tipo de Minijuego */}
          <div className="form-group">
            <label>Tipo de Minijuego*</label>
            <select
              name="TipoMinijuego"
              value={formData.TipoMinijuego}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="Ecuacion">Ecuación</option>
              <option value="Frase">Frase incompleta</option>
              <option value="Balanza">Balanza</option>
              <option value="Conectar">Conectar conceptos</option>
            </select>
          </div>
          
          {/* Campos dinámicos según el tipo de minijuego */}
          {renderDynamicFields()}
          
          {/* Campos numéricos en fila */}
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
          
          <div className="modal-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : "Guardar Cambios"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMinijuegoModal;