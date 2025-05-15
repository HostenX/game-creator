// src/utils/chartUtils.js

/**
 * Funciones de utilidad para cálculos y procesamiento de datos para gráficos
 */

/**
 * Calcula la media y desviación estándar de un conjunto de datos
 * @param {Array<number>} datos - Array de valores numéricos
 * @returns {Object} Objeto con media y desviación estándar
 */
export const calcularMediaYDesviacion = (datos) => {
  if (!datos || datos.length === 0) {
    return { media: 0, desviacionEstandar: 0 };
  }

  const media = datos.reduce((sum, valor) => sum + valor, 0) / datos.length;
  
  const varianza = datos.reduce((sum, valor) => {
    return sum + Math.pow(valor - media, 2);
  }, 0) / datos.length;
  
  const desviacionEstandar = Math.sqrt(varianza);

  return { media, desviacionEstandar };
};

/**
 * Calcula los coeficientes de una regresión polinomial
 * @param {Array<Array<number>>} datos - Array de pares [x,y]
 * @param {number} grado - Grado del polinomio (por defecto: 2)
 * @returns {Array<number>|null} Coeficientes del polinomio o null si no hay suficientes datos
 */
export const calcularRegresionPolinomial = (datos, grado = 2) => {
  const n = datos.length;
  if (n <= grado) return null; // No suficientes puntos
  
  // Crear matriz X para regresión polinomial
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
  
  // Calcular X^T * X (matriz de coeficientes)
  const XtX = Array(grado + 1).fill().map(() => Array(grado + 1).fill(0));
  for (let i = 0; i <= grado; i++) {
    for (let j = 0; j <= grado; j++) {
      for (let k = 0; k < n; k++) {
        XtX[i][j] += X[k][i] * X[k][j];
      }
    }
  }
  
  // Calcular X^T * Y (vector de términos independientes)
  const XtY = Array(grado + 1).fill(0);
  for (let i = 0; i <= grado; i++) {
    for (let k = 0; k < n; k++) {
      XtY[i] += X[k][i] * Y[k];
    }
  }
  
  // Resolver sistema de ecuaciones mediante eliminación Gauss-Jordan
  const matriz = [];
  for (let i = 0; i <= grado; i++) {
    const fila = [...XtX[i], XtY[i]];
    matriz.push(fila);
  }
  
  // Eliminación Gauss-Jordan con pivoteo parcial
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
    
    // Si el pivote es muy pequeño, matriz singular
    if (Math.abs(matriz[i][i]) < 1e-10) {
      return null;
    }
    
    // Normalizar fila por pivote
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
  
  // Extraer solución (coeficientes)
  return matriz.map(fila => fila[grado + 1]);
};

/**
 * Normaliza un conjunto de datos al rango [0,1]
 * @param {Array<number>} datos - Array de valores numéricos
 * @returns {Object} Objeto con datos normalizados y funciones de normalización/desnormalización
 */
export const normalizarDatos = (datos) => {
  const min = Math.min(...datos);
  const max = Math.max(...datos);
  const rango = max - min;
  
  // Prevenir división por cero
  if (rango < 1e-10) {
    return {
      datosNormalizados: datos.map(() => 0.5),
      normalizar: () => 0.5,
      desnormalizar: () => min
    };
  }
  
  return {
    datosNormalizados: datos.map(x => (x - min) / rango),
    normalizar: (x) => (x - min) / rango,
    desnormalizar: (x) => x * rango + min
  };
};

/**
 * Genera puntos para una curva de tendencia polinomial
 * @param {Array<{x: number, y: number}>} datos - Datos originales 
 * @param {number} grado - Grado del polinomio
 * @param {number} puntos - Número de puntos para la curva
 * @returns {Array<{x: number, y: number, tipo: string}>} Puntos para graficar la curva
 */
export const generarCurvaTendencia = (datos, grado = 2, puntos = 100) => {
  if (!datos || datos.length < grado + 1) return [];
  
  // Extraer vectores X e Y
  const vectorX = datos.map(d => d.x);
  const vectorY = datos.map(d => d.y);
  
  // Normalizar datos para estabilidad numérica
  const { datosNormalizados: xNorm, normalizar, desnormalizar } = normalizarDatos(vectorX);
  
  // Preparar datos para regresión
  const datosNormalizados = xNorm.map((x, i) => [x, vectorY[i]]);
  
  // Calcular coeficientes del polinomio
  const coeficientes = calcularRegresionPolinomial(datosNormalizados, grado);
  if (!coeficientes) return [];
  
  // Calcular límites
  const minX = Math.min(...vectorX);
  const maxX = Math.max(...vectorX);
  const minY = Math.min(...vectorY);
  const maxY = Math.max(...vectorY);
  
  // Generar puntos para la curva
  const curvaPuntos = [];
  for (let i = 0; i <= puntos; i++) {
    const xNormalizado = i / puntos;
    
    // Calcular Y usando el polinomio
    let y = 0;
    for (let j = 0; j < coeficientes.length; j++) {
      y += coeficientes[j] * Math.pow(xNormalizado, j);
    }
    
    // Desnormalizar X
    const x = desnormalizar(xNormalizado);
    
    // Limitar Y al rango de datos originales para evitar valores extremos
    const yLimitado = Math.max(minY * 0.9, Math.min(y, maxY * 1.1));
    
    curvaPuntos.push({ x, y: yLimitado, tipo: 'curva' });
  }
  
  return curvaPuntos;
};