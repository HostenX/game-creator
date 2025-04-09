import React, { useState } from "react";
import StudentRanking from "./StudentRanking";
import UpdateCredentialsModal from "./UpdateCredentialsModal";
import UnityGame from "./UnityGame";

const StudentDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showGame, setShowGame] = useState(false);

    const toggleGame = () => {
        setShowGame(!showGame);
    };

    const handleCloseGame = () => {
        setShowGame(false);
    };

    return (
        <div className="student-dashboard">
            <h2>Dashboard del Estudiante</h2>
            
            <div className="dashboard-controls">
                <button onClick={() => setIsModalOpen(true)}>Actualizar Credenciales</button>
                <button 
                    onClick={toggleGame} 
                    className={showGame ? "success" : ""}
                >
                    {showGame ? "Cerrar Juego" : "Jugar Ahora"}
                </button>
            </div>
            
            {/* Mostrar el juego cuando showGame es true */}
            <UnityGame show={showGame} onClose={handleCloseGame} />
            
            {/* Mostrar el ranking y contenido siempre */}
            <div className="dashboard-content" style={{ display: showGame ? "none" : "block" }}>
                <p>Contenido específico para estudiantes aquí...</p>
                <StudentRanking />
            </div>
            
            {/* Modal para actualizar credenciales */}
            <UpdateCredentialsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default StudentDashboard;