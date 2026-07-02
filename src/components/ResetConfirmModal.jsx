import { useEffect, useRef } from 'react'

export default function ResetConfirmModal({ onConfirm, onClose }) {
  const modalRef = useRef(null)
  const confirmBtnRef = useRef(null)
  const cancelBtnRef = useRef(null)

  useEffect(() => {
    // Focus the default cancel button on mount
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus()
    }

    // Capture Escape key to close modal
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
      
      // Simple keyboard focus trap within modal
      if (e.key === 'Tab') {
        const focusables = modalRef.current?.querySelectorAll('button')
        if (focusables && focusables.length >= 2) {
          const first = focusables[0]
          const last = focusables[1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: 'var(--space-4)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="card"
        style={{
          padding: 'var(--space-6)',
          maxWidth: 420,
          width: '100%',
          animation: 'fadeUp 0.2s ease both',
        }}
      >
        <h3 id="reset-modal-title" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>
          ยืนยันการล้างข้อมูล
        </h3>
        <p className="muted" style={{ marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>
          การกระทำนี้จะ<strong>ลบคะแนน ความคืบหน้า และผลการเรียนทั้งหมด</strong>
          ของทุกโมดูลแบบถาวร และไม่สามารถย้อนกลับได้
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button
            ref={cancelBtnRef}
            className="btn btn--ghost"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            ref={confirmBtnRef}
            className="btn"
            style={{ background: 'var(--danger)', color: '#fff' }}
            onClick={onConfirm}
          >
            ยืนยัน — ล้างข้อมูล
          </button>
        </div>
      </div>
    </div>
  )
}
