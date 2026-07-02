import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OptionButton from '../components/OptionButton'
import ResetConfirmModal from '../components/ResetConfirmModal'

describe('Component Smoke Tests', () => {
  it('renders Header correctly with progress', () => {
    const mockProgress = {
      rhel: { completedLessons: {}, quizScore: null, scenarioCompleted: false },
    }
    render(
      <MemoryRouter>
        <Header progress={mockProgress} onHome={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByText('Red Hat Partner Learning')).toBeInTheDocument()
  })

  it('renders Footer correctly', () => {
    render(<Footer />)
    expect(screen.getByText('Red Hat Partner Learning')).toBeInTheDocument()
  })

  it('renders OptionButton correctly', () => {
    const onClick = vi.fn()
    render(
      <OptionButton
        index={0}
        text="Option A"
        isSelected={false}
        showCorrect={false}
        showWrong={false}
        answered={false}
        onClick={onClick}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Option A')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })

  it('renders ResetConfirmModal and registers click event', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(<ResetConfirmModal onConfirm={onConfirm} onClose={onClose} />)
    
    expect(screen.getByText('ยืนยันการล้างข้อมูล')).toBeInTheDocument()
    
    const confirmBtn = screen.getByText('ยืนยัน — ล้างข้อมูล')
    fireEvent.click(confirmBtn)
    expect(onConfirm).toHaveBeenCalled()
  })
})
