import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from '../hooks/useProgress'

describe('useProgress hook', () => {
  let store = {}

  beforeEach(() => {
    store = {}
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString() }),
      clear: vi.fn(() => { store = {} }),
      removeItem: vi.fn((key) => { delete store[key] })
    }
    
    vi.stubGlobal('localStorage', localStorageMock)
    vi.restoreAllMocks()
  })

  it('loads empty initial state when localStorage is clean', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.progress).toEqual({})
  })

  it('loads progress from localStorage if it exists', () => {
    const mockData = {
      rhel: {
        completedLessons: { 'rhel-l1': true },
        quizScore: 80,
        quizAttempts: 1,
        scenarioCompleted: true,
        lastActivity: 123456,
      },
    }
    store['rh-partner-learning-progress-v1'] = JSON.stringify(mockData)

    const { result } = renderHook(() => useProgress())
    expect(result.current.progress).toEqual(mockData)
  })

  it('marks lesson complete correctly', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markLessonComplete('rhel', 'rhel-l1')
    })

    expect(result.current.progress.rhel.completedLessons['rhel-l1']).toBe(true)
    expect(result.current.progress.rhel.lastActivity).not.toBeNull()
  })

  it('records quiz score correctly, keeping the best one and storing lastQuizAttempt', () => {
    const { result } = renderHook(() => useProgress())

    const mockAnswers = [{ qid: 'q1', selected: 1, correct: true }]

    act(() => {
      result.current.recordQuizScore('rhel', 70, mockAnswers)
    })
    expect(result.current.progress.rhel.quizScore).toBe(70)
    expect(result.current.progress.rhel.quizAttempts).toBe(1)
    expect(result.current.progress.rhel.lastQuizAttempt.score).toBe(70)
    expect(result.current.progress.rhel.lastQuizAttempt.answers).toEqual(mockAnswers)

    // Lower score should not overwrite higher score, but should update lastQuizAttempt
    act(() => {
      result.current.recordQuizScore('rhel', 50, [])
    })
    expect(result.current.progress.rhel.quizScore).toBe(70)
    expect(result.current.progress.rhel.quizAttempts).toBe(2)
    expect(result.current.progress.rhel.lastQuizAttempt.score).toBe(50)
    expect(result.current.progress.rhel.lastQuizAttempt.answers).toEqual([])

    // Higher score should overwrite lower score
    act(() => {
      result.current.recordQuizScore('rhel', 90, mockAnswers)
    })
    expect(result.current.progress.rhel.quizScore).toBe(90)
    expect(result.current.progress.rhel.quizAttempts).toBe(3)
    expect(result.current.progress.rhel.lastQuizAttempt.score).toBe(90)
    expect(result.current.progress.rhel.lastQuizAttempt.answers).toEqual(mockAnswers)
  })

  it('marks scenario complete correctly', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markScenarioComplete('rhel')
    })

    expect(result.current.progress.rhel.scenarioCompleted).toBe(true)
  })

  it('resets a single module progress correctly', () => {
    const mockData = {
      rhel: { completedLessons: { 'rhel-l1': true } },
      openshift: { completedLessons: { 'os-l1': true } },
    }
    store['rh-partner-learning-progress-v1'] = JSON.stringify(mockData)

    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.resetModule('rhel')
    })

    expect(result.current.progress.rhel).toBeUndefined()
    expect(result.current.progress.openshift).toBeDefined()
  })

  it('resets all progress correctly', () => {
    const mockData = {
      rhel: { completedLessons: { 'rhel-l1': true } },
    }
    store['rh-partner-learning-progress-v1'] = JSON.stringify(mockData)

    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.resetAll()
    })

    expect(result.current.progress).toEqual({})
  })
})
