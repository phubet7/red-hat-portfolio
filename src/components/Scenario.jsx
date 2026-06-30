import { useState } from 'react'

export default function Scenario({ module, onComplete }) {
  const [phase, setPhase] = useState('intro') // intro | decisions | summary
  const [decisionIdx, setDecisionIdx] = useState(0)
  const [selections, setSelections] = useState([])
  const [currentChoice, setCurrentChoice] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const sc = module.scenario
  const total = sc.decisions.length

  function start() {
    setPhase('decisions')
    setDecisionIdx(0)
    setSelections([])
    setCurrentChoice(null)
    setRevealed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reveal() {
    if (currentChoice == null) return
    setRevealed(true)
  }

  function nextDecision() {
    const chosen = sc.decisions[decisionIdx].options[currentChoice]
    const newSelections = [...selections, { idx: currentChoice, correct: chosen.correct }]
    setSelections(newSelections)

    if (decisionIdx < total - 1) {
      setDecisionIdx((i) => i + 1)
      setCurrentChoice(null)
      setRevealed(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // done
      onComplete(module.id)
      setPhase('summary')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <div className="container-tight fade-up">
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #151515, #2b2b2b)',
              color: '#fff',
              padding: 'var(--space-5) var(--space-6)',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--rh-red)',
                marginBottom: 6,
              }}
            >
              🎯 กรณีศึกษาเชิงโต้ตอบ
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: 6 }}>
              {sc.title}
            </h1>
            <p style={{ color: '#cfcfcf' }}>{sc.intro}</p>
          </div>

          <div style={{ padding: 'var(--space-6)' }}>
            {/* Customer card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-5)',
              }}
            >
              <InfoBox label="ลูกค้า" value={sc.customer.name} />
              <InfoBox label="อุตสาหกรรม" value={sc.customer.industry} />
              <InfoBox label="ขนาดองค์กร" value={sc.customer.size} />
            </div>

            {/* Context */}
            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>บริบทของลูกค้า</h3>
            <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>{sc.context}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)', color: 'var(--danger)' }}>
                  😟 ปัญหา (Pain Points)
                </h3>
                <ul style={{ lineHeight: 1.8, fontSize: '0.93rem' }}>
                  {sc.painPoints.map((p, i) => (
                    <li key={i} style={{ marginBottom: 'var(--space-2)' }}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)', color: 'var(--success)' }}>
                  🎯 เป้าหมาย (Goals)
                </h3>
                <ul style={{ lineHeight: 1.8, fontSize: '0.93rem' }}>
                  {sc.goals.map((g, i) => (
                    <li key={i} style={{ marginBottom: 'var(--space-2)' }}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-4)',
                background: 'var(--rh-gray-100)',
                borderRadius: 'var(--radius)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-5)',
              }}
            >
              📋 <strong>คำสั่ง:</strong> คุณจะได้รับ {total} สถานการณ์ที่ต้องตัดสินใจ
              เลือกคำตอบที่เหมาะสมที่สุด จากนั้นจะได้รับคำติชมแบบทันที
            </div>

            <button className="btn btn--primary btn--lg btn--block" onClick={start}>
              เริ่มทำกรณีศึกษา →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Summary ----------
  if (phase === 'summary') {
    const correctCount = selections.filter((s) => s.correct).length
    const allCorrect = correctCount === total

    return (
      <div className="container-tight fade-up">
        <div className="card card--pad" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.2rem', marginBottom: 'var(--space-2)' }}>
            {allCorrect ? '🏆' : '✅'}
          </div>
          <div className="kicker" style={{ color: 'var(--success)' }}>
            สำเร็จ!
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-2)' }}>
            คุณตอบถูก {correctCount} จาก {total} สถานการณ์
          </h2>
          <p className="muted" style={{ marginBottom: 'var(--space-5)' }}>
            {allCorrect
              ? 'ยอดเยี่ยม! คุณเข้าใจการวางตำแหน่งผลิตภัณฑ์อย่างชัดเจน'
              : 'ดีแล้ว! การฝึกฝนทำให้เก่งขึ้น ลองทบทวนคำติชมด้านล่าง'}
          </p>

          {/* review */}
          <div style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
            {sc.decisions.map((d, i) => {
              const sel = selections[i]
              const chosenOpt = d.options[sel.idx]
              return (
                <div
                  key={d.id}
                  style={{
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-3)',
                    borderRadius: 'var(--radius)',
                    background: sel.correct ? 'var(--success-bg)' : 'var(--warning-bg)',
                    border: `1px solid ${sel.correct ? '#c6e4c8' : '#f0d9b5'}`,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.92rem' }}>
                    {sel.correct ? '✓' : '✗'} สถานการณ์ {i + 1}: {d.question}
                  </div>
                  <div style={{ fontSize: '0.88rem', marginBottom: 8 }}>
                    <span className="muted">คำตอบของคุณ: </span>
                    <strong>{chosenOpt.text}</strong>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    💬 {chosenOpt.feedback}
                  </div>
                </div>
              )
            })}
          </div>

          {/* takeaway */}
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              background: 'var(--rh-red-tint)',
              border: '1px solid var(--rh-red-tint-2)',
              borderLeft: '4px solid var(--rh-red)',
              borderRadius: 'var(--radius)',
              textAlign: 'left',
              marginBottom: 'var(--space-5)',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--rh-red-dark)', marginBottom: 6 }}>
              💡 บทสรุปสำหรับการขาย
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{sc.takeaway}</div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={start}>
              ทำกรณีศึกษาอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Decision phase ----------
  const decision = sc.decisions[decisionIdx]
  const chosen = currentChoice != null ? decision.options[currentChoice] : null

  return (
    <div className="container-tight fade-up">
      {/* progress */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            marginBottom: 6,
          }}
        >
          <span className="muted">สถานการณ์ที่ {decisionIdx + 1} จาก {total}</span>
        </div>
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${Math.round(((decisionIdx) / total) * 100)}%` }}
          />
        </div>
      </div>

      <div className="card card--pad">
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--rh-red)',
            marginBottom: 'var(--space-2)',
          }}
        >
          สถานการณ์ที่ต้องตัดสินใจ
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-5)', lineHeight: 1.4 }}>
          {decision.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {decision.options.map((opt, i) => {
            const isSelected = currentChoice === i
            const showCorrect = revealed && opt.correct
            const showWrong = revealed && isSelected && !opt.correct

            let style = {
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: revealed ? 'default' : 'pointer',
              textAlign: 'left',
              width: '100%',
              fontSize: '0.95rem',
              transition: 'all 0.15s ease',
            }
            if (!revealed && isSelected) {
              style = { ...style, border: '2px solid var(--rh-red)', background: 'var(--rh-red-tint)' }
            }
            if (showCorrect) {
              style = { ...style, border: '2px solid var(--success)', background: 'var(--success-bg)' }
            }
            if (showWrong) {
              style = { ...style, border: '2px solid var(--danger)', background: '#fdeaea' }
            }

            return (
              <button
                key={i}
                style={style}
                onClick={() => !revealed && setCurrentChoice(i)}
                disabled={revealed}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: showCorrect
                      ? '2px solid var(--success)'
                      : showWrong
                        ? '2px solid var(--danger)'
                        : isSelected
                          ? '2px solid var(--rh-red)'
                          : '2px solid var(--border-strong)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    background:
                      showCorrect ? 'var(--success)'
                        : showWrong ? 'var(--danger)'
                          : isSelected ? 'var(--rh-red)'
                            : '#fff',
                    color: showCorrect || showWrong || isSelected ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ paddingTop: 2 }}>{opt.text}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {revealed && chosen && (
          <div
            style={{
              marginTop: 'var(--space-5)',
              padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius)',
              background: chosen.correct ? 'var(--success-bg)' : 'var(--warning-bg)',
              border: `1px solid ${chosen.correct ? '#c6e4c8' : '#f0d9b5'}`,
              borderLeft: `4px solid ${chosen.correct ? 'var(--success)' : 'var(--warning)'}`,
              animation: 'fadeUp 0.3s ease both',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: chosen.correct ? 'var(--success)' : 'var(--warning)',
                marginBottom: 6,
              }}
            >
              {chosen.correct ? '✓ คำตอบที่ดีที่สุด!' : '✗ ยังไม่ใช่ทางเลือกที่ดีที่สุด'}
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{chosen.feedback}</div>
          </div>
        )}

        <div
          style={{
            marginTop: 'var(--space-5)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {!revealed ? (
            <button className="btn btn--primary" onClick={reveal} disabled={currentChoice == null}>
              ดูคำติชม
            </button>
          ) : (
            <button className="btn btn--primary" onClick={nextDecision}>
              {decisionIdx < total - 1 ? 'สถานการณ์ถัดไป →' : 'ดูสรุปผล →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--rh-gray-100)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{value}</div>
    </div>
  )
}
