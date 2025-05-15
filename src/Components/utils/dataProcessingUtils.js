// src/utils/dataProcessingUtils.js - Funciones adicionales
import { formatFecha, formatTiempo } from './formatUtils';

// Añadir estas funciones al archivo existente

/**
 * Procesa los datos para el gráfico de dispersión por estudiante
 * @param {Array} resultados - Array de resultados
 * @param {Object} estudiante - Estudiante seleccionado
 * @returns {Array} Datos procesados para gráfico de dispersión
 */
export const procesarDatosEstudiante = (resultados, estudiante) => {
  if (!resultados?.length || !estudiante) return [];

  // Verificar que tenemos un ID de estudiante válido
  const estudianteId = estudiante.id;
  if (!estudianteId) {
    console.error("ID de estudiante no válido:", estudiante);
    return [];
  }

  // Filtrar resultados por estudiante
  console.log(`Buscando resultados para estudiante ID: ${estudianteId}`);
  const datosEstudiante = resultados.filter(resultado => {
    const resultadoUsuarioId = resultado.usuarioId || resultado.idUsuario;
    const coincide = resultadoUsuarioId == estudianteId; // Usar == para comparar posibles tipos diferentes
    if (coincide) {
      console.log("Resultado encontrado:", resultado);
    }
    return coincide;
  });

  console.log(`Resultados encontrados para estudiante ${estudiante.nombre}: ${datosEstudiante.length}`);

  if (!datosEstudiante.length) return [];

  // Mapear resultados a formato para gráfico de dispersión
  return datosEstudiante.map(resultado => ({
    x: resultado.tiempoSegundos || 0,
    y: resultado.puntaje || 0,
    nombre: estudiante.nombre,
    minijuego: resultado.tituloMinijuego || resultado.minijuego || "Sin nombre",
    curso: resultado.curso || "N/A",
    puntaje: resultado.puntaje || 0,
    tiempo: resultado.tiempoFormateado || formatTiempo(resultado.tiempoSegundos),
    puntosBase: resultado.puntosBase || 0,
    penalidadPuntos: resultado.penalidadPuntos || 0,
    fecha: formatFecha(resultado.fecha || resultado.fechaResultado),
    tipo: 'dato'
  }));
};

/**
 * Tooltip personalizado para gráfico de dispersión por estudiante
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element|null} Tooltip o null si no está activo
 */
export const EstudianteTooltip = ({ active, payload }) => {
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
          <strong>Minijuego:</strong> {data.minijuego}
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
          <strong>Fecha:</strong> {data.fecha}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Calcular estadísticas para datos del estudiante
 * @param {Array} datos - Datos del estudiante
 * @returns {Array} Estadísticas calculadas
 */
export const calcularEstadisticasEstudiante = (datos) => {
  if (!datos || datos.length === 0) return [];

  // Agrupar por minijuego
  const porMinijuego = {};
  
  datos.forEach(dato => {
    const minijuego = dato.minijuego;
    if (!porMinijuego[minijuego]) {
      porMinijuego[minijuego] = {
        nombre: minijuego,
        intentos: 0,
        puntajeTotal: 0,
        tiempoTotal: 0
      };
    }
    
    porMinijuego[minijuego].intentos++;
    porMinijuego[minijuego].puntajeTotal += dato.y; // puntaje
    porMinijuego[minijuego].tiempoTotal += dato.x;  // tiempo
  });
  
  // Calcular promedios
  return Object.values(porMinijuego).map(item => ({
    ...item,
    puntajePromedio: Math.round((item.puntajeTotal / item.intentos) * 10) / 10,
    tiempoPromedio: Math.round((item.tiempoTotal / item.intentos) * 10) / 10
  }));
};