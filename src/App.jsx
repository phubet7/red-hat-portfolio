import { useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import ModuleView from './components/ModuleView'
import { useProgress } from './hooks/useProgress'
import { getModule } from './data/modules'

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState(null)
  const {
    progress,
    markLessonComplete,
    recordQuizScore,
    markScenarioComplete,
    resetAll,
  } = useProgress()

  const activeModule = activeModuleId ? getModule(activeModuleId) : null

  function goHome() {
    setActiveModuleId(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <Header progress={progress} onHome={goHome} />

      <main>
        {activeModule ? (
          <ModuleView
            module={activeModule}
            moduleState={progress[activeModule.id]}
            onBack={goHome}
            onLessonComplete={markLessonComplete}
            onQuizScore={recordQuizScore}
            onScenarioComplete={markScenarioComplete}
          />
        ) : (
          <Home
            progress={progress}
            onOpenModule={setActiveModuleId}
            onResetAll={resetAll}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--rh-black)',
          color: 'var(--rh-gray-400)',
          padding: 'var(--space-5) var(--space-5)',
          fontSize: '0.82rem',
          borderTop: '3px solid var(--rh-red)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--maxw)',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          <div>
            <strong style={{ color: '#fff' }}>Red Hat Partner Learning</strong> ·
            แพลตฟอร์มการเรียนรู้สำหรับพาร์ตเนอร์
          </div>
          <div className="muted" style={{ color: 'var(--rh-gray-500)' }}>
            เนื้อหาอ้างอิงจากข้อมูลผลิตภัณฑ์สาธารณะของ Red Hat · สำหรับการฝึกอบรม
          </div>
        </div>
      </footer>
    </>
  )
}
