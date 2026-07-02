import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-tight fade-up" style={{ padding: 'var(--space-6) var(--space-4)' }}>
          <div className="card card--pad" style={{ textAlign: 'center', borderTop: '4px solid var(--danger)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
            <p className="muted" style={{ marginBottom: 'var(--space-5)', maxWidth: 480, margin: '0 auto var(--space-5)' }}>
              แอปพลิเคชันเกิดข้อผิดพลาดที่ไม่คาดคิด อาจเกิดจากข้อมูลที่จัดเก็บในบราวเซอร์ไม่ถูกต้อง
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn--primary" onClick={this.handleReset}>
                เริ่มใหม่ / โหลดหน้าเว็บอีกครั้ง
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
