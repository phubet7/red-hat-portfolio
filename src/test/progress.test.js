import { describe, it, expect } from 'vitest'
import { getModuleProgress, getOverallProgress } from '../hooks/useProgress'

// ── Test fixtures ──────────────────────────────────────────────

function makeModule(overrides = {}) {
  return {
    id: 'test',
    title: 'Test Module',
    lessons: [
      { id: 'l1', title: 'L1' },
      { id: 'l2', title: 'L2' },
      { id: 'l3', title: 'L3' },
      { id: 'l4', title: 'L4' },
    ],
    quiz: {
      passingScore: 70,
      questions: Array(5).fill({}),
    },
    scenario: { title: 'Case Study' },
    ...overrides,
  }
}

function makeState(overrides = {}) {
  return {
    completedLessons: {},
    quizScore: null,
    quizAttempts: 0,
    scenarioCompleted: false,
    lastActivity: null,
    ...overrides,
  }
}

// ── getModuleProgress ──────────────────────────────────────────

describe('getModuleProgress', () => {
  const mod = makeModule()

  it('returns 0% when no state exists', () => {
    const result = getModuleProgress(mod, undefined)
    expect(result.percent).toBe(0)
    expect(result.complete).toBe(false)
    expect(result.lessonsDone).toBe(0)
    expect(result.quizPassed).toBe(false)
    expect(result.scenarioDone).toBe(false)
  })

  it('returns 0% when state is empty', () => {
    const result = getModuleProgress(mod, makeState())
    expect(result.percent).toBe(0)
    expect(result.complete).toBe(false)
  })

  it('handles null module gracefully', () => {
    const result = getModuleProgress(null, {})
    expect(result.percent).toBe(0)
    expect(result.complete).toBe(false)
  })

  it('counts lessons correctly (50% weight total)', () => {
    // 1 of 4 lessons → 12.5%
    const state = makeState({ completedLessons: { l1: true } })
    const result = getModuleProgress(mod, state)
    expect(result.percent).toBe(13) // Math.round(12.5)
    expect(result.lessonsDone).toBe(1)
    expect(result.totalLessons).toBe(4)

    // 2 of 4 lessons → 25%
    const state2 = makeState({ completedLessons: { l1: true, l2: true } })
    expect(getModuleProgress(mod, state2).percent).toBe(25)

    // all 4 lessons → 50%
    const state4 = makeState({
      completedLessons: { l1: true, l2: true, l3: true, l4: true },
    })
    expect(getModuleProgress(mod, state4).percent).toBe(50)
  })

  it('quiz passed gives 25%', () => {
    const state = makeState({
      completedLessons: {},
      quizScore: 80, // >= 70 passing
    })
    const result = getModuleProgress(mod, state)
    expect(result.quizPassed).toBe(true)
    expect(result.percent).toBe(25)
  })

  it('quiz score below passing gives proportional credit', () => {
    const state = makeState({
      completedLessons: {},
      quizScore: 50, // < 70 passing, 50% of 25 = 12.5
    })
    const result = getModuleProgress(mod, state)
    expect(result.quizPassed).toBe(false)
    expect(result.percent).toBe(13) // Math.round(12.5)
  })

  it('quiz score 0 gives no quiz credit', () => {
    const state = makeState({ quizScore: 0 })
    const result = getModuleProgress(mod, state)
    expect(result.quizPassed).toBe(false)
    expect(result.percent).toBe(0)
  })

  it('scenario done gives 25%', () => {
    const state = makeState({ scenarioCompleted: true })
    expect(getModuleProgress(mod, state).percent).toBe(25)
  })

  it('complete requires ALL three: all lessons + quiz passed + scenario done', () => {
    // Missing scenario
    const s1 = makeState({
      completedLessons: { l1: true, l2: true, l3: true, l4: true },
      quizScore: 80,
      scenarioCompleted: false,
    })
    expect(getModuleProgress(mod, s1).complete).toBe(false)

    // Missing quiz pass
    const s2 = makeState({
      completedLessons: { l1: true, l2: true, l3: true, l4: true },
      quizScore: 60,
      scenarioCompleted: true,
    })
    expect(getModuleProgress(mod, s2).complete).toBe(false)

    // Missing lessons
    const s3 = makeState({
      completedLessons: { l1: true, l2: true },
      quizScore: 80,
      scenarioCompleted: true,
    })
    expect(getModuleProgress(mod, s3).complete).toBe(false)

    // All done
    const s4 = makeState({
      completedLessons: { l1: true, l2: true, l3: true, l4: true },
      quizScore: 70, // exactly at threshold
      scenarioCompleted: true,
    })
    expect(getModuleProgress(mod, s4).complete).toBe(true)
    expect(getModuleProgress(mod, s4).percent).toBe(100)
  })

  it('quiz score exactly at passing threshold counts as passed', () => {
    const state = makeState({ quizScore: 70 })
    expect(getModuleProgress(mod, state).quizPassed).toBe(true)
  })

  it('quiz score one point below passing threshold does not pass', () => {
    const state = makeState({ quizScore: 69 })
    expect(getModuleProgress(mod, state).quizPassed).toBe(false)
  })

  it('works with single-lesson modules', () => {
    const singleMod = makeModule({
      lessons: [{ id: 'solo', title: 'Solo' }],
    })
    const state = makeState({
      completedLessons: { solo: true },
      quizScore: 80,
      scenarioCompleted: true,
    })
    const result = getModuleProgress(singleMod, state)
    expect(result.complete).toBe(true)
    expect(result.percent).toBe(100)
  })

  it('safely handles corrupted completedLessons state object', () => {
    const state = makeState({ completedLessons: undefined })
    const result = getModuleProgress(mod, state)
    expect(result.percent).toBe(0)
    expect(result.lessonsDone).toBe(0)
  })
})

// ── getOverallProgress ────────────────────────────────────────

describe('getOverallProgress', () => {
  const mod1 = makeModule({ id: 'a', lessons: [{ id: 'a1', title: 'A1' }] })
  const mod2 = makeModule({ id: 'b', lessons: [{ id: 'b1', title: 'B1' }] })

  it('returns 0% for empty progress', () => {
    expect(getOverallProgress([mod1, mod2], {})).toBe(0)
  })

  it('returns 0% for empty modules', () => {
    expect(getOverallProgress([], {})).toBe(0)
  })

  it('averages per-module progress correctly', () => {
    // Module a: 100%, Module b: 0% → overall 50%
    const progress = {
      a: makeState({
        completedLessons: { a1: true },
        quizScore: 80,
        scenarioCompleted: true,
      }),
      b: makeState(),
    }
    expect(getOverallProgress([mod1, mod2], progress)).toBe(50)
  })

  it('returns 100% when all modules complete', () => {
    const progress = {
      a: makeState({
        completedLessons: { a1: true },
        quizScore: 80,
        scenarioCompleted: true,
      }),
      b: makeState({
        completedLessons: { b1: true },
        quizScore: 80,
        scenarioCompleted: true,
      }),
    }
    expect(getOverallProgress([mod1, mod2], progress)).toBe(100)
  })
})
