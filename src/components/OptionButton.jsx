export default function OptionButton({
  index,
  text,
  isSelected,
  showCorrect,
  showWrong,
  answered,
  onClick,
}) {
  const label = String.fromCharCode(65 + index)

  let buttonStyle = {
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
    fontSize: '0.95rem',
    transition: 'all 0.15s ease',
  }

  if (!answered && isSelected) {
    buttonStyle = {
      ...buttonStyle,
      border: '2px solid var(--rh-red)',
      background: 'var(--rh-red-tint)',
    }
  }
  if (showCorrect) {
    buttonStyle = {
      ...buttonStyle,
      border: '2px solid var(--success)',
      background: 'var(--success-bg)',
    }
  }
  if (showWrong) {
    buttonStyle = {
      ...buttonStyle,
      border: '2px solid var(--danger)',
      background: '#fdeaea',
    }
  }

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={answered}
      className={!answered ? 'card--interactive' : ''}
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
        {showCorrect ? '✓' : showWrong ? '✗' : label}
      </span>
      <span style={{ paddingTop: 2 }}>{text}</span>
    </button>
  )
}
