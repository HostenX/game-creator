import React, { useState } from "react";
import MinijuegosTable from "./MinijuegosTable";
import MinijuegoForm from "./MinijuegoForm";
import TematicoForm from "./TematicoForm";

const TeacherDashboard = () => {
  const [reload, setReload] = useState(false);
  const [view, setView] = useState("minijuegos"); // "minijuegos" o "tematicos"

  const handleSave = () => {
    setReload(!reload);
  };

  return (
    <div>
      <h1>Dashboard del Profesor</h1>
      <div>
        <button onClick={() => setView("minijuegos")}>Ver Minijuegos</button>
        <button onClick={() => setView("tematicos")}>Crear Temáticos</button>
      </div>
      {view === "minijuegos" ? (
        <>
          <MinijuegoForm onSave={handleSave} />
          <MinijuegosTable key={reload} />
        </>
      ) : (
        <TematicoForm onSave={handleSave} />
      )}
    </div>
  );
};

export default TeacherDashboard;
