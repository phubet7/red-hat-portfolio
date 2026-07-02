import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App Flow & Reset progress crash test', () => {
  let store = {}

  beforeEach(() => {
    store = {}
    const localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString() }),
      clear: vi.fn(() => { store = {} }),
      removeItem: vi.fn((key) => { delete store[key] })
    }
    vi.stubGlobal('localStorage', localStorageMock)
  })

  it('renders App, passes module 1, resets progress and verifies stability', async () => {
    const mockProgress = {
      rhel: {
        completedLessons: {
          'rhel-l1': true,
          'rhel-l2': true,
          'rhel-l3': true,
          'rhel-l4': true,
        },
        quizScore: 90,
        quizAttempts: 1,
        lastQuizAttempt: {
          score: 90,
          answers: [
            { qid: 'rhel-q1', selected: 1, correct: true },
            { qid: 'rhel-q2', selected: 1, correct: true },
            { qid: 'rhel-q3', selected: 1, correct: true },
            { qid: 'rhel-q4', selected: 0, correct: true },
            { qid: 'rhel-q5', selected: 1, correct: true },
          ],
          timestamp: Date.now(),
        },
        scenarioCompleted: true,
        lastActivity: Date.now(),
      },
    }

    store['rh-partner-learning-progress-v1'] = JSON.stringify(mockProgress)

    render(
      <MemoryRouter initialEntries={['/module/rhel/scenario']}>
        <App />
      </MemoryRouter>
    )

    // Confirm RHEL title shows
    expect(screen.getByText('Red Hat Enterprise Linux')).toBeInTheDocument()

    // Reset module progress
    window.confirm = () => true
    const resetBtn = screen.getByText('ล้างความคืบหน้าเฉพาะโมดูลนี้')
    expect(resetBtn).toBeInTheDocument()

    // Click it
    await act(async () => {
      fireEvent.click(resetBtn)
    })

    // Expect to be redirected to first lesson
    expect(screen.getByRole('heading', { level: 2, name: 'CentOS Linux 7 EOL และโอกาสการย้ายระบบ' })).toBeInTheDocument()
  })
})
