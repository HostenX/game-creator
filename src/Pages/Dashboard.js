import React, { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css'; 


const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div>Acceso denegado. Debes iniciar sesión.</div>;
    }

    // Renderiza contenido basado en el rol del usuario
    switch (user.rolId) {
        case 1:
            return <StudentDashboard />;
        case 2:
            return <TeacherDashboard />;
        case 3:
            return <AdminDashboard />;
        default:
            return <div>Rol desconocido.</div>;
    }
};

export default Dashboard;
