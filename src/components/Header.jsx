import { getOverallProgress } from '../hooks/useProgress'
import { modules } from '../data/modules'

export default function Header({ progress, onHome }) {
  const overall = getOverallProgress(modules, progress)

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand" onClick={onHome} role="button" tabIndex={0}>
          <span className="brand__logo">R</span>
          <span className="brand__text">
            <span className="brand__name">Red Hat Partner Learning</span>
            <span className="brand__tag">Sales & Pre-Sales Enablement</span>
          </span>
        </div>
        <div className="header-nav">
          <div className="header-nav__progress" title="ความคืบหน้ารวม">
            <span className="header-nav__progress-bar">
              <span
                className="header-nav__progress-fill"
                style={{ width: `${overall}%` }}
              />
            </span>
            <span className="header-nav__progress-text" style={{ fontWeight: 600 }}>
              {overall}%
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
