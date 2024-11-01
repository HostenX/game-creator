// src/pages/Dashboard.js

import React, { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Manejar el caso donde no hay usuario autenticado
        return <div>Acceso denegado. Debes iniciar sesión.</div>;
    }

    // Renderiza contenido basado en el rol del usuario
    switch (user.rol_id) {
        case 1:
            return <div>Bienvenido, Estudiante!</div>;
        case 2:
            return <div>Bienvenido, Docente!</div>;
        case 3:
            return <div>Bienvenido, Administrador!</div>;
        default:
            return <div>Rol desconocido.</div>;
    }
};

export default Dashboard;
