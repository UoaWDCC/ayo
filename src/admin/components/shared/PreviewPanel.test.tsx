import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { PreviewPanel } from './PreviewPanel'
beforeEach(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  ),
)
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe('preview panel interaction', () => {
  it('keeps controls outside the keyboard-scrollable preview body', () => {
    render(
      <PreviewPanel header={<button>Card</button>}>
        <p>Body text</p>
      </PreviewPanel>,
    )
    const region = screen.getByRole('region', { name: 'Preview content' })
    expect(region.getAttribute('tabindex')).toBe('0')
    expect(region.contains(screen.getByRole('button', { name: 'Card' }))).toBe(false)
  })
  it('preserves scroll during editing and resets it only when the view changes', () => {
    const { rerender } = render(
      <PreviewPanel header="Preview" resetKey="article">
        Old text
      </PreviewPanel>,
    )
    const region = screen.getByRole('region', { name: 'Preview content' })
    region.scrollTop = 350
    rerender(
      <PreviewPanel header="Preview" resetKey="article">
        Edited text
      </PreviewPanel>,
    )
    expect(region.scrollTop).toBe(350)
    rerender(
      <PreviewPanel header="Preview" resetKey="card">
        Card text
      </PreviewPanel>,
    )
    expect(region.scrollTop).toBe(0)
  })
})
