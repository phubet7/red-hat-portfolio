import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import ModuleView from '../components/ModuleView'
import { getModule } from '../data/modules'

// Helper component to check URL updates
function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location-display">{location.pathname}</div>
}

describe('ModuleView Integration & Deep Linking', () => {
  const mockModule = getModule('rhel')
  const mockState = {
    completedLessons: {
      'rhel-l1': true,
      'rhel-l2': true,
      'rhel-l3': true,
      'rhel-l4': true,
    },
    quizScore: 85,
    scenarioCompleted: false,
  }

  const renderModuleWithRouter = (initialPath) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/module/:moduleId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={mockState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
              />
            }
          />
          <Route
            path="/module/:moduleId/:tabId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={mockState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
              />
            }
          />
          <Route
            path="/module/:moduleId/learn/:lessonId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={mockState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders lesson tab by default and matches current lesson from URL', () => {
    renderModuleWithRouter('/module/rhel/learn/rhel-l2')

    // RHEL L2 title should show up
    expect(screen.getByRole('heading', { level: 2, name: 'RHEL ในสภาวะตลาด VMware Migration' })).toBeInTheDocument()
    expect(screen.getByTestId('location-display')).toHaveTextContent('/module/rhel/learn/rhel-l2')

    // Learn tab should be selected
    const learnTab = screen.getByRole('tab', { name: /บทเรียน/ })
    expect(learnTab).toHaveAttribute('aria-selected', 'true')
  })

  it('navigates to next lesson URL when clicking Next button', () => {
    renderModuleWithRouter('/module/rhel/learn/rhel-l1')

    const nextBtn = screen.getByText('บทถัดไป →')
    fireEvent.click(nextBtn)

    expect(screen.getByTestId('location-display')).toHaveTextContent('/module/rhel/learn/rhel-l2')
  })

  it('navigates to quiz tab URL when clicking tabs', () => {
    renderModuleWithRouter('/module/rhel')

    const quizTab = screen.getByRole('tab', { name: /แบบทดสอบ/ })
    fireEvent.click(quizTab)

    expect(screen.getByTestId('location-display')).toHaveTextContent('/module/rhel/quiz')
  })

  it('navigates via arrow keys on the tab list (keyboard navigation)', () => {
    renderModuleWithRouter('/module/rhel/quiz')

    const quizTab = screen.getByRole('tab', { name: /แบบทดสอบ/ })
    quizTab.focus()

    // Press ArrowRight to move from quiz to scenario tab
    fireEvent.keyDown(quizTab, { key: 'ArrowRight' })
    expect(screen.getByTestId('location-display')).toHaveTextContent('/module/rhel/scenario')
  })

  it('redirects to first incomplete lesson if trying to access quiz tab without completing all lessons', () => {
    // Override state with incomplete lessons
    const incompleteState = {
      completedLessons: { 'rhel-l1': true },
      quizScore: null,
      scenarioCompleted: false,
    }

    render(
      <MemoryRouter initialEntries={['/module/rhel/quiz']}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/module/:moduleId/:tabId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={incompleteState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
              />
            }
          />
          <Route
            path="/module/:moduleId/learn/:lessonId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={incompleteState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Should redirect to rhel-l2 (first incomplete lesson after rhel-l1)
    expect(screen.getByTestId('location-display')).toHaveTextContent('/module/rhel/learn/rhel-l2')
  })

  it('resets progress successfully when clicking the local reset button in ModuleView', () => {
    const onResetModule = vi.fn()
    window.confirm = () => true

    render(
      <MemoryRouter initialEntries={['/module/rhel/scenario']}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/module/:moduleId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={mockState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
                onResetModule={onResetModule}
              />
            }
          />
          <Route
            path="/module/:moduleId/:tabId"
            element={
              <ModuleView
                module={mockModule}
                moduleState={mockState}
                onBack={vi.fn()}
                onLessonComplete={vi.fn()}
                onQuizScore={vi.fn()}
                onScenarioComplete={vi.fn()}
                onResetModule={onResetModule}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    const resetBtn = screen.getByText('ล้างความคืบหน้าเฉพาะโมดูลนี้')
    expect(resetBtn).toBeInTheDocument()
    fireEvent.click(resetBtn)
    expect(onResetModule).toHaveBeenCalledWith('rhel')
  })
})
