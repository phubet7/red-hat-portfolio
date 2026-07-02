// ============================================================
// useProgress — progress tracking via localStorage
// ------------------------------------------------------------
// Tracks per-module:
//   - completedLessons: { [lessonId]: true }
//   - quizScore: number | null  (best score, 0-100)
//   - scenarioCompleted: boolean
//   - lastActivity: timestamp
//
// A module is "complete" when:
//   - all lessons viewed + quiz passed (>= passingScore) + scenario done
// ============================================================

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'rh-partner-learning-progress-v1'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota / privacy mode errors */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  // keep persisted
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // cross-tab sync
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setProgress(loadProgress())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const ensureModule = useCallback((prev, moduleId) => {
    if (prev[moduleId]) return prev[moduleId]
    return {
      completedLessons: {},
      quizScore: null,
      quizAttempts: 0,
      scenarioCompleted: false,
      lastActivity: null,
    }
  }, [])

  const markLessonComplete = useCallback((moduleId, lessonId) => {
    setProgress((prev) => {
      const moduleState = ensureModule(prev, moduleId)
      return {
        ...prev,
        [moduleId]: {
          ...moduleState,
          completedLessons: { ...moduleState.completedLessons, [lessonId]: true },
          lastActivity: Date.now(),
        },
      }
    })
  }, [ensureModule])

  const recordQuizScore = useCallback((moduleId, score, answers = []) => {
    setProgress((prev) => {
      const moduleState = ensureModule(prev, moduleId)
      const best =
        moduleState.quizScore == null ? score : Math.max(moduleState.quizScore, score)
      return {
        ...prev,
        [moduleId]: {
          ...moduleState,
          quizScore: best,
          quizAttempts: moduleState.quizAttempts + 1,
          lastQuizAttempt: { score, answers, timestamp: Date.now() },
          lastActivity: Date.now(),
        },
      }
    })
  }, [ensureModule])

  const markScenarioComplete = useCallback((moduleId) => {
    setProgress((prev) => {
      const moduleState = ensureModule(prev, moduleId)
      return {
        ...prev,
        [moduleId]: {
          ...moduleState,
          scenarioCompleted: true,
          lastActivity: Date.now(),
        },
      }
    })
  }, [ensureModule])

  const resetModule = useCallback((moduleId) => {
    setProgress((prev) => {
      const next = { ...prev }
      delete next[moduleId]
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    setProgress({})
  }, [])

  return {
    progress,
    markLessonComplete,
    recordQuizScore,
    markScenarioComplete,
    resetModule,
    resetAll,
  }
}

// ---------- Derived helpers ----------

export function getModuleProgress(module, moduleState) {
  if (!module) return { percent: 0, complete: false, lessonsDone: 0 }
  const totalLessons = module.lessons.length
  const lessonsDone = moduleState
    ? module.lessons.filter((l) => moduleState.completedLessons?.[l.id]).length
    : 0
  const quizPassed = moduleState ? (moduleState.quizScore ?? 0) >= module.quiz.passingScore : false
  const scenarioDone = moduleState ? moduleState.scenarioCompleted : false

  // 4 checkpoints: lessons (50% weight), quiz (25%), scenario (25%)
  const lessonPct = (lessonsDone / totalLessons) * 50
  const quizPct = quizPassed ? 25 : (moduleState?.quizScore != null && moduleState.quizScore > 0) ? (moduleState.quizScore / 100) * 25 : 0
  const scenarioPct = scenarioDone ? 25 : 0
  const percent = Math.round(lessonPct + quizPct + scenarioPct)
  const complete = lessonsDone === totalLessons && quizPassed && scenarioDone

  return { percent, complete, lessonsDone, totalLessons, quizPassed, scenarioDone }
}

export function getOverallProgress(modules, progress) {
  let total = 0
  let done = 0
  for (const m of modules) {
    total += 100
    const mp = getModuleProgress(m, progress[m.id])
    done += mp.percent
  }
  return total === 0 ? 0 : Math.round((done / total) * 100)
}
