import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'
import { compareOrdered, moveItem, orderGroups, type OrderDocument } from '@/lib/ordering'
const tx = vi.hoisted(() => ({ commit: vi.fn(), rollback: vi.fn(), supported: true }))
vi.mock('payload', async () => {
  const actual = await vi.importActual<typeof import('payload')>('payload')
  return {
    ...actual,
    initTransaction: async (req: PayloadRequest) => {
      if (tx.supported) req.transactionID = 'qa-transaction'
      return tx.supported
    },
    commitTransaction: tx.commit,
    killTransaction: tx.rollback,
  }
})
beforeEach(() => {
  vi.clearAllMocks()
  tx.supported = true
})
const original: OrderDocument[] = [
  {
    id: 'a',
    updatedAt: '2026-01-01T00:00:00.000Z',
    name: 'A',
    type: 'player',
    role: { id: 'qa-role', roleName: 'QA strings' },
    sortOrder: 1,
  },
  {
    id: 'b',
    updatedAt: '2026-01-01T00:00:00.000Z',
    name: 'B',
    type: 'player',
    role: { id: 'qa-role', roleName: 'QA strings' },
    sortOrder: 2,
  },
]
function setup() {
  const docs = structuredClone(original)
  const find = vi.fn().mockImplementation(async () => ({ docs: structuredClone(docs) }))
  const update = vi
    .fn()
    .mockImplementation(
      async (args: {
        where: { and: [{ id: { equals: string } }, unknown] }
        data: { sortOrder: number }
      }) => {
        const doc = docs.find((item) => item.id === args.where.and[0].id.equals)!
        doc.sortOrder = args.data.sortOrder
        doc.updatedAt = '2026-02-01T00:00:00.000Z'
        return { docs: [doc], errors: [] }
      },
    )
  const req = {
    user: { id: 'qa-editor' },
    payload: { find, update },
    json: vi.fn(),
  } as unknown as PayloadRequest
  const [read, save] = reorderEndpoints('people')
  return { req, read, save, find, update, docs }
}
describe('collection ordering', () => {
  it('moves without mutating the saved order and handles edge positions', () => {
    const list = ['a', 'b', 'c']
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a'])
    expect(list).toEqual(['a', 'b', 'c'])
    expect(moveItem(list, 0, -1)).toBe(list)
  })
  it('separates people by type and instrument role, including inactive records', () => {
    const groups = orderGroups('people', [
      ...original,
      { ...original[0], id: 'c', type: 'alumni', isActive: false },
    ])
    expect(groups).toHaveLength(2)
    expect(groups.find((g) => g.id === 'alumni:qa-role')?.items[0].inactive).toBe(true)
  })
  it('uses manual rank before alphabetical fallback', () => {
    expect(
      compareOrdered({ id: 'a', name: 'Z', sortOrder: 1 }, { id: 'b', name: 'A', sortOrder: 2 }),
    ).toBeLessThan(0)
  })
  it('saves one complete group in a shared transaction with access checks', async () => {
    const { req, read, save, find, update } = setup()
    const state = await (await read.handler(req)).json()
    req.json = async () => ({ revision: state.revision, group: 'player:qa-role', ids: ['b', 'a'] })
    const result = await (await save.handler(req)).json()
    expect(result.groups[0].items.map((item: { id: string }) => item.id)).toEqual(['b', 'a'])
    expect(update).toHaveBeenCalledTimes(2)
    expect(tx.commit).toHaveBeenCalledWith(req)
    expect(tx.rollback).not.toHaveBeenCalled()
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false, req, pagination: false }),
    )
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false, req, data: { sortOrder: 1 } }),
    )
  })
  it('rejects an old revision without changing any records', async () => {
    const { req, save, update } = setup()
    req.json = async () => ({ revision: 'stale', group: 'player:qa-role', ids: ['b', 'a'] })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 409 })
    expect(update).not.toHaveBeenCalled()
    expect(tx.rollback).toHaveBeenCalled()
  })
  it('rejects omitted or foreign group members', async () => {
    const { req, read, save, update } = setup()
    const state = await (await read.handler(req)).json()
    req.json = async () => ({ revision: state.revision, group: 'player:qa-role', ids: ['a'] })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 409 })
    expect(update).not.toHaveBeenCalled()
  })
  it('rejects duplicate IDs before starting a write', async () => {
    const { req, save, update } = setup()
    req.json = async () => ({ revision: 'qa', group: 'player:qa-role', ids: ['a', 'a'] })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 400 })
    expect(update).not.toHaveBeenCalled()
  })
  it('rejects malformed JSON without starting a write', async () => {
    const { req, save, update } = setup()
    req.json = async () => {
      throw new SyntaxError('Invalid JSON')
    }
    await expect(save.handler(req)).rejects.toMatchObject({ status: 400 })
    expect(update).not.toHaveBeenCalled()
  })
  it('rolls back the group when one update fails', async () => {
    const { req, read, save, update } = setup()
    const state = await (await read.handler(req)).json()
    update
      .mockResolvedValueOnce({ docs: [original[1]], errors: [] })
      .mockResolvedValueOnce({ docs: [], errors: [{ message: 'failed' }] })
    req.json = async () => ({ revision: state.revision, group: 'player:qa-role', ids: ['b', 'a'] })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 409 })
    expect(tx.rollback).toHaveBeenCalledWith(req)
    expect(tx.commit).not.toHaveBeenCalled()
  })
  it('does not fall back to partial writes without transaction support', async () => {
    const { req, save, update } = setup()
    tx.supported = false
    req.json = async () => ({ revision: 'qa', group: 'player:qa-role', ids: ['b', 'a'] })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 503 })
    expect(update).not.toHaveBeenCalled()
  })
  it('requires login for reads and writes', async () => {
    const { req, read, save } = setup()
    req.user = null
    await expect(read.handler(req)).rejects.toMatchObject({ status: 401 })
    await expect(save.handler(req)).rejects.toMatchObject({ status: 401 })
  })
})
