import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPosts } from '@/lib/posts'
import { getConcertEvents } from '@/lib/concertEvents'
import { getPartners } from '@/lib/getPartners'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@payload-config', () => ({ default: {} }))
afterEach(() => {
  vi.useRealTimers()
  find.mockReset()
})

function serve(records: object[]) {
  find.mockImplementation(async ({ pagination, limit = 10 }) => ({
    docs: pagination === false ? records : records.slice(0, limit),
  }))
}

describe('complete public listings', () => {
  it('keeps posts beyond the old 100-record cutoff while limiting homepage previews', async () => {
    serve(Array.from({ length: 105 }, (_, id) => ({ id: String(id), title: `QA post ${id}` })))
    expect(await getPosts()).toHaveLength(105)
    expect(await getPosts(3)).toHaveLength(3)
  })
  it('includes an upcoming concert beyond the old cutoff', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-16T00:00:00Z'))
    serve(
      Array.from({ length: 101 }, (_, id) => ({
        id: String(id),
        title: `QA concert ${id}`,
        performances: [{ dateTime: id === 100 ? '2027-01-01T00:00:00Z' : '2020-01-01T00:00:00Z' }],
        createdAt: '2020-01-01T00:00:00Z',
      })),
    )
    const result = await getConcertEvents()
    expect(result.previous).toHaveLength(100)
    expect(result.upcoming.map((item) => item.id)).toEqual(['100'])
  })
  it('does not silently omit active partners beyond the old cutoff', async () => {
    serve(Array.from({ length: 105 }, (_, id) => ({ id: String(id), name: `QA partner ${id}` })))
    expect(await getPartners()).toHaveLength(105)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: { equals: true } } }),
    )
  })
})
