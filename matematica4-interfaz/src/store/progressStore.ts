/**
 * Store de Zustand para el progreso del usuario
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, ObjectiveId, ScenarioType, ProblemAttempt } from '../types';

interface ProgressStore extends UserProgress {
  // Acciones
  completeObjective: (objectiveId: ObjectiveId) => void;
  updateScenarioProgress: (scenario: ScenarioType, progress: number) => void;
  addAchievement: (achievementId: string) => void;
  addPoints: (points: number) => void;
  completeProblem: (problemId: string, attempt: ProblemAttempt) => void;
  resetProgress: () => void;
}

const initialState: UserProgress = {
  userId: 'student-' + Date.now(),
  completedObjectives: [],
  scenarioProgress: {
    'limit-explorer': 0,
    'derivative-lab': 0,
    'extreme-hunter': 0,
    'gradient-navigator': 0,
    'field-inspector': 0,
  },
  achievements: [],
  totalPoints: 0,
  problemsCompleted: [],
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      ...initialState,

      completeObjective: (objectiveId) =>
        set((state) => ({
          completedObjectives: state.completedObjectives.includes(objectiveId)
            ? state.completedObjectives
            : [...state.completedObjectives, objectiveId],
        })),

      updateScenarioProgress: (scenario, progress) =>
        set((state) => ({
          scenarioProgress: {
            ...state.scenarioProgress,
            [scenario]: progress,
          },
        })),

      addAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.includes(achievementId)
            ? state.achievements
            : [...state.achievements, achievementId],
        })),

      addPoints: (points) =>
        set((state) => ({
          totalPoints: state.totalPoints + points,
        })),

      completeProblem: (problemId, attempt) =>
        set((state) => ({
          problemsCompleted: state.problemsCompleted.includes(problemId)
            ? state.problemsCompleted
            : [...state.problemsCompleted, problemId],
          totalPoints: state.totalPoints + attempt.score,
        })),

      resetProgress: () => set(initialState),
    }),
    {
      name: 'matematica4-progress',
    }
  )
);
