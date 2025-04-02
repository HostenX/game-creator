import React, { useState, useEffect } from 'react';
import { getDialogos, createDialogo, updateDialogo, deleteDialogo } from '../Services/apiService';

const DialogosManager = ({ onSave }) => {
  const [dialogos, setDialogos] = useState([]);
  const [currentDialogo, setCurrentDialogo] = useState({ titulo: '', descripcion: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Error al cargar los diálogos. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDialogo({ ...currentDialogo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateDialogo(editId, currentDialogo);
      } else {
        await createDialogo(currentDialogo);
      }
      setCurrentDialogo({ titulo: '', descripcion: '' });
      setEditMode(false);
      setEditId(null);
      loadDialogos();
      if (onSave) onSave();
    } catch (err) {
      setError('Error al guardar el diálogo. Por favor intenta de nuevo.');
      console.error(err);
    }
  };

  const handleEdit = (dialogo) => {
    setCurrentDialogo({
      titulo: dialogo.titulo,
      descripcion: dialogo.descripcionLinks
    });
    setEditMode(true);
    setEditId(dialogo.idApoyo); // Usar idApoyo en lugar de id
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este diálogo?')) {
      try {
        await deleteDialogo(id);
        loadDialogos();
        if (onSave) onSave();
      } catch (err) {
        setError('Error al eliminar el diálogo. Por favor intenta de nuevo.');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setCurrentDialogo({ titulo: '', descripcion: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="dialogos-container">
      <h2>Consejos de NPC</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="dialogo-form">
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={currentDialogo.titulo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={currentDialogo.descripcion}
            onChange={handleInputChange}
            required
            rows="4"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editMode ? 'Actualizar Consejo' : 'Agregar Consejo'}
          </button>
          {editMode && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="dialogos-list">
        <h3>Lista de Consejos</h3>
        {loading ? (
          <p>Cargando consejos...</p>
        ) : dialogos.length === 0 ? (
          <p>No hay consejos disponibles</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dialogos.map((dialogo) => (
                <tr key={dialogo.idApoyo}>
                  <td>{dialogo.idApoyo}</td>
                  <td>{dialogo.titulo}</td>
                  <td>{dialogo.descripcionLinks}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(dialogo)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(dialogo.idApoyo)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DialogosManager;