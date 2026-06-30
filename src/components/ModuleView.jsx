import { useEffect, useState } from 'react'
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
  const [tab, setTab] = useState('learn')
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)

  const mp = getModuleProgress(module, moduleState)

  // reset to first lesson when module changes
  useEffect(() => {
    setTab('learn')
    setActiveLessonIdx(0)
  }, [module.id])

  const lesson = module.lessons[activeLessonIdx]
  const lessonDone = !!moduleState?.completedLessons?.[lesson.id]
  const allLessonsViewed = module.lessons.every(
    (l) => moduleState?.completedLessons?.[l.id],
  )

  function nextLesson() {
    if (!lessonDone) onLessonComplete(module.id, lesson.id)
    if (activeLessonIdx < module.lessons.length - 1) {
      setActiveLessonIdx((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // finished last lesson → go to quiz tab
      setTab('quiz')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function prevLesson() {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx((i) => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="fade-up">
      {/* Back */}
      <button
        onClick={onBack}
        className="btn btn--ghost"
        style={{ marginBottom: 'var(--space-4)', padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}
      >
        ← กลับสู่หน้าหลัก
      </button>

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
            <div className="progress">
              <div className="progress__fill" style={{ width: `${mp.percent}%` }} />
            </div>
          </div>

          {mp.complete && (
            <div
              className="chip chip--done"
              style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem' }}
            >
              ✓ คุณทำโมดูลนี้สำเร็จแล้ว
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
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
              onClick={() => setTab(t.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-3) var(--space-4)',
                fontSize: '0.95rem',
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--rh-black)' : 'var(--text-muted)',
                borderBottom: active ? '3px solid var(--rh-red)' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span>{t.icon}</span>
              {t.label}
              {badge}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {tab === 'learn' && (
        <div className="container-tight fade-up">
          {/* Lesson sidebar / stepper */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-5)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-2)',
            }}
          >
            {module.lessons.map((l, i) => {
              const done = !!moduleState?.completedLessons?.[l.id]
              const active = i === activeLessonIdx
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonIdx(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    border: active
                      ? '1px solid var(--rh-red)'
                      : '1px solid var(--border)',
                    background: active ? 'var(--rh-red-tint)' : '#fff',
                    color: active ? 'var(--rh-red-dark)' : 'var(--text)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      background: done ? 'var(--success)' : active ? 'var(--rh-red)' : 'var(--rh-gray-200)',
                      color: done || active ? '#fff' : 'var(--text-muted)',
                      fontWeight: 700,
                    }}
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

      {tab === 'quiz' && (
        <Quiz
          module={module}
          moduleState={moduleState}
          onComplete={onQuizScore}
        />
      )}

      {tab === 'scenario' && (
        <Scenario
          module={module}
          onComplete={onScenarioComplete}
        />
      )}
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
