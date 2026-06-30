import { useState } from 'react'
import { modules } from '../data/modules'
import { getModuleProgress, getOverallProgress } from '../hooks/useProgress'

export default function Home({ progress, onOpenModule, onResetAll }) {
  const overall = getOverallProgress(modules, progress)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const hasProgress = overall > 0

  function handleReset() {
    onResetAll()
    setShowResetConfirm(false)
  }

  return (
    <div className="fade-up">
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #151515 0%, #2b2b2b 60%, #3a0a0a 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-7) var(--space-6)',
          marginBottom: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-40px',
            width: '220px',
            height: '220px',
            background: 'var(--rh-red)',
            opacity: 0.18,
            borderRadius: '50%',
            filter: 'blur(20px)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--rh-red)',
              marginBottom: 'var(--space-2)',
            }}
          >
            แพลตฟอร์มการเรียนรู้สำหรับพาร์ตเนอร์
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: '2.1rem',
              fontWeight: 800,
              marginBottom: 'var(--space-3)',
              lineHeight: 1.15,
              maxWidth: 620,
            }}
          >
            เรียนรู้ผลิตภัณฑ์ Red Hat เพื่อยกระดับการขายและให้คำปรึกษา
          </h1>
          <p
            style={{
              color: '#d8d8d8',
              fontSize: '1.05rem',
              maxWidth: 580,
              marginBottom: 'var(--space-5)',
            }}
          >
            หลักสูตรสำหรับทีมขายและพรี-เซลส์ของพาร์ตเนอร์ เข้าใจคุณค่าของผลิตภัณฑ์
            ทดสอบความรู้ และฝึกฝนผ่านกรณีศึกษาในชีวิตจริง
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-5)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#a8a8a8', marginBottom: 4 }}>
                ความคืบหน้ารวม
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{overall}%</span>
                <div
                  style={{
                    width: 160,
                    height: 8,
                    background: 'rgba(255,255,255,0.18)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${overall}%`,
                      height: '100%',
                      background: 'var(--rh-red)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                fontSize: '0.85rem',
                color: '#bdbdbd',
              }}
            >
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                  {modules.length}
                </div>
                <div>โมดูล</div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                  {modules.reduce((a, m) => a + m.lessons.length, 0)}
                </div>
                <div>บทเรียน</div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                  {modules.length}
                </div>
                <div>กรณีศึกษา</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section heading */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="kicker">โมดูลการเรียนรู้</div>
        <h2 style={{ fontSize: '1.5rem' }}>เลือกโมดูลเพื่อเริ่มเรียน</h2>
      </div>

      {/* Module cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {modules.map((m) => {
          const mp = getModuleProgress(m, progress[m.id])
          return (
            <button
              key={m.id}
              onClick={() => onOpenModule(m.id)}
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              {/* accent header */}
              <div
                style={{
                  height: 6,
                  background: m.accent,
                }}
              />
              <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>{m.icon}</span>
                    <div>
                      <div className="chip chip--red" style={{ marginBottom: 6 }}>
                        {m.category}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{m.shortTitle}</h3>
                    </div>
                  </div>
                  {mp.complete && (
                    <span className="chip chip--done" style={{ flexShrink: 0 }}>
                      ✓ สำเร็จ
                    </span>
                  )}
                </div>

                <p className="muted" style={{ fontSize: '0.92rem', marginBottom: 'var(--space-4)', flex: 1 }}>
                  {m.tagline}
                </p>

                {/* progress */}
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      marginBottom: 6,
                    }}
                  >
                    <span className="muted">ความคืบหน้า</span>
                    <span style={{ fontWeight: 700 }}>{mp.percent}%</span>
                  </div>
                  <div className="progress">
                    <div className="progress__fill" style={{ width: `${mp.percent}%` }} />
                  </div>
                </div>

                {/* meta */}
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--space-4)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>📖 {m.lessons.length} บทเรียน</span>
                  <span>⏱ ~{m.estimatedMinutes} นาที</span>
                  <span>✍ {m.quiz.questions.length} คำถาม</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {mp.complete
                      ? 'ทบทวนได้ตลอดเวลา'
                      : mp.percent > 0
                        ? 'ดำเนินการต่อ'
                        : 'เริ่มเรียน'}
                  </span>
                  <span
                    style={{
                      color: 'var(--rh-red)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {mp.complete ? 'เปิดดู →' : mp.percent > 0 ? 'เปิดดู →' : 'เริ่ม →'}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
