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

/**
 * Identifica el tipo de minijuego basado en su nombre
 * @param {string} nombreMinijuego - Nombre del minijuego
 * @returns {string|null} Tipo de minijuego
 */
export const tipoMinijuego = (nombreMinijuego) => {
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
};