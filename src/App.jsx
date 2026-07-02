import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import ModuleView from './components/ModuleView'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { useProgress } from './hooks/useProgress'
import { getModule } from './data/modules'

function ModuleViewWrapper({
  progress,
  onLessonComplete,
  onQuizScore,
  onScenarioComplete,
  onResetModule,
  onBack,
}) {
  const { moduleId } = useParams()
  const activeModule = getModule(moduleId)

  if (!activeModule) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
        <h2>ไม่พบโมดูลที่ต้องการ</h2>
        <button className="btn btn--primary" onClick={onBack}>
          กลับสู่หน้าหลัก
        </button>
      </div>
    )
  }

  return (
    <ModuleView
      module={activeModule}
      moduleState={progress[activeModule.id]}
      onBack={onBack}
      onLessonComplete={onLessonComplete}
      onQuizScore={onQuizScore}
      onScenarioComplete={onScenarioComplete}
      onResetModule={onResetModule}
    />
  )
}

export default function App() {
  const navigate = useNavigate()
  const {
    progress,
    markLessonComplete,
    recordQuizScore,
    markScenarioComplete,
    resetModule,
    resetAll,
  } = useProgress()

  function goHome() {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header progress={progress} onHome={goHome} />

      <ErrorBoundary onReset={resetAll}>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  progress={progress}
                  onOpenModule={(id) => {
                    navigate(`/module/${id}`)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  onResetAll={resetAll}
                />
              }
            />
            <Route
              path="/module/:moduleId"
              element={
                <ModuleViewWrapper
                  progress={progress}
                  onLessonComplete={markLessonComplete}
                  onQuizScore={recordQuizScore}
                  onScenarioComplete={markScenarioComplete}
                  onResetModule={resetModule}
                  onBack={goHome}
                />
              }
            />
            <Route
              path="/module/:moduleId/:tabId"
              element={
                <ModuleViewWrapper
                  progress={progress}
                  onLessonComplete={markLessonComplete}
                  onQuizScore={recordQuizScore}
                  onScenarioComplete={markScenarioComplete}
                  onResetModule={resetModule}
                  onBack={goHome}
                />
              }
            />
            <Route
              path="/module/:moduleId/learn/:lessonId"
              element={
                <ModuleViewWrapper
                  progress={progress}
                  onLessonComplete={markLessonComplete}
                  onQuizScore={recordQuizScore}
                  onScenarioComplete={markScenarioComplete}
                  onResetModule={resetModule}
                  onBack={goHome}
                />
              }
            />
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <h2>ไม่พบหน้าเว็บที่คุณต้องการ</h2>
                  <button className="btn btn--primary" onClick={goHome} style={{ marginTop: 'var(--space-3)' }}>
                    กลับสู่หน้าหลัก
                  </button>
                </div>
              }
            />
          </Routes>
        </main>
      </ErrorBoundary>

      <Footer />
    </>
  )
}
