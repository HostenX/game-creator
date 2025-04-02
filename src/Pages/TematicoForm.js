import React, { useState, useEffect } from 'react';
import { getDialogos, createTematico } from '../Services/apiService';

const TematicoForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    tituloTematico: '',
    descripcion: '',
    idDialogo: ''
  });
  const [dialogos, setDialogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadDialogos();
  }, []);

  const loadDialogos = async () => {
    try {
      setLoading(true);
      const data = await getDialogos();
      setDialogos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los consejos de NPC. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.idDialogo) {
      setError('Por favor selecciona un consejo de NPC');
      return;
    }

    try {
      await createTematico(formData);
      setFormData({
        tituloTematico: '',
        descripcion: '',
        idDialogo: ''
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onSave) onSave();
    } catch (err) {
      setError('Error al crear el temático. Por favor intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="tematico-form-container">
      <h2>Crear Nuevo Temático</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Temático creado correctamente</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tituloTematico">Título del Temático:</label>
          <input
            type="text"
            id="tituloTematico"
            name="tituloTematico"
            value={formData.tituloTematico}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="idDialogo">Consejo de NPC:</label>
          {loading ? (
            <p>Cargando consejos...</p>
          ) : (
            <select
              id="idDialogo"
              name="idDialogo"
              value={formData.idDialogo}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un consejo</option>
              {dialogos.map((dialogo) => (
                <option key={dialogo.idApoyo} value={dialogo.idApoyo}>
                  {dialogo.titulo}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <button type="submit" className="btn-primary">
          Crear Temático
        </button>
      </form>
    </div>
  );
};

export default TematicoForm;