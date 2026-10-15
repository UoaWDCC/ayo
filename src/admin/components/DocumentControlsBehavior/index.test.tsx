import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { DocumentControlsBehavior } from './index'
vi.mock('next/navigation', () => ({ usePathname: () => '/admin/collections/posts/one' }))
let toolbarTop = 148
beforeEach(() => {
  toolbarTop = 148
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const top = this.classList.contains('doc-controls') ? toolbarTop : 0
    const height = this.classList.contains('app-header') ? 44 : 56
    const width = this.classList.contains('doc-controls__controls-wrapper') ? 180 : 1000
    return {
      top,
      height,
      width,
      bottom: top + height,
      left: 0,
      right: width,
      x: 0,
      y: top,
      toJSON: () => ({}),
    } as DOMRect
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
describe('shared admin toolbar', () => {
  it('docks actions only while scrolled and reserves their measured width', async () => {
    const { container, unmount } = render(
      <DocumentControlsBehavior>
        <header className="app-header" />
        <div className="doc-controls">
          <div className="doc-controls__controls-wrapper" />
        </div>
      </DocumentControlsBehavior>,
    )
    const bar = container.querySelector('.doc-controls')!
    await waitFor(() =>
      expect(
        container
          .querySelector<HTMLElement>('.app-header')!
          .style.getPropertyValue('--ayo-doc-actions-width'),
      ).toBe('204px'),
    )
    expect(bar.classList.contains('ayo-doc-controls--stuck')).toBe(false)
    toolbarTop = 44
    fireEvent.scroll(document)
    await waitFor(() => expect(bar.classList.contains('ayo-doc-controls--stuck')).toBe(true))
    toolbarTop = 148
    fireEvent.scroll(document)
    await waitFor(() => expect(bar.classList.contains('ayo-doc-controls--stuck')).toBe(false))
    unmount()
  })
  it('leaves drawer controls alone', async () => {
    toolbarTop = 0
    const { container } = render(
      <DocumentControlsBehavior>
        <header className="app-header" />
        <div role="dialog">
          <div className="doc-controls" />
        </div>
        <div className="doc-controls">
          <div className="doc-controls__controls-wrapper" />
        </div>
      </DocumentControlsBehavior>,
    )
    const bars = container.querySelectorAll('.doc-controls')
    await waitFor(() => expect(bars[1].classList.contains('ayo-doc-controls--stuck')).toBe(true))
    expect(bars[0].classList.contains('ayo-doc-controls--stuck')).toBe(false)
  })
})
