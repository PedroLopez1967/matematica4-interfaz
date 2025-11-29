/**
 * Utilidades matemáticas para cálculos multivariables
 * Usa math.js para evaluación de expresiones y cálculos numéricos
 */
import { create, all } from 'mathjs';

const math = create(all);

/**
 * Evalúa una función en un punto dado
 */
export function evaluateFunction(
  expression: string,
  variables: { [key: string]: number }
): number {
  try {
    const compiled = math.compile(expression);
    const result = compiled.evaluate(variables);
    return typeof result === 'number' ? result : NaN;
  } catch (error) {
    console.error('Error evaluating function:', error);
    return NaN;
  }
}

/**
 * Calcula el límite de una función aproximándose desde diferentes direcciones
 */
export function calculateLimit(
  expression: string,
  _variable: string,
  targetValue: number,
  path: 'x' | 'y' | 'diagonal' | 'parabolic' = 'x'
): { values: Array<{ t: number; value: number }>; limit: number | null } {
  const steps = 20;
  const values: Array<{ t: number; value: number }> = [];

  try {
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      let vars: { [key: string]: number } = {};

      // Diferentes caminos de aproximación
      switch (path) {
        case 'x':
          // Aproximación por eje X (y = 0)
          vars = { x: targetValue * (1 - t), y: 0 };
          break;
        case 'y':
          // Aproximación por eje Y (x = 0)
          vars = { x: 0, y: targetValue * (1 - t) };
          break;
        case 'diagonal':
          // Aproximación diagonal (y = x)
          vars = { x: targetValue * (1 - t), y: targetValue * (1 - t) };
          break;
        case 'parabolic':
          // Aproximación parabólica (y = x²)
          const xVal = targetValue * (1 - t);
          vars = { x: xVal, y: xVal * xVal };
          break;
      }

      const value = evaluateFunction(expression, vars);
      values.push({ t: 1 - t, value });
    }

    // Estimar el límite (promedio de los últimos 5 valores)
    const lastValues = values.slice(-5).map(v => v.value);
    const limit = lastValues.every(v => !isNaN(v) && isFinite(v))
      ? lastValues.reduce((a, b) => a + b, 0) / lastValues.length
      : null;

    return { values, limit };
  } catch (error) {
    console.error('Error calculating limit:', error);
    return { values: [], limit: null };
  }
}

/**
 * Calcula la derivada parcial numérica de una función
 */
export function partialDerivative(
  expression: string,
  variable: 'x' | 'y' | 'z',
  point: { x: number; y: number; z?: number },
  h: number = 0.0001
): number {
  try {
    const vars1 = { ...point };
    const vars2 = { ...point };

    vars1[variable] = (point[variable] || 0) - h;
    vars2[variable] = (point[variable] || 0) + h;

    const f1 = evaluateFunction(expression, vars1);
    const f2 = evaluateFunction(expression, vars2);

    return (f2 - f1) / (2 * h);
  } catch (error) {
    console.error('Error calculating partial derivative:', error);
    return NaN;
  }
}

/**
 * Calcula el gradiente de una función en un punto
 */
export function gradient(
  expression: string,
  point: { x: number; y: number; z?: number }
): { x: number; y: number; z?: number } {
  const gradX = partialDerivative(expression, 'x', point);
  const gradY = partialDerivative(expression, 'y', point);

  const result: { x: number; y: number; z?: number } = { x: gradX, y: gradY };

  if (point.z !== undefined) {
    result.z = partialDerivative(expression, 'z', point);
  }

  return result;
}

/**
 * Calcula la derivada direccional en dirección de un vector unitario
 */
export function directionalDerivative(
  expression: string,
  point: { x: number; y: number; z?: number },
  direction: { x: number; y: number; z?: number }
): number {
  const grad = gradient(expression, point);

  // Producto punto: ∇f · u
  let dotProduct = grad.x * direction.x + grad.y * direction.y;

  if (grad.z !== undefined && direction.z !== undefined) {
    dotProduct += grad.z * direction.z;
  }

  return dotProduct;
}

/**
 * Normaliza un vector
 */
export function normalizeVector(v: { x: number; y: number; z?: number }): {
  x: number;
  y: number;
  z?: number;
} {
  const magnitude = Math.sqrt(
    v.x * v.x + v.y * v.y + (v.z !== undefined ? v.z * v.z : 0)
  );

  if (magnitude === 0) return { x: 0, y: 0, ...(v.z !== undefined ? { z: 0 } : {}) };

  const result: { x: number; y: number; z?: number } = {
    x: v.x / magnitude,
    y: v.y / magnitude,
  };

  if (v.z !== undefined) {
    result.z = v.z / magnitude;
  }

  return result;
}

/**
 * Verifica si un campo vectorial 2D es conservativo
 * Comprueba si ∂P/∂y = ∂Q/∂x
 */
export function isConservative2D(
  P: string,
  Q: string,
  testPoints: Array<{ x: number; y: number }> = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 2 },
    { x: -1, y: 1 },
  ]
): { conservative: boolean; dPdy: number[]; dQdx: number[]; matches: boolean[] } {
  const dPdy: number[] = [];
  const dQdx: number[] = [];
  const matches: boolean[] = [];

  for (const point of testPoints) {
    const dPdyVal = partialDerivative(P, 'y', point);
    const dQdxVal = partialDerivative(Q, 'x', point);

    dPdy.push(dPdyVal);
    dQdx.push(dQdxVal);

    // Tolerancia para errores numéricos
    const tolerance = 0.0001;
    matches.push(Math.abs(dPdyVal - dQdxVal) < tolerance);
  }

  const conservative = matches.every(m => m);

  return { conservative, dPdy, dQdx, matches };
}

/**
 * Intenta encontrar la función potencial de un campo conservativo 2D
 */
export function findPotentialFunction(P: string, Q: string): string | null {
  // Esta es una implementación simplificada
  // En un caso real, necesitaríamos integración simbólica
  // Por ahora, solo verificamos si es conservativo

  const check = isConservative2D(P, Q);

  if (!check.conservative) {
    return null;
  }

  // Retornar mensaje indicativo
  return `f(x,y) = ∫(${P})dx + g(y)`;
}

/**
 * Genera datos para graficar una superficie 3D
 */
export function generateSurfaceData(
  expression: string,
  xRange: [number, number] = [-5, 5],
  yRange: [number, number] = [-5, 5],
  resolution: number = 30
): Array<{ x: number; y: number; z: number }> {
  const data: Array<{ x: number; y: number; z: number }> = [];
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  for (let i = 0; i <= resolution; i++) {
    const x = xMin + (xMax - xMin) * (i / resolution);

    for (let j = 0; j <= resolution; j++) {
      const y = yMin + (yMax - yMin) * (j / resolution);
      const z = evaluateFunction(expression, { x, y });

      if (!isNaN(z) && isFinite(z)) {
        data.push({ x, y, z });
      }
    }
  }

  return data;
}

/**
 * Genera puntos de curva de nivel
 */
export function generateContourLines(
  expression: string,
  levels: number[],
  xRange: [number, number] = [-5, 5],
  yRange: [number, number] = [-5, 5],
  resolution: number = 50
): Array<{ level: number; points: Array<{ x: number; y: number }> }> {
  const contours: Array<{ level: number; points: Array<{ x: number; y: number }> }> = [];
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  for (const level of levels) {
    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= resolution; i++) {
      const x = xMin + (xMax - xMin) * (i / resolution);

      for (let j = 0; j <= resolution; j++) {
        const y = yMin + (yMax - yMin) * (j / resolution);
        const z = evaluateFunction(expression, { x, y });

        // Si el valor está cerca del nivel deseado
        if (Math.abs(z - level) < 0.1) {
          points.push({ x, y });
        }
      }
    }

    if (points.length > 0) {
      contours.push({ level, points });
    }
  }

  return contours;
}

/**
 * Método de Lagrange simplificado para encontrar puntos críticos
 */
export function lagrangeMultipliers(
  objective: string,
  constraint: string,
  initialGuess: { x: number; y: number; z?: number; lambda: number }
): { x: number; y: number; z?: number; lambda: number; value: number } | null {
  // Implementación simplificada usando descenso de gradiente
  // En un caso real, usaríamos un solver numérico más sofisticado

  let point = { ...initialGuess };
  const learningRate = 0.01;
  const iterations = 1000;
  const tolerance = 0.0001;

  for (let i = 0; i < iterations; i++) {
    // Calcular gradientes
    const gradF = gradient(objective, point);
    const gradG = gradient(constraint, point);

    // Actualizar punto según ∇f = λ∇g
    const error = Math.abs(gradF.x - point.lambda * gradG.x) +
                  Math.abs(gradF.y - point.lambda * gradG.y);

    if (error < tolerance) {
      const value = evaluateFunction(objective, point);
      return { ...point, value };
    }

    // Ajustar lambda
    point.lambda += learningRate * (gradF.x / gradG.x - point.lambda);
  }

  return null;
}

/**
 * Formatea un número para mostrar
 */
export function formatNumber(num: number, decimals: number = 4): string {
  if (isNaN(num)) return '---';
  if (!isFinite(num)) return '∞';
  return num.toFixed(decimals);
}

/**
 * Analiza si una función tiene un máximo, mínimo o punto de silla
 */
export function analyzeHessian(
  expression: string,
  point: { x: number; y: number }
): 'maximum' | 'minimum' | 'saddle' | 'inconclusive' {
  const h = 0.0001;

  // Calcular segundas derivadas parciales
  const fxx = (evaluateFunction(expression, { x: point.x + h, y: point.y }) -
               2 * evaluateFunction(expression, point) +
               evaluateFunction(expression, { x: point.x - h, y: point.y })) / (h * h);

  const fyy = (evaluateFunction(expression, { x: point.x, y: point.y + h }) -
               2 * evaluateFunction(expression, point) +
               evaluateFunction(expression, { x: point.x, y: point.y - h })) / (h * h);

  const fxy = (evaluateFunction(expression, { x: point.x + h, y: point.y + h }) -
               evaluateFunction(expression, { x: point.x + h, y: point.y - h }) -
               evaluateFunction(expression, { x: point.x - h, y: point.y + h }) +
               evaluateFunction(expression, { x: point.x - h, y: point.y - h })) / (4 * h * h);

  // Determinante de la matriz Hessiana
  const D = fxx * fyy - fxy * fxy;

  if (D > 0 && fxx > 0) return 'minimum';
  if (D > 0 && fxx < 0) return 'maximum';
  if (D < 0) return 'saddle';
  return 'inconclusive';
}
