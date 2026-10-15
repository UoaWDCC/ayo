import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { RolesPreview } from './index'
vi.mock('@payloadcms/ui', () => ({
  useDocumentInfo: () => ({ id: 'qa-role' }),
  useConfig: () => ({ config: { serverURL: '', routes: { api: '/api' } } }),
}))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe('role preview recovery', () => {
  it('reports a failed load and lets the editor retry', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ docs: [{ id: 'qa-person', name: 'QA player' }] }),
        }),
    )
    render(<RolesPreview />)
    expect(await screen.findByText('Could not load the current holders.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('QA player')).toBeTruthy()
    expect(screen.queryByText('No one currently holds this role.')).toBeNull()
  })
})
