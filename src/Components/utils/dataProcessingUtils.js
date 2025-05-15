// src/utils/dataProcessingUtils.js

import { formatFecha, formatTiempo } from './formatUtils';

/**
 * Funciones para procesar datos para diferentes tipos de gráficos
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
    datosPorMinijuego[nombreMinijuego].puntajeTotal += resultado.puntaje || 0;
    datosPorMinijuego[nombreMinijuego].tiempoTotal += resultado.tiempoSegundos || 0;
  });

  // Calcular promedios
  Object.values(datosPorMinijuego).forEach((item) => {
    item.puntajePromedio = 
      Math.round((item.puntajeTotal / item.intentos) * 10) / 10;
    item.tiempoPromedio = 
      Math.round((item.tiempoTotal / item.intentos) * 10) / 10;
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
    x: resultado.tiempoSegundos || 0,
    y: resultado.puntaje || 0,
    nombre: resultado.nombreCompleto || resultado.nombre || "N/A",
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
  )];
};