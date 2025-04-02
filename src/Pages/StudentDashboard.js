import React, { useState } from "react";
import StudentRanking from "./StudentRanking";
import UpdateCredentialsModal from "./UpdateCredentialsModal";

const StudentDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h2>Dashboard del Estudiante</h2>
            <p>Contenido específico para estudiantes aquí...</p>
            
            {/* Botón para abrir la ventana emergente */}
            <button onClick={() => setIsModalOpen(true)}>Actualizar Credenciales</button>
            
            {/* Componente del ranking */}
            <StudentRanking />
            
            {/* Modal para actualizar credenciales */}
            <UpdateCredentialsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default StudentDashboard;
