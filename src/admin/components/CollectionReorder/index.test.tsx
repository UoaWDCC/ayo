import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { CollectionReorder } from './index'
vi.mock('@payloadcms/ui', () => ({
  useConfig: () => ({ config: { serverURL: '', routes: { api: '/api' } } }),
  useTableColumns: () => ({ resetColumnsState }),
}))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))
const snapshot = {
  revision: 'qa',
  groups: [
    {
      id: 'team',
      label: 'Team',
      items: [
        { id: 'a', label: 'QA Alpha', inactive: false },
        { id: 'b', label: 'QA Beta', inactive: false },
      ],
    },
  ],
}
const resetColumnsState = vi.hoisted(() => vi.fn())
const props = {
  collectionSlug: 'people' as const,
  hasCreatePermission: true,
  newDocumentURL: '/admin/collections/people/create',
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  resetColumnsState.mockReset()
})
async function open() {
  render(<CollectionReorder {...props} />)
  fireEvent.click(screen.getByRole('button', { name: 'Reorder' }))
  await screen.findByRole('button', { name: 'Move QA Beta up' })
}
describe('explicit reorder controls', () => {
  it('shows a retryable error when column preferences cannot be reset', async () => {
    resetColumnsState.mockRejectedValueOnce(new Error('Offline'))
    render(<CollectionReorder {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reset columns' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Could not reset the columns')
    expect(screen.getByRole('button', { name: 'Reset columns' }).hasAttribute('disabled')).toBe(
      false,
    )
  })
  it('stages keyboard moves and discards them on Cancel without a write', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => snapshot })
    vi.stubGlobal('fetch', fetcher)
    await open()
    fireEvent.click(screen.getByRole('button', { name: 'Move QA Beta up' }))
    expect(
      within(screen.getByRole('list', { name: 'Current order' })).getAllByRole('listitem')[0]
        .textContent,
    ).toContain('QA Beta')
    expect(screen.getByRole('button', { name: 'Save order' }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('status').textContent).toContain('QA Beta moved from position 2 to 1')
    expect(
      within(screen.getByRole('list', { name: 'Current order' })).getAllByRole('listitem')[0]
        .className,
    ).toContain('ayo-reorder__row--moved')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(fetcher.mock.calls[0][1].method).toBeUndefined()
  })
  it('saves only when Save order is clicked', async () => {
    const saved = {
      ...snapshot,
      groups: [{ ...snapshot.groups[0], items: [...snapshot.groups[0].items].reverse() }],
    }
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => snapshot })
      .mockResolvedValueOnce({ ok: true, json: async () => saved })
    vi.stubGlobal('fetch', fetcher)
    await open()
    fireEvent.click(screen.getByRole('button', { name: 'Move QA Beta up' }))
    expect(fetcher).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Save order' }))
    await screen.findByText('Order saved.')
    expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual({
      revision: 'qa',
      group: 'team',
      ids: ['b', 'a'],
    })
  })
  it('stages drag and drop without sending a write', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => snapshot })
    vi.stubGlobal('fetch', fetcher)
    await open()
    const rows = within(screen.getByRole('list', { name: 'Current order' })).getAllByRole(
      'listitem',
    )
    fireEvent.dragStart(rows[0], { dataTransfer: { effectAllowed: '', setData: vi.fn() } })
    fireEvent.dragOver(rows[1])
    fireEvent.drop(rows[1])
    await waitFor(() =>
      expect(
        within(screen.getByRole('list', { name: 'Current order' })).getAllByRole('listitem')[0]
          .textContent,
      ).toContain('QA Beta'),
    )
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})
