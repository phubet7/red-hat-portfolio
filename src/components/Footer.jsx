export default function Footer() {
  return (
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
          <strong style={{ color: 'var(--rh-white)' }}>Red Hat Partner Learning</strong> ·
          แพลตฟอร์มการเรียนรู้สำหรับพาร์ตเนอร์
        </div>
        <div className="muted" style={{ color: 'var(--rh-gray-500)' }}>
          เนื้อหาอ้างอิงจากข้อมูลผลิตภัณฑ์สาธารณะของ Red Hat · สำหรับการฝึกอบรม
        </div>
      </div>
    </footer>
  )
}
