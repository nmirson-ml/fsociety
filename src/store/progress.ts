import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, SkillLevel } from '@/types'

interface ProgressStore extends UserProgress {
  completeLesson: (lessonId: string, xp: number) => void
  /** Alias kept for backwards compat — same as markObjectiveDone */
  completeObjective: (scenarioId: string, objectiveId: string) => void
  markObjectiveDone: (scenarioId: string, objectiveId: string) => void
  getScenarioProgress: (scenarioId: string) => { completed: string[] }
  resetProgress: () => void
}

const initialProgress: UserProgress = {
  completedLessons: [],
  completedObjectives: {},
  totalXP: 0,
  currentLevel: 0,
  streakDays: 0,
  lastActiveDate: '',
}

function xpToLevel(xp: number): SkillLevel {
  if (xp >= 5000) return 7
  if (xp >= 3000) return 6
  if (xp >= 2000) return 5
  if (xp >= 1200) return 4
  if (xp >= 700) return 3
  if (xp >= 300) return 2
  if (xp >= 100) return 1
  return 0
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialProgress,

      completeLesson: (lessonId, xp) => {
        const state = get()
        if (state.completedLessons.includes(lessonId)) return
        const newXP = state.totalXP + xp
        set({
          completedLessons: [...state.completedLessons, lessonId],
          totalXP: newXP,
          currentLevel: xpToLevel(newXP),
          lastActiveDate: new Date().toISOString(),
        })
      },

      markObjectiveDone: (scenarioId, objectiveId) => {
        const state = get()
        const existing = state.completedObjectives[scenarioId] ?? []
        if (existing.includes(objectiveId)) return
        set({
          completedObjectives: {
            ...state.completedObjectives,
            [scenarioId]: [...existing, objectiveId],
          },
        })
      },

      completeObjective: (scenarioId, objectiveId) => {
        get().markObjectiveDone(scenarioId, objectiveId)
      },

      getScenarioProgress: (scenarioId) => {
        const state = get()
        return { completed: state.completedObjectives[scenarioId] ?? [] }
      },

      resetProgress: () => set(initialProgress),
    }),
    {
      name: 'cybered-progress',
    }
  )
)
