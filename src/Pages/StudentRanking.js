import React, { useEffect, useState } from "react";
import { getStudentRanking } from "../Services/apiService"; // Importa la función de API
import "./StudentRanking.css"; // Importa los estilos

const StudentRanking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getStudentRanking();
            setRanking(Array.isArray(data) ? data : []);
    };
    fetchRanking();
  }, []);
  

  const getRankClass = (index) => {
    if (index === 0) return "gold"; // Oro
    if (index === 1) return "silver"; // Plata
    if (index === 2) return "bronze"; // Bronce
    return "default"; // Estilo normal para otros lugares
  };

  return (
    <div className="ranking-container">
      <h2>Student Ranking</h2>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Place</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((student, index) => (
            <tr key={student.usuarioId} className={getRankClass(index)}>
              <td>{index + 1}</td>
              <td>{student.nombreUsuario}</td>
              <td>{student.puntosTotales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRanking;
