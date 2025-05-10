import React, { useState, useEffect } from "react";
import { exportarResultados, obtenerResultados } from "../Services/apiService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

const ResultadosTable = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [usuarioId, setUsuarioId] = useState("");
  const [minijuegoId, setMinijuegoId] = useState("");
  const [curso, setCurso] = useState("");
  const [tipoMinijuego] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState("barras");
  const [creadorId, setCreadorId] = useState(null);
  
  // Nuevo: Filtro de rango de fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    // Obtener el ID del creador desde localStorage al cargar el componente
    try {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        if (userData && userData.id) {
          setCreadorId(userData.id);
        }
      }
    } catch (err) {
     console.log("Usuario Creador No encontrado");
    }
  }, []);

  const cargarResultados = async () => {
    setLoading(true);
    try {
      // Convertir usuarioId y minijuegoId a números si tienen valor
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      const data = await obtenerResultados(
        usuarioIdNum,
        minijuegoIdNum,
        curso || null,
        null, // tipoMinijuego (ya no se usa en la llamada API)
        creadorId // Pasar el ID del creador obtenido del localStorage
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
        
        // Filtrar por rango de fechas
        if (fechaInicio && fechaInicio.trim() !== "") {
          const inicio = new Date(fechaInicio);
          // Ajustar a inicio del día (00:00:00)
          inicio.setHours(0, 0, 0, 0);
          
          resultadosProcesados = resultadosProcesados.filter(item => {
            if (!item.fecha && !item.fechaResultado) return false;
            const fecha = new Date(item.fecha || item.fechaResultado);
            return fecha >= inicio;
          });
        }
        
        if (fechaFin && fechaFin.trim() !== "") {
          const fin = new Date(fechaFin);
          // Ajustar a final del día (23:59:59)
          fin.setHours(23, 59, 59, 999);
          
          resultadosProcesados = resultadosProcesados.filter(item => {
            if (!item.fecha && !item.fechaResultado) return false;
            const fecha = new Date(item.fecha || item.fechaResultado);
            return fecha <= fin;
          });
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
        
        // Filtrar por rango de fechas
        if (fechaInicio && fechaInicio.trim() !== "") {
          const inicio = new Date(fechaInicio);
          inicio.setHours(0, 0, 0, 0);
          
          resultadosProcesados = resultadosProcesados.filter(item => {
            if (!item.fecha && !item.fechaResultado) return false;
            const fecha = new Date(item.fecha || item.fechaResultado);
            return fecha >= inicio;
          });
        }
        
        if (fechaFin && fechaFin.trim() !== "") {
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59, 999);
          
          resultadosProcesados = resultadosProcesados.filter(item => {
            if (!item.fecha && !item.fechaResultado) return false;
            const fecha = new Date(item.fecha || item.fechaResultado);
            return fecha <= fin;
          });
        }
      }
      
      setResultados(resultadosProcesados);
    } catch (err) {
      setError("Error al cargar los resultados. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (creadorId !== null) {
      cargarResultados();
    }
  }, [creadorId]); // Cargar resultados cuando se obtenga el creadorId

  const handleExport = async (tipoArchivo) => {
    try {
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      await exportarResultados(
        tipoArchivo, 
        usuarioIdNum, 
        minijuegoIdNum, 
        curso || null,
        null, // tipoMinijuego
        creadorId, // Pasar el ID del creador
        fechaInicio || null,
        fechaFin || null
      );
      setShowExportModal(false);
    } catch (error) {
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

  // Nuevo: Preparar datos para la campana de Gauss (distribución normal)
  const prepararDatosCampanaGauss = () => {
    if (!resultados || resultados.length === 0) return [];
    
    // Obtener todos los tiempos en segundos
    const tiempos = resultados
      .map(resultado => resultado.tiempoSegundos)
      .filter(tiempo => tiempo !== undefined && tiempo !== null);
    
    if (tiempos.length === 0) return [];
    
    // Calcular estadísticas básicas
    const media = tiempos.reduce((acc, tiempo) => acc + tiempo, 0) / tiempos.length;
    const varianza = tiempos.reduce((acc, tiempo) => acc + Math.pow(tiempo - media, 2), 0) / tiempos.length;
    const desviacionEstandar = Math.sqrt(varianza);
    
    // Encontrar el valor mínimo y máximo para establecer el rango
    const min = Math.min(...tiempos);
    const max = Math.max(...tiempos);
    
    // Crear intervalos para el histograma (distribución real)
    const numIntervalos = 10;
    const amplitudIntervalo = (max - min) / numIntervalos;
    const histograma = Array(numIntervalos).fill(0);
    
    // Contar valores en cada intervalo
    tiempos.forEach(tiempo => {
      const indice = Math.min(
        Math.floor((tiempo - min) / amplitudIntervalo),
        numIntervalos - 1
      );
      histograma[indice]++;
    });
    
    // Normalizar el histograma para que se pueda visualizar mejor
    const maxFrecuencia = Math.max(...histograma);
    const histogramaNormalizado = histograma.map(frecuencia => 
      (frecuencia / maxFrecuencia) * 100
    );
    
    // Función de densidad normal
    const densidadNormal = (x, media, desviacion) => {
      return (1 / (desviacion * Math.sqrt(2 * Math.PI))) * 
             Math.exp(-0.5 * Math.pow((x - media) / desviacion, 2));
    };
    
    // Crear puntos para la curva de distribución normal
    const puntosCurva = [];
    const paso = (max - min) / 50; // 50 puntos para la curva
    
    // Factor de escala para que la curva se ajuste a la altura del histograma
    const factorEscala = 100 / densidadNormal(media, media, desviacionEstandar);
    
    for (let x = min; x <= max; x += paso) {
      const y = densidadNormal(x, media, desviacionEstandar) * factorEscala;
      puntosCurva.push({
        tiempo: x,
        frecuenciaReal: 0, // Se rellenará después con los datos del histograma
        curvaGauss: y
      });
    }
    
    // Integrar los datos del histograma en los puntos de la curva
    for (let i = 0; i < numIntervalos; i++) {
      const intervaloInicio = min + (i * amplitudIntervalo);
      const intervaloFin = intervaloInicio + amplitudIntervalo;
      const valorIntervalo = histogramaNormalizado[i];
      
      // Asignar el valor del histograma a los puntos que caen en ese intervalo
      puntosCurva.forEach(punto => {
        if (punto.tiempo >= intervaloInicio && punto.tiempo < intervaloFin) {
          punto.frecuenciaReal = valorIntervalo;
        }
      });
    }
    
    return {
      puntosCurva,
      estadisticas: {
        media,
        desviacionEstandar,
        min,
        max,
        totalMuestras: tiempos.length
      }
    };
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
        
        {/* Nuevo: Filtro por rango de fechas */}
        <div className="filtro-grupo">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        
        <div className="filtro-grupo">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
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
              <option value="gauss">Distribución Normal de Tiempos</option>
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
            
            {/* Nuevo: Gráfico de campana de Gauss (distribución normal) */}
            {tipoGrafico === "gauss" && (
              <div className="gauss-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={prepararDatosCampanaGauss().puntosCurva}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="tiempo" 
                      label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5 }}
                      tickFormatter={(value) => Math.round(value)}
                    />
                    <YAxis label={{ value: 'Frecuencia (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === "frecuenciaReal") return [`${value.toFixed(2)}%`, "Frecuencia real"];
                      if (name === "curvaGauss") return [`${value.toFixed(2)}%`, "Curva normal"];
                      return [value, name];
                    }} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="frecuenciaReal" 
                      name="Distribución Real" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                      stroke="#8884d8" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="curvaGauss" 
                      name="Distribución Normal" 
                      stroke="#ff7300" 
                      dot={false}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* Estadísticas de la distribución */}
                <div className="estadisticas-gauss">
                  <h3>Estadísticas de la Distribución</h3>
                  <div className="stats-container">
                    <div className="stat-item">
                      <span className="stat-label">Media:</span>
                      <span className="stat-value">
                        {formatearTiempo(prepararDatosCampanaGauss().estadisticas.media)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Desviación estándar:</span>
                      <span className="stat-value">
                        {formatearTiempo(prepararDatosCampanaGauss().estadisticas.desviacionEstandar)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiempo mínimo:</span>
                      <span className="stat-value">
                        {formatearTiempo(prepararDatosCampanaGauss().estadisticas.min)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiempo máximo:</span>
                      <span className="stat-value">
                        {formatearTiempo(prepararDatosCampanaGauss().estadisticas.max)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total muestras:</span>
                      <span className="stat-value">
                        {prepararDatosCampanaGauss().estadisticas.totalMuestras}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {(tipoGrafico !== "pie" && tipoGrafico !== "gauss") && (
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
      
      {/* Estilos adicionales para las nuevas características */}
      <style jsx>{`
        .filtros-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .filtro-grupo {
          display: flex;
          flex-direction: column;
        }
        
        .filtro-grupo label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        input[type="date"] {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .gauss-container {
          width: 100%;
        }
        
        .estadisticas-gauss {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stats-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 10px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }
        
        .stat-label {
          font-weight: bold;
          font-size: 0.9rem;
          color: #555;
        }
        
        .stat-value {
          font-size: 1.1rem;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ResultadosTable;