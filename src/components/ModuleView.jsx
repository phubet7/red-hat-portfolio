import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Quiz from './Quiz'
import Scenario from './Scenario'
import { getModuleProgress } from '../hooks/useProgress'

const TABS = [
  { key: 'learn', label: 'บทเรียน', icon: '📖' },
  { key: 'quiz', label: 'แบบทดสอบ', icon: '✍' },
  { key: 'scenario', label: 'กรณีศึกษา', icon: '🎯' },
]

export default function ModuleView({
  module,
  moduleState,
  onBack,
  onLessonComplete,
  onQuizScore,
  onScenarioComplete,
}) {
  const { tabId, lessonId } = useParams()
  const navigate = useNavigate()

  // Determine current tab: if lessonId exists, it's implicitly 'learn'
  const tab = lessonId ? 'learn' : (tabId || 'learn')

  // Find index of the active lesson
  let activeLessonIdx = 0
  if (lessonId) {
    const idx = module.lessons.findIndex((l) => l.id === lessonId)
    if (idx !== -1) {
      activeLessonIdx = idx
    }
  }

  const mp = getModuleProgress(module, moduleState)

  const lesson = module.lessons[activeLessonIdx]
  const lessonDone = !!moduleState?.completedLessons?.[lesson.id]
  const allLessonsViewed = module.lessons.every(
    (l) => moduleState?.completedLessons?.[l.id],
  )

  const quizLocked = !allLessonsViewed
  const scenarioLocked = !mp.quizPassed
  const hasLocalProgress = !!moduleState && (
    (!!moduleState.completedLessons && Object.keys(moduleState.completedLessons).length > 0) ||
    moduleState.quizScore !== null ||
    moduleState.scenarioCompleted
  )

  const tabRefs = {
    learn: useRef(null),
    quiz: useRef(null),
    scenario: useRef(null),
  }

  // ---------- Route Guards ----------
  useEffect(() => {
    if (tab === 'quiz' && quizLocked) {
      const firstIncomplete = module.lessons.find((l) => !moduleState?.completedLessons?.[l.id])
      const targetId = firstIncomplete ? firstIncomplete.id : module.lessons[0].id
      navigate(`/module/${module.id}/learn/${targetId}`, { replace: true })
    } else if (tab === 'scenario' && scenarioLocked) {
      navigate(`/module/${module.id}/quiz`, { replace: true })
    }
  }, [tab, quizLocked, scenarioLocked, module.id, navigate, module.lessons, moduleState?.completedLessons])

  // ---------- Celebration Trigger ----------
  useEffect(() => {
    if (mp.complete) {
      import('canvas-confetti').then((module) => {
        const confetti = module.default
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        })
      }).catch(() => {})
    }
  }, [mp.complete])

  function changeTab(newTab) {
    navigate(`/module/${module.id}/${newTab}`)
    window.scrollTo({ top: 0 }) // Make instant and snappy
  }

  function changeLesson(idx) {
    const targetLesson = module.lessons[idx]
    navigate(`/module/${module.id}/learn/${targetLesson.id}`)
    window.scrollTo({ top: 0 }) // Make instant and snappy
  }

  function nextLesson() {
    if (!lessonDone) onLessonComplete(module.id, lesson.id)
    if (activeLessonIdx < module.lessons.length - 1) {
      changeLesson(activeLessonIdx + 1)
    } else {
      changeTab('quiz')
    }
  }

  function prevLesson() {
    if (activeLessonIdx > 0) {
      changeLesson(activeLessonIdx - 1)
    }
  }

  function handleTabKeyDown(e, currentKey) {
    const keys = TABS.map((t) => t.key)
    const currentIdx = keys.indexOf(currentKey)
    let nextIdx = currentIdx

    const direction = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0

    if (direction !== 0) {
      e.preventDefault()
      let checkIdx = currentIdx
      for (let i = 0; i < keys.length; i++) {
        checkIdx = (checkIdx + direction + keys.length) % keys.length
        const targetKey = keys[checkIdx]
        const isLocked = (targetKey === 'quiz' && quizLocked) || (targetKey === 'scenario' && scenarioLocked)
        if (!isLocked) {
          nextIdx = checkIdx
          break
        }
      }
    } else if (e.key === 'Home') {
      nextIdx = 0
      e.preventDefault()
    } else if (e.key === 'End') {
      e.preventDefault()
      for (let i = keys.length - 1; i >= 0; i--) {
        const targetKey = keys[i]
        const isLocked = (targetKey === 'quiz' && quizLocked) || (targetKey === 'scenario' && scenarioLocked)
        if (!isLocked) {
          nextIdx = i
          break
        }
      }
    }

    if (nextIdx !== currentIdx) {
      const nextKey = keys[nextIdx]
      changeTab(nextKey)
      setTimeout(() => {
        tabRefs[nextKey].current?.focus()
      }, 0)
    }
  }

  return (
    <div className="fade-up">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="breadcrumbs">
        <ol className="breadcrumbs__list">
          <li className="breadcrumbs__item">
            <button className="breadcrumbs__link" onClick={onBack}>
              หน้าหลัก
            </button>
          </li>
          <li className="breadcrumbs__item">
            <button className="breadcrumbs__link" onClick={() => changeTab('learn')}>
              {module.shortTitle}
            </button>
          </li>
          <li className="breadcrumbs__item" aria-current="page">
            <span className="breadcrumbs__current">
              {TABS.find((t) => t.key === tab)?.label || 'บทเรียน'}
            </span>
          </li>
        </ol>
      </nav>

      {/* Module header */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-5)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 5, background: module.accent }} />
        <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: '2.6rem' }}>{module.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="chip chip--red" style={{ marginBottom: 6 }}>
                {module.category}
              </div>
              <h1 style={{ fontSize: '1.7rem', marginBottom: 4 }}>{module.title}</h1>
              <p className="muted" style={{ fontSize: '0.95rem' }}>
                {module.tagline}
              </p>
            </div>
          </div>

          {/* progress strip */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                marginBottom: 6,
              }}
            >
              <span className="muted">ความคืบหน้าของโมดูล</span>
              <span style={{ fontWeight: 700 }}>{mp.percent}%</span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={mp.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`ความคืบหน้าของโมดูล: ${mp.percent}%`}
            >
              <div className="progress__fill" style={{ width: `${mp.percent}%` }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              {mp.complete && (
                <div
                  className="chip chip--done"
                  style={{ fontSize: '0.85rem' }}
                >
                  ✓ คุณทำโมดูลนี้สำเร็จแล้ว
                </div>
              )}
            </div>
            {hasLocalProgress && (
              <button
                className="btn btn--ghost"
                onClick={() => {
                  if (confirm('คุณต้องการล้างความคืบหน้าของโมดูลนี้หรือไม่? คะแนนและประวัติบทเรียนของโมดูลนี้จะถูกลบทั้งหมด')) {
                    onResetModule(module.id)
                    changeTab('learn')
                  }
                }}
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-muted)'
                }}
              >
                ล้างความคืบหน้าเฉพาะโมดูลนี้
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="กิจกรรมของโมดูล"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-5)',
          borderBottom: '2px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key
          const isLocked = (t.key === 'quiz' && quizLocked) || (t.key === 'scenario' && scenarioLocked)
          let badge = null
          if (t.key === 'quiz' && mp.quizPassed) {
            badge = <span className="chip chip--done" style={{ marginLeft: 6 }}>ผ่าน</span>
          }
          if (t.key === 'scenario' && mp.scenarioDone) {
            badge = <span className="chip chip--done" style={{ marginLeft: 6 }}>เสร็จแล้ว</span>
          }
          return (
            <button
              key={t.key}
              ref={tabRefs[t.key]}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.key}`}
              id={`tab-${t.key}`}
              tabIndex={active ? 0 : -1}
              disabled={isLocked}
              onClick={() => !isLocked && changeTab(t.key)}
              onKeyDown={(e) => handleTabKeyDown(e, t.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-3) var(--space-4)',
                fontSize: '0.95rem',
                fontWeight: active ? 700 : 500,
                color: active
                  ? 'var(--rh-black)'
                  : isLocked
                    ? 'var(--rh-gray-400)'
                    : 'var(--text-muted)',
                borderBottom: active ? '3px solid var(--rh-red)' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.55 : 1,
              }}
            >
              <span>{isLocked ? '🔒' : t.icon}</span>
              {t.label}
              {badge}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div
        id="panel-learn"
        role="tabpanel"
        aria-labelledby="tab-learn"
        hidden={tab !== 'learn'}
      >
        {tab === 'learn' && (
          <div className="container-tight fade-up">
            {/* Lesson sidebar / stepper */}
            <div className="stepper">
              {module.lessons.map((l, i) => {
                const done = !!moduleState?.completedLessons?.[l.id]
                const active = i === activeLessonIdx
                return (
                  <button
                    key={l.id}
                    onClick={() => changeLesson(i)}
                    className={`stepper__btn ${active ? 'stepper__btn--active' : ''}`}
                  >
                    <span
                      className={`stepper__badge ${
                        done
                          ? 'stepper__badge--done'
                          : active
                            ? 'stepper__badge--active'
                            : ''
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    {l.title}
                  </button>
                )
              })}
            </div>

            <LessonContent lesson={lesson} objectives={module.learningObjectives} />

            {/* Nav buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border)',
                gap: 'var(--space-3)',
              }}
            >
              <button
                className="btn btn--ghost"
                onClick={prevLesson}
                disabled={activeLessonIdx === 0}
              >
                ← บทก่อนหน้า
              </button>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  บทที่ {activeLessonIdx + 1} / {module.lessons.length}
                </div>
                <button className="btn btn--primary" onClick={nextLesson}>
                  {activeLessonIdx < module.lessons.length - 1
                    ? 'บทถัดไป →'
                    : 'ไปยังแบบทดสอบ →'}
                </button>
              </div>
            </div>

            {allLessonsViewed && activeLessonIdx === module.lessons.length - 1 && (
              <div
                style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  background: 'var(--success-bg)',
                  border: '1px solid #c6e4c8',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.9rem',
                  color: 'var(--success)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                ✓ คุณดูบทเรียนครบทั้งหมดแล้ว พร้อมทำแบบทดสอบได้เลย!
              </div>
            )}
          </div>
        )}
      </div>

      <div
        id="panel-quiz"
        role="tabpanel"
        aria-labelledby="tab-quiz"
        hidden={tab !== 'quiz'}
      >
        {tab === 'quiz' && (
          <Quiz
            module={module}
            moduleState={moduleState}
            onComplete={onQuizScore}
          />
        )}
      </div>

      <div
        id="panel-scenario"
        role="tabpanel"
        aria-labelledby="tab-scenario"
        hidden={tab !== 'scenario'}
      >
        {tab === 'scenario' && (
          <Scenario
            module={module}
            onComplete={onScenarioComplete}
          />
        )}
      </div>
    </div>
  )
}

// ---------- Lesson content renderer ----------

function LessonContent({ lesson, objectives }) {
  return (
    <article>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontSize: '1.5rem', flex: 1 }}>{lesson.title}</h2>
        <span className="chip">⏱ ~{lesson.minutes} นาที</span>
      </div>

      {lesson.sections.map((s, i) => {
        if (s.type === 'heading') {
          return (
            <h3 key={i} style={{ fontSize: '1.18rem', margin: 'var(--space-5) 0 var(--space-3)' }}>
              {s.text}
            </h3>
          )
        }
        if (s.type === 'paragraph') {
          return (
            <p key={i} style={{ marginBottom: 'var(--space-3)', lineHeight: 1.8 }}>
              {s.text}
            </p>
          )
        }
        if (s.type === 'code') {
          return (
            <div key={i} className="terminal-console">
              <div className="terminal-console__header">
                <span className="terminal-console__dot terminal-console__dot--close" />
                <span className="terminal-console__dot terminal-console__dot--min" />
                <span className="terminal-console__dot terminal-console__dot--max" />
                <span className="terminal-console__title">{s.title || 'bash'}</span>
              </div>
              <div className="terminal-console__screen">
                {s.lines.map((line, idx) => {
                  if (line.type === 'input') {
                    return (
                      <div key={idx}>
                        <span className="terminal-console__prompt">$</span>
                        <span className="terminal-console__cmd">{line.text}</span>
                      </div>
                    )
                  }
                  if (line.type === 'output') {
                    return (
                      <div key={idx} className="terminal-console__output">
                        {line.text}
                      </div>
                    )
                  }
                  return <div key={idx}>{line.text}</div>
                })}
              </div>
            </div>
          )
        }
        if (s.type === 'bullets') {
          return (
            <ul key={i} style={{ marginBottom: 'var(--space-4)', lineHeight: 1.8 }}>
              {s.items.map((it, j) => (
                <li key={j} style={{ marginBottom: 'var(--space-2)' }}>
                  {it.bold ? (
                    <>
                      <strong style={{ color: 'var(--rh-black)' }}>{it.bold}:</strong>{' '}
                      {it.text}
                    </>
                  ) : (
                    it.text
                  )}
                </li>
              ))}
            </ul>
          )
        }
        if (s.type === 'callout') {
          const toneStyles = {
            info: { bg: 'var(--rh-red-tint)', border: 'var(--rh-red-tint-2)', color: 'var(--rh-red-dark)' },
            tip: { bg: 'var(--success-bg)', border: '#c6e4c8', color: 'var(--success)' },
          }
          const ts = toneStyles[s.tone] || toneStyles.info
          return (
            <div
              key={i}
              style={{
                background: ts.bg,
                border: `1px solid ${ts.border}`,
                borderLeft: `4px solid ${ts.color}`,
                borderRadius: 'var(--radius)',
                padding: 'var(--space-4) var(--space-5)',
                margin: 'var(--space-4) 0',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: ts.color,
                  marginBottom: 4,
                  fontSize: '0.92rem',
                }}
              >
                {s.tone === 'tip' ? '💡 ' : '📌 '}
                {s.title}
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{s.text}</div>
            </div>
          )
        }
        return null
      })}
    </article>
  )
}
