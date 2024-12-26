import React, { useEffect, useState } from "react";
import { getMinijuegosByUsuario, updateMinijuego, deleteMinijuego } from "../Services/apiService";
import EditMinijuegoModal from "./EditMinijuegoModal";

export const ESTADO_LABELS = {
  1: "Activo",
  2: "Inactivo",
  3: "En Progreso",
};

const MinijuegosTable = () => {
  const [minijuegos, setMinijuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMinijuego, setCurrentMinijuego] = useState(null);

  const usuarioId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (usuarioId) {
      fetchMinijuegos(usuarioId);
    }
  }, [usuarioId]);

  const fetchMinijuegos = async (usuarioId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMinijuegosByUsuario(usuarioId);
      if (data && Array.isArray(data.$values)) {
        setMinijuegos(data.$values);
      } else {
        throw new Error("Respuesta de API inválida");
      }
    } catch (error) {
      console.error("Error fetching minijuegos:", error);
      setError("Hubo un problema al cargar los minijuegos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (minijuego) => {
    setCurrentMinijuego(minijuego);
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedMinijuego) => {
    try {
      await updateMinijuego(updatedMinijuego.minijuegoId, updatedMinijuego);
      setMinijuegos((prev) =>
        prev.map((m) =>
          m.minijuegoId === updatedMinijuego.minijuegoId ? updatedMinijuego : m
        )
      );
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setError("No se pudo guardar los cambios.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este minijuego?")) {
      try {
        await deleteMinijuego(id);
        setMinijuegos((prev) =>
          prev.filter((minijuego) => minijuego.minijuegoId !== id)
        );
      } catch (error) {
        console.error("Error deleting minijuego:", error);
        setError("No se pudo eliminar el minijuego. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="minijuegos-table">
      {loading ? (
        <div className="spinner">
          <div className="loading-circle"></div>
          <p>Cargando datos...</p>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : minijuegos.length === 0 ? (
        <p>No hay minijuegos disponibles.</p>
      ) : (
        <table aria-label="Lista de Minijuegos">
          <caption>Lista de Minijuegos</caption>
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Descripción</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {minijuegos.map((minijuego) => (
              <tr key={minijuego.minijuegoId || `key-${minijuego.titulo}`}>
                <td>{minijuego.titulo}</td>
                <td>{minijuego.descripcion}</td>
                <td>{ESTADO_LABELS[minijuego.estadoId]}</td>
                <td>
                  <button onClick={() => handleEdit(minijuego)}>Editar</button>
                  <button onClick={() => handleDelete(minijuego.minijuegoId)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditMinijuegoModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        minijuego={currentMinijuego}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MinijuegosTable;
