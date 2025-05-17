/**
 * Funciones de utilidad mejoradas para procesar datos en los componentes de resultados
 */

/**
 * Procesa los datos agrupados por minijuego para gráficos de barras y líneas
 * @param {Array} resultados - Array de resultados
 * @returns {Array} Datos procesados para gráficos
 */
export const procesarDatosGraficos = (resultados) => {
  if (!resultados?.length) return [];

  const datosPorMinijuego = {};

  resultados.forEach((resultado) => {
    // Normalizar el nombre del minijuego (pueden venir de diferentes fuentes)
    const nombreMinijuego = 
      resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";

    // Inicializar estructura si no existe
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

    // Acumular datos
    datosPorMinijuego[nombreMinijuego].intentos += 1;
    datosPorMinijuego[nombreMinijuego].puntajeTotal +=
      resultado.puntaje || resultado.puntajeObtenido || 0;
    datosPorMinijuego[nombreMinijuego].tiempoTotal +=
      resultado.tiempoSegundos || resultado.tiempoEjecucion || 0;
  });

  // Calcular promedios
  Object.values(datosPorMinijuego).forEach((item) => {
    item.puntajePromedio = Math.round((item.puntajeTotal / item.intentos) * 10) / 10;
    item.tiempoPromedio = Math.round((item.tiempoTotal / item.intentos) * 10) / 10;
  });

  return Object.values(datosPorMinijuego);
};

/**
 * Procesa los datos para gráfico circular
 * @param {Array} resultados - Array de resultados
 * @returns {Array} Datos procesados para gráfico circular
 */
export const procesarDatosPie = (resultados) => {
  if (!resultados?.length) return [];

  const conteoMinijuegos = {};

  resultados.forEach((resultado) => {
    const nombreMinijuego = 
      resultado.tituloMinijuego || resultado.minijuego || "Sin nombre";
    conteoMinijuegos[nombreMinijuego] = (conteoMinijuegos[nombreMinijuego] || 0) + 1;
  });

  return Object.keys(conteoMinijuegos).map((key) => ({
    name: key,
    value: conteoMinijuegos[key],
  }));
};

/**
 * Filtra y procesa datos para el gráfico de distribución
 * @param {Array} resultados - Array de resultados
 * @param {string} minijuegoSeleccionado - Minijuego seleccionado para filtrar
 * @param {string} fechaInicio - Fecha de inicio para filtrar (opcional)
 * @param {string} fechaFin - Fecha de fin para filtrar (opcional)
 * @returns {Array} Puntos para el gráfico de dispersión
 */
export const procesarDatosDistribucion = (
  resultados,
  minijuegoSeleccionado,
  fechaInicio,
  fechaFin
) => {
  if (!resultados?.length || !minijuegoSeleccionado) return [];

  // Filtrar por minijuego seleccionado
  let datosFiltrados = resultados.filter(resultado => 
    (resultado.tituloMinijuego || resultado.minijuego || "Sin nombre") === 
    minijuegoSeleccionado
  );

  // Filtrar por fechas si están disponibles
  if (fechaInicio && fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    fechaFinObj.setHours(23, 59, 59);

    datosFiltrados = datosFiltrados.filter(resultado => {
      const fechaResultado = new Date(
        resultado.fecha || resultado.fechaResultado
      );
      return fechaResultado >= fechaInicioObj && fechaResultado <= fechaFinObj;
    });
  }

  if (!datosFiltrados.length) return [];

  // Mapear a formato para gráfico de dispersión
  return datosFiltrados.map(resultado => ({
    x: resultado.tiempoSegundos || resultado.tiempoEjecucion || 0,
    y: resultado.puntaje || resultado.puntajeObtenido || 0,
    nombre: resultado.nombreCompleto || "N/A",
    curso: resultado.curso || "N/A",
    puntaje: resultado.puntaje || resultado.puntajeObtenido || 0,
    tiempo: formatTiempo(resultado.tiempoSegundos || resultado.tiempoEjecucion),
    puntosBase: resultado.puntosBase || 0,
    penalidadPuntos: resultado.penalidadPuntos || 0,
    fecha: formatFecha(resultado.fecha || resultado.fechaResultado),
    tipo: 'dato'
  }));
};

/**
 * Extrae la lista de minijuegos únicos de los resultados
 * @param {Array} resultados - Array de resultados
 * @returns {Array<string>} Lista de nombres de minijuegos únicos
 */
export const extraerMinijuegosUnicos = (resultados) => {
  if (!resultados?.length) return [];
  
  return [...new Set(
    resultados.map(item => 
      item.tituloMinijuego || item.minijuego || "Sin nombre"
    )
  )].sort();
};

/**
 * Procesa los datos para el gráfico de dispersión por estudiante
 * @param {Array} resultados - Array de resultados
 * @param {Object} estudiante - Estudiante seleccionado
 * @returns {Array} Datos procesados para gráfico de dispersión
 */
export const procesarDatosEstudiante = (resultados, estudiante) => {
  if (!resultados?.length || !estudiante) return [];

  // Verificar que tenemos un nombre de estudiante válido
  const estudianteNombre = estudiante.nombre;
  if (!estudianteNombre) {
    console.error("Nombre de estudiante no válido:", estudiante);
    return [];
  }

  // Filtrar resultados por estudiante usando el nombre
  console.log(`Buscando resultados para estudiante: ${estudianteNombre}`);
  const datosEstudiante = resultados.filter(resultado => {
    // Comparamos por nombre ya que no tenemos ID consistente
    const resultadoNombre = resultado.nombreCompleto;
    return resultadoNombre === estudianteNombre;
  });

  console.log(`Resultados encontrados para estudiante ${estudianteNombre}: ${datosEstudiante.length}`);

  if (!datosEstudiante.length) return [];

  // Mapear resultados a formato para gráfico de dispersión
  return datosEstudiante.map(resultado => ({
    x: resultado.tiempoSegundos || resultado.tiempoEjecucion || 0,
    y: resultado.puntaje || resultado.puntajeObtenido || 0,
    nombre: estudianteNombre,
    minijuego: resultado.tituloMinijuego || resultado.minijuego || "Sin nombre",
    curso: resultado.curso || "N/A",
    puntaje: resultado.puntaje || resultado.puntajeObtenido || 0,
    tiempo: formatTiempo(resultado.tiempoSegundos || resultado.tiempoEjecucion),
    puntosBase: resultado.puntosBase || 0,
    penalidadPuntos: resultado.penalidadPuntos || 0,
    fecha: formatFecha(resultado.fecha || resultado.fechaResultado),
    tipo: 'dato'
  }));
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
 * Formatea tiempo en segundos a formato MM:SS
 * @param {number} segundos - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
export const formatTiempo = (segundos) => {
  if (segundos === undefined || segundos === null) return "N/A";
  const minutos = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${minutos.toString().padStart(2, "0")}:${segs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Formatea una fecha a formato local
 * @param {string} fechaStr - Fecha en formato string
 * @returns {string} Fecha formateada
 */
export const formatFecha = (fechaStr) => {
  if (!fechaStr) return "N/A";
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "N/A";
  }
};