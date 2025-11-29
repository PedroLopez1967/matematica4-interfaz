/**
 * Base de datos de problemas para cada escenario
 */

// Definir tipos inline para evitar problemas de importación
type ObjectiveId = '1' | '2' | '3' | '4' | '5';
type ScenarioType = 'limit-explorer' | 'derivative-lab' | 'extreme-hunter' | 'gradient-navigator' | 'field-inspector';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface Hint {
  id: string;
  content: string;
  cost: number;
}

interface Problem {
  id: string;
  objectiveId: ObjectiveId;
  scenario: ScenarioType;
  statement: string;
  functionExpression: string;
  correctAnswer: string | number | { [key: string]: any };
  hints: Hint[];
  points: number;
  difficulty: Difficulty;
}

export const problems: Problem[] = [
  // ==========================================
  // OBJETIVO 1: LÍMITES Y CONTINUIDAD
  // ==========================================
  {
    id: 'limit-1',
    objectiveId: '1',
    scenario: 'limit-explorer',
    statement: 'Calcula el límite de f(x,y) = (x^2 - y^2) / (x - y) cuando (x,y) → (0,0)',
    functionExpression: '(x^2 - y^2) / (x - y)',
    correctAnswer: 0,
    hints: [
      {
        id: 'limit-1-h1',
        content: 'Intenta simplificar la expresión algebraicamente',
        cost: 5,
      },
      {
        id: 'limit-1-h2',
        content: 'Factoriza el numerador: x² - y² = (x+y)(x-y)',
        cost: 10,
      },
      {
        id: 'limit-1-h3',
        content: 'Después de simplificar, la expresión se reduce a x + y',
        cost: 15,
      },
    ],
    points: 100,
    difficulty: 'beginner',
  },
  {
    id: 'limit-2',
    objectiveId: '1',
    scenario: 'limit-explorer',
    statement: 'Determina si existe el límite de f(x,y) = xy / (x^2 + y^2) cuando (x,y) → (0,0)',
    functionExpression: '(x * y) / (x^2 + y^2)',
    correctAnswer: 'no existe',
    hints: [
      {
        id: 'limit-2-h1',
        content: 'Prueba diferentes caminos de aproximación',
        cost: 5,
      },
      {
        id: 'limit-2-h2',
        content: 'Intenta con y=0, luego con x=0, y finalmente con y=x',
        cost: 10,
      },
      {
        id: 'limit-2-h3',
        content: 'Si obtienes diferentes valores por diferentes caminos, el límite no existe',
        cost: 15,
      },
    ],
    points: 150,
    difficulty: 'intermediate',
  },
  {
    id: 'limit-3',
    objectiveId: '1',
    scenario: 'limit-explorer',
    statement: 'Calcula lim(x,y)→(0,0) [sin(x^2 + y^2) / (x^2 + y^2)]',
    functionExpression: 'sin(x^2 + y^2) / (x^2 + y^2)',
    correctAnswer: 1,
    hints: [
      {
        id: 'limit-3-h1',
        content: 'Recuerda el límite fundamental: lim(u→0) sin(u)/u = 1',
        cost: 5,
      },
      {
        id: 'limit-3-h2',
        content: 'Sustituye u = x² + y². Cuando (x,y)→(0,0), u→0',
        cost: 10,
      },
    ],
    points: 120,
    difficulty: 'intermediate',
  },

  // ==========================================
  // OBJETIVO 2: DERIVADAS PARCIALES
  // ==========================================
  {
    id: 'deriv-1',
    objectiveId: '2',
    scenario: 'derivative-lab',
    statement: 'Calcula las derivadas parciales de f(x,y) = x^2*y + y^3 en el punto (1,2)',
    functionExpression: 'x^2 * y + y^3',
    correctAnswer: { fx: 4, fy: 13 },
    hints: [
      {
        id: 'deriv-1-h1',
        content: 'Para ∂f/∂x, trata a y como constante',
        cost: 5,
      },
      {
        id: 'deriv-1-h2',
        content: '∂f/∂x = 2xy, y ∂f/∂y = x² + 3y²',
        cost: 10,
      },
      {
        id: 'deriv-1-h3',
        content: 'Evalúa en (1,2): ∂f/∂x(1,2) = 2(1)(2) = 4',
        cost: 15,
      },
    ],
    points: 100,
    difficulty: 'beginner',
  },
  {
    id: 'deriv-2',
    objectiveId: '2',
    scenario: 'derivative-lab',
    statement: 'Encuentra el plano tangente a z = x^2 + 2y^2 en el punto (1,1,3)',
    functionExpression: 'x^2 + 2*y^2',
    correctAnswer: 'z = 2x + 4y - 3',
    hints: [
      {
        id: 'deriv-2-h1',
        content: 'El plano tangente tiene forma: z - z₀ = fx(x₀,y₀)(x - x₀) + fy(x₀,y₀)(y - y₀)',
        cost: 5,
      },
      {
        id: 'deriv-2-h2',
        content: 'Calcula fx = 2x y fy = 4y, luego evalúa en (1,1)',
        cost: 10,
      },
    ],
    points: 150,
    difficulty: 'intermediate',
  },
  {
    id: 'deriv-3',
    objectiveId: '2',
    scenario: 'derivative-lab',
    statement: 'Verifica si f(x,y) = e^(x*y) satisface la ecuación x*∂f/∂x = y*∂f/∂y',
    functionExpression: 'e^(x*y)',
    correctAnswer: true,
    hints: [
      {
        id: 'deriv-3-h1',
        content: 'Calcula ambas derivadas parciales',
        cost: 5,
      },
      {
        id: 'deriv-3-h2',
        content: '∂f/∂x = y*e^(xy) y ∂f/∂y = x*e^(xy)',
        cost: 10,
      },
    ],
    points: 130,
    difficulty: 'intermediate',
  },

  // ==========================================
  // OBJETIVO 3: OPTIMIZACIÓN CON LAGRANGE
  // ==========================================
  {
    id: 'lagrange-1',
    objectiveId: '3',
    scenario: 'extreme-hunter',
    statement: 'Encuentra el máximo de f(x,y) = xy sujeto a x + y = 10',
    functionExpression: 'x * y',
    correctAnswer: { x: 5, y: 5, value: 25 },
    hints: [
      {
        id: 'lagrange-1-h1',
        content: 'Usa multiplicadores de Lagrange: ∇f = λ∇g',
        cost: 5,
      },
      {
        id: 'lagrange-1-h2',
        content: 'Sistema: y = λ, x = λ, x + y = 10',
        cost: 10,
      },
      {
        id: 'lagrange-1-h3',
        content: 'De las dos primeras ecuaciones: x = y. Sustituye en la restricción',
        cost: 15,
      },
    ],
    points: 150,
    difficulty: 'intermediate',
  },
  {
    id: 'lagrange-2',
    objectiveId: '3',
    scenario: 'extreme-hunter',
    statement: 'Minimiza f(x,y,z) = x^2 + y^2 + z^2 sujeto a x + y + z = 1',
    functionExpression: 'x^2 + y^2 + z^2',
    correctAnswer: { x: 1 / 3, y: 1 / 3, z: 1 / 3, value: 1 / 3 },
    hints: [
      {
        id: 'lagrange-2-h1',
        content: 'Plantea el sistema ∇f = λ∇g con g(x,y,z) = x+y+z-1',
        cost: 5,
      },
      {
        id: 'lagrange-2-h2',
        content: '2x = λ, 2y = λ, 2z = λ implica que x = y = z',
        cost: 10,
      },
    ],
    points: 180,
    difficulty: 'advanced',
  },
  {
    id: 'lagrange-3',
    objectiveId: '3',
    scenario: 'extreme-hunter',
    statement: 'Encuentra los extremos de f(x,y) = x^2 - y^2 en el círculo x^2 + y^2 = 1',
    functionExpression: 'x^2 - y^2',
    correctAnswer: { max: 1, min: -1 },
    hints: [
      {
        id: 'lagrange-3-h1',
        content: 'Hay cuatro puntos críticos en el círculo unitario',
        cost: 5,
      },
      {
        id: 'lagrange-3-h2',
        content: 'Los puntos son (±1,0) y (0,±1)',
        cost: 10,
      },
    ],
    points: 160,
    difficulty: 'intermediate',
  },

  // ==========================================
  // OBJETIVO 4: GRADIENTE Y DIRECCIONALES
  // ==========================================
  {
    id: 'grad-1',
    objectiveId: '4',
    scenario: 'gradient-navigator',
    statement: 'Calcula el gradiente de T(x,y) = x^2 + y^2 en el punto (3,4)',
    functionExpression: 'x^2 + y^2',
    correctAnswer: { x: 6, y: 8 },
    hints: [
      {
        id: 'grad-1-h1',
        content: 'El gradiente es ∇T = (∂T/∂x, ∂T/∂y)',
        cost: 5,
      },
      {
        id: 'grad-1-h2',
        content: '∂T/∂x = 2x y ∂T/∂y = 2y',
        cost: 10,
      },
    ],
    points: 100,
    difficulty: 'beginner',
  },
  {
    id: 'grad-2',
    objectiveId: '4',
    scenario: 'gradient-navigator',
    statement: 'Encuentra la derivada direccional de f(x,y) = xy en (2,3) en dirección del vector (1,1)',
    functionExpression: 'x * y',
    correctAnswer: 3.536,
    hints: [
      {
        id: 'grad-2-h1',
        content: 'Primero normaliza el vector dirección',
        cost: 5,
      },
      {
        id: 'grad-2-h2',
        content: 'u = (1/√2, 1/√2). Luego calcula ∇f·u',
        cost: 10,
      },
      {
        id: 'grad-2-h3',
        content: '∇f(2,3) = (3,2). Producto punto: 3/√2 + 2/√2',
        cost: 15,
      },
    ],
    points: 140,
    difficulty: 'intermediate',
  },
  {
    id: 'grad-3',
    objectiveId: '4',
    scenario: 'gradient-navigator',
    statement: '¿En qué dirección crece más rápido T(x,y) = e^(-x^2-y^2) desde el punto (0,0)?',
    functionExpression: 'e^(-x^2 - y^2)',
    correctAnswer: { x: 0, y: 0, note: 'El gradiente es (0,0), no hay dirección de crecimiento' },
    hints: [
      {
        id: 'grad-3-h1',
        content: 'La dirección de máximo crecimiento es la del gradiente',
        cost: 5,
      },
      {
        id: 'grad-3-h2',
        content: 'Calcula ∇T en (0,0)',
        cost: 10,
      },
      {
        id: 'grad-3-h3',
        content: 'En (0,0) hay un máximo local, por lo que ∇T = (0,0)',
        cost: 15,
      },
    ],
    points: 160,
    difficulty: 'advanced',
  },

  // ==========================================
  // OBJETIVO 5: CAMPOS VECTORIALES
  // ==========================================
  {
    id: 'field-1',
    objectiveId: '5',
    scenario: 'field-inspector',
    statement: 'Determina si F⃗(x,y) = (2x, 2y) es conservativo',
    functionExpression: 'F = (2*x, 2*y)',
    correctAnswer: { conservative: true, potential: 'f(x,y) = x^2 + y^2 + C' },
    hints: [
      {
        id: 'field-1-h1',
        content: 'Verifica si ∂P/∂y = ∂Q/∂x',
        cost: 5,
      },
      {
        id: 'field-1-h2',
        content: 'P = 2x, Q = 2y. Calcula ambas derivadas cruzadas',
        cost: 10,
      },
      {
        id: 'field-1-h3',
        content: '∂P/∂y = 0 y ∂Q/∂x = 0, por lo tanto es conservativo',
        cost: 15,
      },
    ],
    points: 120,
    difficulty: 'beginner',
  },
  {
    id: 'field-2',
    objectiveId: '5',
    scenario: 'field-inspector',
    statement: 'Determina si F⃗(x,y) = (-y, x) es conservativo',
    functionExpression: 'F = (-y, x)',
    correctAnswer: { conservative: false },
    hints: [
      {
        id: 'field-2-h1',
        content: 'Calcula ∂P/∂y y ∂Q/∂x',
        cost: 5,
      },
      {
        id: 'field-2-h2',
        content: 'P = -y → ∂P/∂y = -1; Q = x → ∂Q/∂x = 1',
        cost: 10,
      },
      {
        id: 'field-2-h3',
        content: 'Como -1 ≠ 1, el campo no es conservativo',
        cost: 15,
      },
    ],
    points: 130,
    difficulty: 'beginner',
  },
  {
    id: 'field-3',
    objectiveId: '5',
    scenario: 'field-inspector',
    statement: 'Encuentra la función potencial de F⃗(x,y) = (y*cos(xy), x*cos(xy))',
    functionExpression: 'F = (y*cos(x*y), x*cos(x*y))',
    correctAnswer: { conservative: true, potential: 'f(x,y) = sin(xy) + C' },
    hints: [
      {
        id: 'field-3-h1',
        content: 'Primero verifica que sea conservativo',
        cost: 5,
      },
      {
        id: 'field-3-h2',
        content: 'Si es conservativo, integra P respecto a x',
        cost: 10,
      },
      {
        id: 'field-3-h3',
        content: '∫y*cos(xy)dx = sin(xy) + g(y)',
        cost: 15,
      },
    ],
    points: 180,
    difficulty: 'advanced',
  },
];

// Agrupa problemas por objetivo
export function getProblemsByObjective(objectiveId: string): Problem[] {
  return problems.filter((p) => p.objectiveId === objectiveId);
}

// Obtiene un problema específico por ID
export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

// Obtiene problemas por dificultad
export function getProblemsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Problem[] {
  return problems.filter((p) => p.difficulty === difficulty);
}
