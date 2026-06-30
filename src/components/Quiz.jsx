import { useState } from 'react'

export default function Quiz({ module, moduleState, onComplete }) {
  const [started, setStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const quiz = module.quiz
  const total = quiz.questions.length
  const question = quiz.questions[currentIdx]
  const bestScore = moduleState?.quizScore ?? null
  const passed = bestScore != null && bestScore >= quiz.passingScore

  function start() {
    setStarted(true)
    setCurrentIdx(0)
    setSelected(null)
    setAnswered(false)
    setAnswers([])
    setFinished(false)
  }

  function submitAnswer() {
    if (selected == null) return
    setAnswered(true)
    setAnswers((a) => [...a, { qid: question.id, selected, correct: selected === question.correct }])
  }

  function next() {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      finish()
    }
  }

  function finish() {
    const correctCount = answers.filter((a) => a.correct).length
    const score = Math.round((correctCount / total) * 100)
    onComplete(module.id, score)
    setFinished(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Pre-start screen ----------
  if (!started) {
    return (
      <div className="container-tight fade-up">
        <div className="card card--pad" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>✍</div>
          <div className="kicker">แบบทดสอบ</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-3)' }}>
            {module.shortTitle} Knowledge Check
          </h2>
          <p className="muted" style={{ marginBottom: 'var(--space-5)', maxWidth: 480, margin: '0 auto var(--space-5)' }}>
            ทดสอบความเข้าใจเกี่ยวกับ {module.title} ผ่าน {total} คำถาม
            ต้องได้คะแนนอย่างน้อย {quiz.passingScore}% เพื่อผ่าน
          </p>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-5)',
              justifyContent: 'center',
              marginBottom: 'var(--space-5)',
              flexWrap: 'wrap',
            }}
          >
            <Stat label="จำนวนคำถาม" value={total} />
            <Stat label="คะแนนผ่าน" value={`${quiz.passingScore}%`} />
            <Stat
              label="คะแนนสูงสุดของคุณ"
              value={bestScore == null ? '—' : `${bestScore}%`}
              highlight={passed}
            />
          </div>

          {passed && (
            <div
              className="chip chip--done"
              style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}
            >
              ✓ คุณผ่านแบบทดสอบนี้แล้ว (สามารถทำซ้ำเพื่อทบทวนได้)
            </div>
          )}

          <div>
            <button className="btn btn--primary btn--lg" onClick={start}>
              {passed ? 'ทำแบบทดสอบอีกครั้ง' : bestScore != null ? 'ลองอีกครั้ง' : 'เริ่มทำแบบทดสอบ'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Results screen ----------
  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length
    const score = Math.round((correctCount / total) * 100)
    const isPass = score >= quiz.passingScore

    return (
      <div className="container-tight fade-up">
        <div className="card card--pad" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)' }}>
            {isPass ? '🎉' : '📚'}
          </div>
          <div className="kicker" style={{ color: isPass ? 'var(--success)' : 'var(--warning)' }}>
            {isPass ? 'ผ่าน!' : 'ยังไม่ผ่าน'}
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-2)' }}>
            คุณได้คะแนน {score}%
          </h2>
          <p className="muted" style={{ marginBottom: 'var(--space-5)' }}>
            ตอบถูก {correctCount} จาก {total} ข้อ
          </p>

          <div
            style={{
              height: 12,
              background: 'var(--rh-gray-200)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
              marginBottom: 'var(--space-5)',
              maxWidth: 400,
              margin: '0 auto var(--space-5)',
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: '100%',
                background: isPass ? 'var(--success)' : 'var(--warning)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>

          {isPass ? (
            <p style={{ marginBottom: 'var(--space-5)', color: 'var(--success)', fontWeight: 600 }}>
              ยอดเยี่ยม! คุณเข้าใจ {module.shortTitle} ในระดับที่ดี ลองทำกรณีศึกษาต่อได้เลย 🎯
            </p>
          ) : (
            <p style={{ marginBottom: 'var(--space-5)', color: 'var(--warning)', fontWeight: 600 }}>
              ใกล้แล้ว! แนะนำให้กลับไปทบทวนบทเรียนแล้วลองอีกครั้งนะ
            </p>
          )}

          {/* review answers */}
          <div style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>ทบทวนคำตอบ</h3>
            {quiz.questions.map((q, i) => {
              const a = answers[i]
              return (
                <div
                  key={q.id}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    marginBottom: 'var(--space-2)',
                    borderRadius: 'var(--radius)',
                    background: a.correct ? 'var(--success-bg)' : 'var(--warning-bg)',
                    border: `1px solid ${a.correct ? '#c6e4c8' : '#f0d9b5'}`,
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {a.correct ? '✓' : '✗'} {i + 1}. {q.question}
                  </div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>
                    คำตอบที่ถูก: {q.options[q.correct]}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--ghost" onClick={start}>
              ทำซ้ำ
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Question screen ----------
  const progressPct = Math.round((currentIdx / total) * 100)
  const isCorrect = selected === question.correct

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
          <span className="muted">คำถามที่ {currentIdx + 1} จาก {total}</span>
          <span style={{ fontWeight: 600 }}>{progressPct}%</span>
        </div>
        <div className="progress">
          <div className="progress__fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="card card--pad">
        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-5)', lineHeight: 1.4 }}>
          {question.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const showCorrect = answered && i === question.correct
            const showWrong = answered && isSelected && i !== question.correct

            let style = {
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: answered ? 'default' : 'pointer',
              textAlign: 'left',
              width: '100%',
              fontSize: '0.97rem',
              transition: 'all 0.15s ease',
            }

            if (!answered && isSelected) {
              style = {
                ...style,
                border: '2px solid var(--rh-red)',
                background: 'var(--rh-red-tint)',
              }
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
                onClick={() => !answered && setSelected(i)}
                disabled={answered}
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
                    background: showCorrect
                      ? 'var(--success)'
                      : showWrong
                        ? 'var(--danger)'
                        : isSelected
                          ? 'var(--rh-red)'
                          : '#fff',
                    color: showCorrect || showWrong || isSelected ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ paddingTop: 2 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            style={{
              marginTop: 'var(--space-5)',
              padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius)',
              background: isCorrect ? 'var(--success-bg)' : 'var(--warning-bg)',
              border: `1px solid ${isCorrect ? '#c6e4c8' : '#f0d9b5'}`,
              borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--warning)'}`,
              animation: 'fadeUp 0.3s ease both',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: isCorrect ? 'var(--success)' : 'var(--warning)',
                marginBottom: 6,
              }}
            >
              {isCorrect ? '✓ ถูกต้อง!' : '✗ ยังไม่ถูกนะ'}
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{question.explanation}</div>
          </div>
        )}

        {/* Action */}
        <div
          style={{
            marginTop: 'var(--space-5)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {!answered ? (
            <button
              className="btn btn--primary"
              onClick={submitAnswer}
              disabled={selected == null}
            >
              ตรวจคำตอบ
            </button>
          ) : (
            <button className="btn btn--primary" onClick={next}>
              {currentIdx < total - 1 ? 'คำถามถัดไป →' : 'ดูผลคะแนน →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-3) var(--space-5)',
        background: 'var(--rh-gray-100)',
        borderRadius: 'var(--radius)',
        minWidth: 110,
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: highlight ? 'var(--success)' : 'var(--rh-black)',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
