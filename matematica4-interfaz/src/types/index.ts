/**
 * Tipos TypeScript para Matemática IV - Interfaz Educativa
 */

// Tipos de objetivos del curso
export type ObjectiveId = '1' | '2' | '3' | '4' | '5';

// Tipos de escenarios
export type ScenarioType =
  | 'limit-explorer'
  | 'derivative-lab'
  | 'extreme-hunter'
  | 'gradient-navigator'
  | 'field-inspector';

// Dificultad de problemas
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Sistema de pistas
export interface Hint {
  id: string;
  content: string;
  cost: number;
}

// Estructura de un problema
export interface Problem {
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

// Progreso del usuario
export interface UserProgress {
  userId: string;
  completedObjectives: ObjectiveId[];
  scenarioProgress: Record<ScenarioType, number>;
  achievements: string[];
  totalPoints: number;
  problemsCompleted: string[];
}

// Logros/Insignias
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Información de un objetivo
export interface Objective {
  id: ObjectiveId;
  title: string;
  description: string;
  scenario: ScenarioType;
  icon: string;
  color: string;
}

// Estado de un problema (para el estudiante)
export type ProblemStatus = 'locked' | 'available' | 'in-progress' | 'completed';

// Intento de resolución
export interface ProblemAttempt {
  problemId: string;
  attempts: number;
  hintsUsed: number[];
  startedAt: Date;
  completedAt?: Date;
  score: number;
  isCorrect: boolean;
}
