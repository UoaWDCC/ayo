import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './NavBar'
import { announceModalOpen } from './modalEvents'

vi.mock('./PageTransitionProvider', () => ({
  usePageTransitionPhase: () => 'idle',
  FADE_DURATION: 400,
}))
vi.mock('next/link', () => ({
  default: ({ onClick, ...props }: React.ComponentProps<'a'>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
    />
  ),
}))

let changeDesktop: () => void
let desktop: {
  matches: boolean
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
}
beforeEach(() => {
  desktop = {
    matches: false,
    addEventListener: vi.fn((_, listener) => {
      changeDesktop = listener
    }),
    removeEventListener: vi.fn(),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => desktop),
  )
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  return screen.getByRole('navigation', { name: 'Mobile navigation' })
}

describe('mobile navigation', () => {
  it('keeps the shared surface through closing and cancels stale close timers when reopened', () => {
    vi.useFakeTimers()
    render(<Header overlay />)
    const logo = screen.getByRole('img', { name: 'AYO Logo' })
    openMenu()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    act(() => vi.advanceTimersByTime(150))
    openMenu()
    act(() => vi.advanceTimersByTime(300))
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(logo.classList.contains('brightness-0')).toBe(true)
    act(() => vi.advanceTimersByTime(299))
    expect(logo.classList.contains('brightness-0')).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(logo.classList.contains('brightness-0')).toBe(false)
    expect(logo.getAttribute('src')).toBe('/ayo-logo-white.png')
  })
  it('keeps closed links inert and restores focus to the toggle on Escape', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('#mobile-nav')?.hasAttribute('inert')).toBe(true)
    const nav = openMenu()
    expect(nav.hasAttribute('inert')).toBe(false)
    fireEvent.keyDown(within(nav).getByRole('link', { name: 'NEWS' }), { key: 'Escape' })
    expect(container.querySelector('#mobile-nav')?.hasAttribute('inert')).toBe(true)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open menu' }))
  })
  it('handles repeated toggles and closes when a destination is chosen', () => {
    render(<Header />)
    openMenu()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    const nav = openMenu()
    fireEvent.click(within(nav).getByRole('link', { name: 'NEWS' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull()
  })
  it('closes on desktop resize and stays closed when returning to mobile', () => {
    render(<Header />)
    openMenu()
    act(() => {
      desktop.matches = true
      changeDesktop()
    })
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull()
    act(() => {
      desktop.matches = false
      changeDesktop()
    })
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
  })
  it('closes when another page panel opens', () => {
    render(<Header />)
    openMenu()
    act(() => announceModalOpen())
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull()
  })
})
