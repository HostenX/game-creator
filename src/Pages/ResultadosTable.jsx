import React, { useState, useEffect } from "react";
import { exportarResultados, obtenerResultados } from "../Services/apiService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// Utils - Extraídos para evitar duplicación
const formatUtils = {
  tiempo: (segundos) => {
    if (!segundos && segundos !== 0) return "N/A";
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs
      .toString()
      .padStart(2, "0")}`;
  },

  fecha: (fechaStr) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  tipoMinijuego: (nombreMinijuego) => {
    if (!nombreMinijuego) return null;

    const tipos = {
      Complete: "Completar",
      Opposites: "Opuestos",
      Tense: "Tiempo Verbal",
      "Irregular Verbs": "Verbos Irregulares",
    };

    for (const [clave, valor] of Object.entries(tipos)) {
      if (nombreMinijuego.includes(clave)) return valor;
    }

    return null;
  },
};

// Componentes extraídos para mejorar legibilidad
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0 && payload[0].payload.tipo === "dato") {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#2a1a4a",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      >
        <p>
          <strong>Estudiante:</strong> {data.nombre}
        </p>
        <p>
          <strong>Curso:</strong> {data.curso}
        </p>
        <p>
          <strong>Puntaje:</strong> {data.puntaje}
        </p>
        <p>
          <strong>Tiempo:</strong> {data.tiempo}
        </p>
        <p>
          <strong>Puntos Base:</strong> {data.puntosBase || 0}
        </p>
        <p>
          <strong>Penalidad:</strong> {data.penalidadPuntos || 0}
        </p>
        <p>
          <strong>Fecha:</strong> {data.fecha}
        </p>
      </div>
    );
  }
  return null;
};

const FiltrosDistribucion = ({
  minijuegoSeleccionado,
  setMinijuegoSeleccionado,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  miniJuegosDisponibles,
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

  const tiempos = datos.map((d) => d.y);
  const puntajes = datos.map((d) => d.x);

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
    { label: "Puntaje máximo", value: maxPuntaje },
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
  const varianza =
    datos.reduce((sum, valor) => sum + Math.pow(valor - media, 2), 0) /
    datos.length;
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
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

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
        usuarioIdNum,
        minijuegoIdNum,
        curso || null,
        null,
        creadorId
      );

      let resultadosProcesados = [];

      // Procesar datos según formato recibido
      if (data?.$values) {
        resultadosProcesados = data.$values;

        if (curso && curso.trim() !== "") {
          resultadosProcesados = resultadosProcesados.filter((item) =>
            item.curso?.toLowerCase().includes(curso.toLowerCase())
          );
        }

        if (
          tipoMinijuego &&
          tipoMinijuego.trim() !== "" &&
          tipoMinijuego !== "null"
        ) {
          resultadosProcesados = resultadosProcesados.filter((item) =>
            item.minijuego?.toLowerCase().includes(tipoMinijuego.toLowerCase())
          );
        }
      } else if (Array.isArray(data)) {
        resultadosProcesados = data;

        if (
          tipoMinijuego &&
          tipoMinijuego.trim() !== "" &&
          tipoMinijuego !== "null"
        ) {
          resultadosProcesados = resultadosProcesados.filter((item) => {
            return (
              item.ResultadoOriginal?.Minijuego?.tipoMinijuego
                ?.toLowerCase()
                .includes(tipoMinijuego.toLowerCase()) ||
              item.tipoMinijuego
                ?.toLowerCase()
                .includes(tipoMinijuego.toLowerCase()) ||
              item.minijuego
                ?.toLowerCase()
                .includes(tipoMinijuego.toLowerCase())
            );
          });
        }
      }

      setResultados(resultadosProcesados);

      // Extraer lista de minijuegos
      const uniqueMinijuegos = [
        ...new Set(
          resultadosProcesados.map(
            (item) => item.tituloMinijuego || item.minijuego || "Sin nombre"
          )
        ),
      ];

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
        tipoArchivo,
        usuarioIdNum,
        minijuegoIdNum,
        curso || null,
        null,
        creadorId
      );
      setShowExportModal(false);
    } catch (error) {
      setError(
        "Error al exportar los resultados. Por favor, intenta de nuevo."
      );
    }
  };

  // Renderizar fila de resultados
  const renderizarFila = (resultado, index) => (
    <tr key={`resultado-${resultado.$id || index}`}>
      <td>{resultado.nombreCompleto || "N/A"}</td>
      <td>{resultado.tituloMinijuego || "N/A"}</td>
      <td>
        {resultado.tipoMinijuego ||
          formatUtils.tipoMinijuego(resultado.minijuego) ||
          "N/A"}
      </td>
      <td>{resultado.curso || "N/A"}</td>
      <td>{resultado.puntaje || 0}</td>
      <td>{resultado.puntosBase || 0}</td>
      <td>{resultado.penalidadPuntos || 0}</td>
      <td>
        {resultado.tiempoFormateado ||
          formatUtils.tiempo(resultado.tiempoSegundos)}
      </td>
      <td>{resultado.fecha || formatUtils.fecha(resultado.fechaResultado)}</td>
    </tr>
  );

  // Procesar datos para diferentes tipos de gráficos
  const procesarDatos = {
    // Datos para gráficos de barras y líneas
    graficos: () => {
      if (!resultados?.length) return [];

      const datosPorMinijuego = {};

      resultados.forEach((resultado) => {
        const nombreMinijuego =
          resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";

        if (!datosPorMinijuego[nombreMinijuego]) {
          datosPorMinijuego[nombreMinijuego] = {
            nombre: nombreMinijuego,
            puntajePromedio: 0,
            tiempoPromedio: 0,
            intentos: 0,
            puntajeTotal: 0,
            tiempoTotal: 0,
          };
        }

        datosPorMinijuego[nombreMinijuego].intentos += 1;
        datosPorMinijuego[nombreMinijuego].puntajeTotal +=
          resultado.puntaje || 0;
        datosPorMinijuego[nombreMinijuego].tiempoTotal +=
          resultado.tiempoSegundos || 0;
      });

      // Calcular promedios
      Object.values(datosPorMinijuego).forEach((item) => {
        item.puntajePromedio =
          Math.round((item.puntajeTotal / item.intentos) * 10) / 10;
        item.tiempoPromedio =
          Math.round((item.tiempoTotal / item.intentos) * 10) / 10;
      });

      return Object.values(datosPorMinijuego);
    },

    // Datos para gráfico circular
    pie: () => {
      if (!resultados?.length) return [];

      const conteoMinijuegos = {};

      resultados.forEach((resultado) => {
        const nombreMinijuego =
          resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";
        conteoMinijuegos[nombreMinijuego] =
          (conteoMinijuegos[nombreMinijuego] || 0) + 1;
      });

      return Object.keys(conteoMinijuegos).map((key) => ({
        name: key,
        value: conteoMinijuegos[key],
      }));
    },

    // Datos para distribución normal
    distribucion: () => {
      if (!resultados?.length || !minijuegoSeleccionado) return [];

      // Filtrar por minijuego seleccionado
      let datosFiltrados = resultados.filter(
        (resultado) =>
          (resultado.tituloMinijuego || resultado.minijuego || "Sin nombre") ===
          minijuegoSeleccionado
      );

      // Filtrar por fechas si están disponibles
      if (fechaInicio && fechaFin) {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setHours(23, 59, 59);

        datosFiltrados = datosFiltrados.filter((resultado) => {
          const fechaResultado = new Date(
            resultado.fecha || resultado.fechaResultado
          );
          return (
            fechaResultado >= fechaInicioObj && fechaResultado <= fechaFinObj
          );
        });
      }

      if (!datosFiltrados.length) return [];

      // Extraer puntajes y tiempos
      const tiempos = datosFiltrados.map((resultado) => resultado.puntaje || 0);
      const puntajes = datosFiltrados.map(
        (resultado) => resultado.tiempoSegundos || 0
      );

      // Calcular estadísticas para curva normal
      const { media: mediaPuntaje, desviacionEstandar: desvPuntaje } =
        calcularMediaYDesviacion(puntajes);

      // Generar puntos para curva normal
      const puntosCurva = [];
      const rangoPuntajes = Math.max(...puntajes) - Math.min(...puntajes);
      const minPuntaje = Math.max(
        0,
        Math.min(...puntajes) - rangoPuntajes * 0.1
      );
      const maxPuntaje = Math.max(...puntajes) + rangoPuntajes * 0.1;
      const paso = rangoPuntajes / 30 || 1;

      const maxTiempo = Math.max(...tiempos);

      for (let x = minPuntaje; x <= maxPuntaje; x += paso) {
        const y =
          (1 / (desvPuntaje * Math.sqrt(2 * Math.PI))) *
          Math.exp(
            -Math.pow(x - mediaPuntaje, 2) / (2 * Math.pow(desvPuntaje, 2))
          );

        const escalado = y * (maxTiempo * 1.2);

        puntosCurva.push({ x, y: escalado, tipo: "curva" });
      }

      // Agregar datos reales
      const datosReales = datosFiltrados.map((resultado) => ({
        x: resultado.puntaje || 0,
        y: resultado.tiempoSegundos || 0,
        nombre: resultado.nombreCompleto || "N/A",
        curso: resultado.curso || "N/A",
        puntaje: resultado.puntaje || 0,
        tiempo: formatUtils.tiempo(resultado.tiempoSegundos),
        fecha: resultado.fecha || formatUtils.fecha(resultado.fechaResultado),
        tipo: "dato",
        ...resultado,
      }));

      return [...puntosCurva, ...datosReales];
    },
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
                label={{
                  value: "Puntaje",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#fff",
                }}
                stroke="#fff"
              />
              <Tooltip />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar
                dataKey="puntajePromedio"
                name="Puntaje Promedio"
                fill="#0088FE"
              />
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
                label={{
                  value: "Tiempo (seg)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#fff",
                }}
                stroke="#fff"
              />
              <Tooltip />
              <Legend wrapperStyle={{ color: "#fff" }} />
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
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={160}
                fill="#8884d8"
                dataKey="value"
              >
                {procesarDatos.pie().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} intentos`, "Cantidad"]}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        );

      // Vamos a reemplazar el caso 'distribucion' dentro del switch
      case "distribucion": {
  // CustomTooltip mejorado para mostrar todos los datos
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length > 0 && payload[0].payload.tipo === "dato") {
      const data = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#2a1a4a",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            color: "#fff",
          }}
        >
          <p>
            <strong>Estudiante:</strong> {data.nombre}
          </p>
          <p>
            <strong>Curso:</strong> {data.curso}
          </p>
          <p>
            <strong>Puntaje:</strong> {data.puntaje}
          </p>
          <p>
            <strong>Tiempo:</strong> {data.tiempo}
          </p>
          <p>
            <strong>Puntos Base:</strong> {data.puntosBase || 0}
          </p>
          <p>
            <strong>Penalidad:</strong> {data.penalidadPuntos || 0}
          </p>
          <p>
            <strong>Fecha:</strong> {data.fecha}
          </p>
        </div>
      );
    }
    return null;
  };

  // Función mejorada para obtener y preparar los datos del gráfico
  const obtenerDatosGrafico = () => {
    if (!resultados?.length || !minijuegoSeleccionado) return { puntos: [], curva: [] };
    
    let datosFiltrados = resultados.filter(resultado =>
      (resultado.tituloMinijuego || resultado.minijuego || "Sin nombre") === minijuegoSeleccionado
    );
    
    if (fechaInicio && fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
      fechaFinObj.setHours(23, 59, 59);
      datosFiltrados = datosFiltrados.filter(resultado => {
        const fechaResultado = new Date(resultado.fecha || resultado.fechaResultado);
        return fechaResultado >= fechaInicioObj && fechaResultado <= fechaFinObj;
      });
    }
    
    if (!datosFiltrados.length) return { puntos: [], curva: [] };

    // Mapeo mejorado que incluye todos los campos necesarios para el tooltip
    const puntosScatter = datosFiltrados.map(resultado => ({
      x: resultado.tiempoSegundos || 0,
      y: resultado.puntaje || 0,
      // Campos adicionales para el tooltip
      nombre: resultado.nombreCompleto || "N/A",
      curso: resultado.curso || "N/A",
      puntaje: resultado.puntaje || 0,
      tiempo: formatUtils.tiempo(resultado.tiempoSegundos),
      puntosBase: resultado.puntosBase || 0,
      penalidadPuntos: resultado.penalidadPuntos || 0,
      fecha: formatUtils.formatearFecha(resultado.fecha || resultado.fechaResultado || new Date()),
      tipo: 'dato'
    }));

    if (puntosScatter.length < 3) return { puntos: puntosScatter, curva: [] };

    // Extraer vectores X e Y para cálculos
    const vectorX = puntosScatter.map(d => d.x);
    const vectorY = puntosScatter.map(d => d.y);

    // Normalizar datos para evitar problemas numéricos
    const minX = Math.min(...vectorX);
    const maxX = Math.max(...vectorX);
    const rangoX = maxX - minX;
    
    // Si el rango es muy pequeño, evitamos la división por cero
    if (rangoX < 0.00001) return { puntos: puntosScatter, curva: [] };

    // Función para normalizar X
    const normalizar = x => (x - minX) / rangoX;
    
    // Datos normalizados
    const datosNormalizados = puntosScatter.map(p => [normalizar(p.x), p.y]);
    
    // Función para calcular regresión polinomial con mejor control numérico
    const calcularRegresion = (datos, grado = 2) => {
      const n = datos.length;
      if (n <= grado) return null; // No suficientes puntos para el grado deseado
      
      // Crear la matriz X para regresión polinomial
      const X = [];
      for (let i = 0; i < n; i++) {
        const fila = [];
        const x = datos[i][0];
        for (let j = 0; j <= grado; j++) {
          fila.push(Math.pow(x, j));
        }
        X.push(fila);
      }
      
      // Vector Y
      const Y = datos.map(d => d[1]);
      
      // Calcular X^T * X
      const XtX = Array(grado + 1).fill().map(() => Array(grado + 1).fill(0));
      for (let i = 0; i <= grado; i++) {
        for (let j = 0; j <= grado; j++) {
          for (let k = 0; k < n; k++) {
            XtX[i][j] += X[k][i] * X[k][j];
          }
        }
      }
      
      // Calcular X^T * Y
      const XtY = Array(grado + 1).fill(0);
      for (let i = 0; i <= grado; i++) {
        for (let k = 0; k < n; k++) {
          XtY[i] += X[k][i] * Y[k];
        }
      }
      
      // Resolver sistema de ecuaciones mediante eliminación de Gauss-Jordan
      const matriz = [];
      for (let i = 0; i <= grado; i++) {
        const fila = [...XtX[i], XtY[i]];
        matriz.push(fila);
      }
      
      // Gauss-Jordan
      for (let i = 0; i <= grado; i++) {
        // Pivoteo parcial
        let maxRow = i;
        for (let j = i + 1; j <= grado; j++) {
          if (Math.abs(matriz[j][i]) > Math.abs(matriz[maxRow][i])) {
            maxRow = j;
          }
        }
        
        if (maxRow !== i) {
          [matriz[i], matriz[maxRow]] = [matriz[maxRow], matriz[i]];
        }
        
        // Si el pivote es muy pequeño, consideramos que la matriz es singular
        if (Math.abs(matriz[i][i]) < 1e-10) {
          return null;
        }
        
        // Normalizar fila por el pivote
        const pivote = matriz[i][i];
        for (let j = i; j <= grado + 1; j++) {
          matriz[i][j] /= pivote;
        }
        
        // Eliminación
        for (let j = 0; j <= grado; j++) {
          if (j !== i) {
            const factor = matriz[j][i];
            for (let k = i; k <= grado + 1; k++) {
              matriz[j][k] -= factor * matriz[i][k];
            }
          }
        }
      }
      
      // Extraer solución
      const coeficientes = matriz.map(fila => fila[grado + 1]);
      return coeficientes;
    };
    
    // Calcular coeficientes con datos normalizados
    const coeficientes = calcularRegresion(datosNormalizados, 2);
    
    if (!coeficientes) return { puntos: puntosScatter, curva: [] };
    
    // Generar puntos para la curva, desnormalizando los valores
    const pasos = 100; // Más puntos para una curva más suave
    const puntosCurva = [];

    // Calcular los valores mínimos y máximos para el eje Y
    const minY = Math.min(...vectorY);
    const maxY = Math.max(...vectorY);
    
    for (let i = 0; i <= pasos; i++) {
      const xNorm = i / pasos;
      // Calcular Y usando el polinomio
      let y = 0;
      for (let j = 0; j < coeficientes.length; j++) {
        y += coeficientes[j] * Math.pow(xNorm, j);
      }
      
      // Desnormalizar X para obtener el valor original
      const x = xNorm * rangoX + minX;
      
      // Limitar el valor de Y al rango de los datos originales
      // para evitar valores extremos en la curva
      y = Math.max(Math.min(y, maxY * 1.1), minY * 0.9);
      
      puntosCurva.push({ x, y, tipo: 'curva' });
    }
    
    return { puntos: puntosScatter, curva: puntosCurva };
  };

  const { puntos, curva } = obtenerDatosGrafico();

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
          <p>Por favor, selecciona un minijuego para visualizar el gráfico.</p>
        </div>
      ) : puntos.length === 0 ? (
        <div className="no-datos">
          <p>No hay datos suficientes para generar el gráfico con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grafico-distribucion-wrapper">
          <h3>Análisis de Puntaje vs Tiempo</h3>
          <p className="grafico-subtitulo">Minijuego: {minijuegoSeleccionado}</p>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                type="number"
                dataKey="x"
                name="Tiempo (segundos)"
                stroke="#fff"
                label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5, fill: '#fff' }}
                domain={['auto', 'auto']}
                allowDataOverflow={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Puntaje"
                stroke="#fff"
                label={{ value: 'Puntaje', angle: -90, position: 'insideLeft', offset: 10, fill: '#fff' }}
                domain={['auto', 'auto']}
                allowDataOverflow={false}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Puntos todos del mismo color */}
              <Scatter
                name="Intentos"
                data={puntos}
                fill="#00b894"
                shape="circle"
              />

              {/* Curva de tendencia */}
              {curva.length > 0 && (
                <Scatter
                  name="Tendencia"
                  data={curva}
                  line={{ stroke: '#FFA726', strokeWidth: 2 }}
                  shape={() => null}
                  legendType="line"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>

          <div className="estadisticas-distribucion">
            <h4>Estadísticas de {minijuegoSeleccionado}</h4>
            <EstadisticasMinijuego
              datos={puntos}
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
              <option value="distribucion">
                Distribución Normal (Puntaje vs Tiempo)
              </option>
            </select>
          </div>

          <div className="grafico-wrapper">{renderizarGrafico()}</div>

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
