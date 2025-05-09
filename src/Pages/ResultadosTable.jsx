import React, { useState, useEffect } from "react";
import { exportarResultados, obtenerResultados } from "../Services/apiService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from "recharts";

// Utils - Extraídos para evitar duplicación
const formatUtils = {
  tiempo: (segundos) => {
    if (!segundos && segundos !== 0) return "N/A";
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  },
  
  fecha: (fechaStr) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  },
  
  tipoMinijuego: (nombreMinijuego) => {
    if (!nombreMinijuego) return null;
    
    const tipos = {
      "Complete": "Completar",
      "Opposites": "Opuestos", 
      "Tense": "Tiempo Verbal",
      "Irregular Verbs": "Verbos Irregulares"
    };
    
    for (const [clave, valor] of Object.entries(tipos)) {
      if (nombreMinijuego.includes(clave)) return valor;
    }
    
    return null;
  }
};

// Componentes extraídos para mejorar legibilidad
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0 && payload[0].payload.tipo === 'dato') {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#2a1a4a', padding: '10px',
        border: '1px solid #ccc', borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', color: '#fff'
      }}>
        <p><strong>Estudiante:</strong> {data.nombre}</p>
        <p><strong>Curso:</strong> {data.curso}</p>
        <p><strong>Puntaje:</strong> {data.puntaje}</p>
        <p><strong>Tiempo:</strong> {data.tiempo}</p>
        <p><strong>Puntos Base:</strong> {data.puntosBase || 0}</p>
        <p><strong>Penalidad:</strong> {data.penalidadPuntos || 0}</p>
        <p><strong>Fecha:</strong> {data.fecha}</p>
      </div>
    );
  }
  return null;
};

const FiltrosDistribucion = ({ 
  minijuegoSeleccionado, setMinijuegoSeleccionado,
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  miniJuegosDisponibles
}) => (
  <div className="filtros-distribucion">
    <div className="filtro-grupo">
      <label>Seleccionar Minijuego (obligatorio):</label>
      <select 
        value={minijuegoSeleccionado}
        onChange={(e) => setMinijuegoSeleccionado(e.target.value)}
        required
      >
        <option value="">-- Seleccionar Minijuego --</option>
        {miniJuegosDisponibles.map((minijuego, index) => (
          <option key={`minijuego-${index}`} value={minijuego}>
            {minijuego}
          </option>
        ))}
      </select>
    </div>
    
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
  </div>
);

const EstadisticasMinijuego = ({ datos, minijuegoSeleccionado }) => {
  if (datos.length === 0) return null;
  
  const tiempos = datos.map(d => d.y);
  const puntajes = datos.map(d => d.x);
  
  const { media: mediaTiempo } = calcularMediaYDesviacion(tiempos);
  const { media: mediaPuntaje } = calcularMediaYDesviacion(puntajes);
  
  const minTiempo = Math.min(...tiempos);
  const maxTiempo = Math.max(...tiempos);
  const minPuntaje = Math.min(...puntajes);
  const maxPuntaje = Math.max(...puntajes);
  
  const statItems = [
    { label: "Total estudiantes", value: datos.length },
    { label: "Tiempo promedio", value: formatUtils.tiempo(mediaTiempo) },
    { label: "Tiempo mínimo", value: formatUtils.tiempo(minTiempo) },
    { label: "Tiempo máximo", value: formatUtils.tiempo(maxTiempo) },
    { label: "Puntaje promedio", value: mediaPuntaje.toFixed(1) },
    { label: "Puntaje mínimo", value: minPuntaje },
    { label: "Puntaje máximo", value: maxPuntaje }
  ];
  
  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <div key={`stat-${index}`} className="stat-item">
          <span className="stat-label">{item.label}:</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

// Función para cálculos estadísticos
const calcularMediaYDesviacion = (datos) => {
  if (!datos || datos.length === 0) return { media: 0, desviacionEstandar: 0 };
  
  const media = datos.reduce((sum, valor) => sum + valor, 0) / datos.length;
  const varianza = datos.reduce((sum, valor) => sum + Math.pow(valor - media, 2), 0) / datos.length;
  const desviacionEstandar = Math.sqrt(varianza);
  
  return { media, desviacionEstandar };
};

// Componente principal
const ResultadosTable = () => {
  // Estados para filtros y datos
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
  
  // Estados para distribución normal
  const [minijuegoSeleccionado, setMinijuegoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [miniJuegosDisponibles, setMiniJuegosDisponibles] = useState([]);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Obtener creador ID al cargar
  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        if (userData?.id) setCreadorId(userData.id);
      }
    } catch (err) {
      console.log("Usuario Creador No encontrado");
    }
  }, []);

  // Cargar resultados cuando tenemos el creadorId
  useEffect(() => {
    if (creadorId !== null) {
      cargarResultados();
    }
  }, [creadorId]);

  // Función para cargar resultados desde la API
  const cargarResultados = async () => {
    setLoading(true);
    try {
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      const data = await obtenerResultados(
        usuarioIdNum, minijuegoIdNum, curso || null, null, creadorId
      );
      
      let resultadosProcesados = [];
      
      // Procesar datos según formato recibido
      if (data?.$values) {
        resultadosProcesados = data.$values;
        
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
      
      // Extraer lista de minijuegos
      const uniqueMinijuegos = [...new Set(resultadosProcesados.map(item => 
        item.tituloMinijuego || item.minijuego || "Sin nombre"
      ))];
      
      setMiniJuegosDisponibles(uniqueMinijuegos);
      
    } catch (err) {
      setError("Error al cargar los resultados. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Exportar resultados
  const handleExport = async (tipoArchivo) => {
    try {
      const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;
      const minijuegoIdNum = minijuegoId ? parseInt(minijuegoId) : null;
      
      await exportarResultados(
        tipoArchivo, usuarioIdNum, minijuegoIdNum, curso || null, null, creadorId
      );
      setShowExportModal(false);
    } catch (error) {
      setError("Error al exportar los resultados. Por favor, intenta de nuevo.");
    }
  };

  // Renderizar fila de resultados
  const renderizarFila = (resultado, index) => (
    <tr key={`resultado-${resultado.$id || index}`}>
      <td>{resultado.nombreCompleto || "N/A"}</td>
      <td>{resultado.tituloMinijuego || "N/A"}</td>
      <td>{resultado.tipoMinijuego || formatUtils.tipoMinijuego(resultado.minijuego) || "N/A"}</td>
      <td>{resultado.curso || "N/A"}</td>
      <td>{resultado.puntaje || 0}</td>
      <td>{resultado.puntosBase || 0}</td>
      <td>{resultado.penalidadPuntos || 0}</td>
      <td>{resultado.tiempoFormateado || formatUtils.tiempo(resultado.tiempoSegundos)}</td>
      <td>{resultado.fecha || formatUtils.fecha(resultado.fechaResultado)}</td>
    </tr>
  );

  // Procesar datos para diferentes tipos de gráficos
  const procesarDatos = {
    // Datos para gráficos de barras y líneas
    graficos: () => {
      if (!resultados?.length) return [];
      
      const datosPorMinijuego = {};
      
      resultados.forEach(resultado => {
        const nombreMinijuego = resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";
        
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
      Object.values(datosPorMinijuego).forEach(item => {
        item.puntajePromedio = Math.round((item.puntajeTotal / item.intentos) * 10) / 10;
        item.tiempoPromedio = Math.round((item.tiempoTotal / item.intentos) * 10) / 10;
      });
      
      return Object.values(datosPorMinijuego);
    },
    
    // Datos para gráfico circular
    pie: () => {
      if (!resultados?.length) return [];
      
      const conteoMinijuegos = {};
      
      resultados.forEach(resultado => {
        const nombreMinijuego = resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";
        conteoMinijuegos[nombreMinijuego] = (conteoMinijuegos[nombreMinijuego] || 0) + 1;
      });
      
      return Object.keys(conteoMinijuegos).map(key => ({
        name: key,
        value: conteoMinijuegos[key]
      }));
    },
    
    // Datos para distribución normal
    distribucion: () => {
      if (!resultados?.length || !minijuegoSeleccionado) return [];
      
      // Filtrar por minijuego seleccionado
      let datosFiltrados = resultados.filter(resultado => 
        (resultado.tituloMinijuego || resultado.minijuego || "Sin nombre") === minijuegoSeleccionado
      );
      
      // Filtrar por fechas si están disponibles
      if (fechaInicio && fechaFin) {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setHours(23, 59, 59);
        
        datosFiltrados = datosFiltrados.filter(resultado => {
          const fechaResultado = new Date(resultado.fecha || resultado.fechaResultado);
          return fechaResultado >= fechaInicioObj && fechaResultado <= fechaFinObj;
        });
      }
      
      if (!datosFiltrados.length) return [];
      
      // Extraer puntajes y tiempos
      const tiempos = datosFiltrados.map(resultado => resultado.puntaje || 0);
      const puntajes = datosFiltrados.map(resultado => resultado.tiempoSegundos || 0);
      
      // Calcular estadísticas para curva normal
      const { media: mediaPuntaje, desviacionEstandar: desvPuntaje } = calcularMediaYDesviacion(puntajes);
      
      // Generar puntos para curva normal
      const puntosCurva = [];
      const rangoPuntajes = Math.max(...puntajes) - Math.min(...puntajes);
      const minPuntaje = Math.max(0, Math.min(...puntajes) - (rangoPuntajes * 0.1));
      const maxPuntaje = Math.max(...puntajes) + (rangoPuntajes * 0.1);
      const paso = rangoPuntajes / 30 || 1;
      
      const maxTiempo = Math.max(...tiempos);
      
      for (let x = minPuntaje; x <= maxPuntaje; x += paso) {
        const y = (1 / (desvPuntaje * Math.sqrt(2 * Math.PI))) * 
                  Math.exp(-Math.pow(x - mediaPuntaje, 2) / (2 * Math.pow(desvPuntaje, 2)));
        
        const escalado = y * (maxTiempo * 1.2);
        
        puntosCurva.push({ x, y: escalado, tipo: 'curva' });
      }
      
      // Agregar datos reales
      const datosReales = datosFiltrados.map(resultado => ({
        x: resultado.puntaje || 0,
        y: resultado.tiempoSegundos || 0,
        nombre: resultado.nombreCompleto || "N/A",
        curso: resultado.curso || "N/A",
        puntaje: resultado.puntaje || 0,
        tiempo: formatUtils.tiempo(resultado.tiempoSegundos),
        fecha: resultado.fecha || formatUtils.fecha(resultado.fechaResultado),
        tipo: 'dato',
        ...resultado
      }));
      
      return [...puntosCurva, ...datosReales];
    }
  };

  // Renderizar gráfico según tipo seleccionado
  const renderizarGrafico = () => {
    switch (tipoGrafico) {
      case "barras":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={procesarDatos.graficos()}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="nombre" 
                angle={-45} 
                textAnchor="end"
                height={80}
                stroke="#fff"
              />
              <YAxis 
                label={{ value: 'Puntaje', angle: -90, position: 'insideLeft', fill: '#fff' }}
                stroke="#fff"
              />
              <Tooltip />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Bar dataKey="puntajePromedio" name="Puntaje Promedio" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "lineas":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={procesarDatos.graficos()}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="nombre" 
                angle={-45} 
                textAnchor="end"
                height={80}
                stroke="#fff"
              />
              <YAxis 
                label={{ value: 'Tiempo (seg)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                stroke="#fff"
              />
              <Tooltip />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Line 
                type="monotone" 
                dataKey="tiempoPromedio" 
                name="Tiempo Promedio (seg)" 
                stroke="#00C49F" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={600}>
            <PieChart>
              <Pie
                data={procesarDatos.pie()}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {procesarDatos.pie().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} intentos`, "Cantidad"]} />
              <Legend wrapperStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "distribucion": {
        const datosDistribucion = procesarDatos.distribucion();
        const datosReales = datosDistribucion.filter(d => d.tipo === 'dato');
        
        return (
          <>
            <FiltrosDistribucion 
              minijuegoSeleccionado={minijuegoSeleccionado}
              setMinijuegoSeleccionado={setMinijuegoSeleccionado}
              fechaInicio={fechaInicio}
              setFechaInicio={setFechaInicio}
              fechaFin={fechaFin}
              setFechaFin={setFechaFin}
              miniJuegosDisponibles={miniJuegosDisponibles}
            />
            
            {!minijuegoSeleccionado ? (
              <div className="aviso-seleccion">
                <p>Por favor, selecciona un minijuego para visualizar la distribución.</p>
              </div>
            ) : datosDistribucion.length === 0 ? (
              <div className="no-datos">
                <p>No hay datos suficientes para generar la distribución con los filtros seleccionados.</p>
              </div>
            ) : (
              <div className="grafico-distribucion-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Puntaje" 
                      stroke="#fff"
                      label={{ value: 'Puntaje', position: 'insideBottom', offset: -5, fill: '#fff' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Tiempo (segundos)"
                      unit="s"
                      stroke="#fff"
                      label={{ value: 'Tiempo (segundos)', angle: -90, position: 'insideLeft', offset: 10, fill: '#fff' }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter
                      name="Curva Normal"
                      data={datosDistribucion.filter(d => d.tipo === 'curva')}
                      line={{ stroke: '#00C49F', strokeWidth: 2 }}
                      fill="#00C49F"
                    />
                    <Scatter
                      name="Datos individuales"
                      data={datosReales}
                      fill="#FF8042"
                      shape="diamond"
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: '12px', color: '#fff' }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                
                <div className="estadisticas-distribucion">
                  <h4>Estadísticas para {minijuegoSeleccionado}</h4>
                  <EstadisticasMinijuego 
                    datos={datosReales} 
                    minijuegoSeleccionado={minijuegoSeleccionado} 
                  />
                </div>
              </div>
            )}
          </>
        );
      }
      
      default:
        return null;
    }
  };

  // UI principal
  return (
    <div className="resultados-container">
      <h2>Resultados de Minijuegos</h2>
      
      {/* Filtros */}
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
        
        <button className="filtrar-btn" onClick={cargarResultados}>
          Aplicar Filtros
        </button>
        
        <button className="exportar-btn" onClick={() => setShowExportModal(true)}>
          Exportar Resultados
        </button>
        
        <button className="graficos-btn" onClick={() => setMostrarGraficos(!mostrarGraficos)}>
          {mostrarGraficos ? "Ocultar Gráficos" : "Mostrar Gráficos"}
        </button>
      </div>
      
      {/* Sección de gráficos */}
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
              <option value="distribucion">Distribución Normal (Puntaje vs Tiempo)</option>
            </select>
          </div>
          
          <div className="grafico-wrapper">
            {renderizarGrafico()}
          </div>
          
          {/* Tabla de estadísticas para algunos tipos de gráficos */}
          {(tipoGrafico === "barras" || tipoGrafico === "lineas") && (
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
                  {procesarDatos.graficos().map((item, index) => (
                    <tr key={`stat-${index}`}>
                      <td>{item.nombre}</td>
                      <td>{item.intentos}</td>
                      <td>{item.puntajePromedio.toFixed(1)}</td>
                      <td>{formatUtils.tiempo(item.tiempoPromedio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tabla de resultados principal */}
      {loading ? (
        <div className="loading">Cargando resultados...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : resultados.length === 0 ? (
        <div className="no-resultados">
          No se encontraron resultados con los filtros aplicados.
        </div>
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
              {resultados.map((resultado, index) =>
                renderizarFila(resultado, index)
              )}
            </tbody>
          </table>
        </div>
      )}

      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Exportar Resultados</h2>
            <p>
              Selecciona el formato para exportar los resultados con los filtros
              actuales:
            </p>

            <div className="modal-buttons">
              <button onClick={() => handleExport("pdf")}>Generar PDF</button>
              <button onClick={() => handleExport("excel")}>
                Generar Excel
              </button>
              <button onClick={() => setShowExportModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="resultados-stats">
        <p>
          Total de resultados: <strong>{resultados.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default ResultadosTable;
