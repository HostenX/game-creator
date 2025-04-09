import React, { useState, useEffect } from "react";
import { exportarResultados, obtenerResultados } from "../Services/apiService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from "recharts";

const ResultadosTable = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [curso, setCurso] = useState("");
  const [tipoMinijuego] = useState(""); // Mantenemos el estado pero ahora será seleccionado
  const [showExportModal, setShowExportModal] = useState(false);
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState("barras");

  const cargarResultados = async () => {
    setLoading(true);
    try {
      // Convertir usuarioId y minijuegoId a números si tienen valor
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      const data = await obtenerResultados(
        usuarioIdNum,
        minijuegoIdNum,
        curso || null
      );
      
      let resultadosProcesados = [];
      
      // Procesamos el nuevo formato de datos que has proporcionado
      if (data && data.$values) {
        resultadosProcesados = data.$values;
        
        // Aplicamos filtros adicionales
        if (curso && curso.trim() !== "") {
          resultadosProcesados = resultadosProcesados.filter(item => 
            item.curso?.toLowerCase().includes(curso.toLowerCase())
          );
        }
        
        if (tipoMinijuego && tipoMinijuego.trim() !== "" && tipoMinijuego !== "null") {
          resultadosProcesados = resultadosProcesados.filter(item => 
            item.minijuego?.toLowerCase().includes(tipoMinijuego.toLowerCase())
          );
        }
      } 
      // Si los datos vienen en otro formato, mantener la lógica original
      else if (Array.isArray(data)) {
        resultadosProcesados = data;
        
        if (tipoMinijuego && tipoMinijuego.trim() !== "" && tipoMinijuego !== "null") {
          resultadosProcesados = resultadosProcesados.filter(item => {
            return item.ResultadoOriginal?.Minijuego?.tipoMinijuego?.toLowerCase().includes(tipoMinijuego.toLowerCase()) ||
                   item.tipoMinijuego?.toLowerCase().includes(tipoMinijuego.toLowerCase()) ||
                   item.minijuego?.toLowerCase().includes(tipoMinijuego.toLowerCase());
          });
        }
      }
      
      setResultados(resultadosProcesados);
    } catch (err) {
      console.error("Error al cargar resultados:", err);
      setError("Error al cargar los resultados. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    cargarResultados();
  }, []);

  const handleExport = async (tipoArchivo) => {
    try {
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      await exportarResultados(
        tipoArchivo, 
        usuarioIdNum, 
        minijuegoIdNum, 
        curso || null
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Error al exportar:", error);
      setError("Error al exportar los resultados. Por favor, intenta de nuevo.");
    }
  };

  // Renderiza los datos según el formato de respuesta proporcionado
  const renderizarFila = (resultado, index) => {
    return (
      <tr key={`resultado-${resultado.$id || index}`}>
        <td>{resultado.nombreCompleto || "N/A"}</td>
        <td>{resultado.tituloMinijuego || "N/A"}</td>
        <td>{resultado.tipoMinijuego || extraerTipoMinijuego(resultado.minijuego) || "N/A"}</td>
        <td>{resultado.curso || "N/A"}</td>
        <td>{resultado.puntaje || 0}</td>
        <td>{resultado.puntosBase || 0}</td>
        <td>{resultado.penalidadPuntos || 0}</td>
        <td>{resultado.tiempoFormateado || formatearTiempo(resultado.tiempoSegundos)}</td>
        <td>{resultado.fecha || formatearFecha(resultado.fechaResultado)}</td>
      </tr>
    );
  };

  // Función para intentar extraer el tipo de minijuego del nombre
  const extraerTipoMinijuego = (nombreMinijuego) => {
    if (!nombreMinijuego) return null;
    
    if (nombreMinijuego.includes("Complete")) return "Completar";
    if (nombreMinijuego.includes("Opposites")) return "Opuestos";
    if (nombreMinijuego.includes("Tense")) return "Tiempo Verbal";
    if (nombreMinijuego.includes("Irregular Verbs")) return "Verbos Irregulares";
    
    return null;
  };

  const formatearTiempo = (segundos) => {
    if (!segundos && segundos !== 0) return "N/A";
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Preparar datos para gráficos
  const prepararDatosGraficos = () => {
    if (!resultados || resultados.length === 0) return [];

    // Datos para gráfico de barras/líneas (puntaje por minijuego)
    const datosPorMinijuego = {};
    
    resultados.forEach(resultado => {
      const nombreMinijuego = resultado.tituloMinijuego || resultado.minijuego || "Sin nombre"
      
      if (!datosPorMinijuego[nombreMinijuego]) {
        datosPorMinijuego[nombreMinijuego] = {
          nombre: nombreMinijuego,
          puntajePromedio: 0,
          tiempoPromedio: 0,
          intentos: 0,
          puntajeTotal: 0,
          tiempoTotal: 0
        };
      }
      
      datosPorMinijuego[nombreMinijuego].intentos += 1;
      datosPorMinijuego[nombreMinijuego].puntajeTotal += resultado.puntaje || 0;
      datosPorMinijuego[nombreMinijuego].tiempoTotal += resultado.tiempoSegundos || 0;
    });
    
    // Calcular promedios
    Object.keys(datosPorMinijuego).forEach(key => {
      const item = datosPorMinijuego[key];
      item.puntajePromedio = Math.round((item.puntajeTotal / item.intentos) * 10) / 10;
      item.tiempoPromedio = Math.round((item.tiempoTotal / item.intentos) * 10) / 10;
    });
    
    return Object.values(datosPorMinijuego);
  };

  // Datos para gráfico de distribución de intentos por minijuego (pie)
  const prepararDatosPie = () => {
    if (!resultados || resultados.length === 0) return [];
    
    const conteoMinijuegos = {};
    
    resultados.forEach(resultado => {
      const nombreMinijuego = resultado.tituloMinijuego || resultado.minijuego || "Sin nombre"
      conteoMinijuegos[nombreMinijuego] = (conteoMinijuegos[nombreMinijuego] || 0) + 1;
    });
    
    return Object.keys(conteoMinijuegos).map(key => ({
      name: key,
      value: conteoMinijuegos[key]
    }));
  };

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="resultados-container">
      <h2>Resultados de Minijuegos</h2>
      
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>ID de Usuario:</label>
          <input
            type="text"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            placeholder="Filtrar por ID de usuario"
          />
        </div>
        
        <div className="filtro-grupo">
          <label>ID de Minijuego:</label>
          <input
            type="text"
            value={minijuegoId}
            onChange={(e) => setMinijuegoId(e.target.value)}
            placeholder="Filtrar por ID de minijuego"
          />
        </div>
        
        <div className="filtro-grupo">
          <label>Curso:</label>
          <input
            type="text"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            placeholder="Filtrar por curso"
          />
        </div>
        
        <button 
          className="filtrar-btn"
          onClick={cargarResultados}
        >
          Aplicar Filtros
        </button>
        
        <button 
          className="exportar-btn"
          onClick={() => setShowExportModal(true)}
        >
          Exportar Resultados
        </button>
        
        <button 
          className="graficos-btn"
          onClick={() => setMostrarGraficos(!mostrarGraficos)}
        >
          {mostrarGraficos ? "Ocultar Gráficos" : "Mostrar Gráficos"}
        </button>
      </div>
      
      {mostrarGraficos && resultados.length > 0 && (
        <div className="graficos-container">
          <div className="selector-grafico">
            <label>Tipo de Gráfico:</label>
            <select 
              value={tipoGrafico} 
              onChange={(e) => setTipoGrafico(e.target.value)}
            >
              <option value="barras">Puntaje Promedio por Minijuego</option>
              <option value="lineas">Tiempo Promedio por Minijuego</option>
              <option value="pie">Distribución de Intentos</option>
            </select>
          </div>
          
          <div className="grafico-wrapper">
            {tipoGrafico === "barras" && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={prepararDatosGraficos()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nombre" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis label={{ value: 'Puntaje', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="puntajePromedio" name="Puntaje Promedio" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {tipoGrafico === "lineas" && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={prepararDatosGraficos()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nombre" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis label={{ value: 'Tiempo (seg)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tiempoPromedio" 
                    name="Tiempo Promedio (seg)" 
                    stroke="#00C49F" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {tipoGrafico === "pie" && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepararDatosPie()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepararDatosPie().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} intentos`, "Cantidad"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {tipoGrafico !== "pie" && (
            <div className="estadisticas-resumen">
              <h3>Estadísticas por Minijuego</h3>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Minijuego</th>
                    <th>Intentos</th>
                    <th>Puntaje Promedio</th>
                    <th>Tiempo Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {prepararDatosGraficos().map((item, index) => (
                    <tr key={`stat-${index}`}>
                      <td>{item.nombre}</td>
                      <td>{item.intentos}</td>
                      <td>{item.puntajePromedio.toFixed(1)}</td>
                      <td>{formatearTiempo(item.tiempoPromedio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="loading">Cargando resultados...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : resultados.length === 0 ? (
        <div className="no-resultados">No se encontraron resultados con los filtros aplicados.</div>
      ) : (
        <div className="tabla-container">
          <table className="resultados-tabla">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Minijuego</th>
                <th>Tipo</th>
                <th>Curso</th>
                <th>Puntaje</th>
                <th>Puntos Base</th>
                <th>Penalidad</th>
                <th>Tiempo (mm:ss)</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => renderizarFila(resultado, index))}
            </tbody>
          </table>
        </div>
      )}
      
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Exportar Resultados</h2>
            <p>Selecciona el formato para exportar los resultados con los filtros actuales:</p>
            
            <div className="modal-buttons">
              <button onClick={() => handleExport("pdf")}>Generar PDF</button>
              <button onClick={() => handleExport("excel")}>Generar Excel</button>
              <button onClick={() => setShowExportModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="resultados-stats">
        <p>Total de resultados: <strong>{resultados.length}</strong></p>
      </div>
    </div>
  );
};

export default ResultadosTable;