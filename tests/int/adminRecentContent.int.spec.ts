import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import { getRecentContent } from '@/lib/adminRecentContent'

const find = vi.fn()
const findGlobal = vi.fn()
const req = {
  payload: { find, findGlobal, config: { routes: { admin: '/admin' } } },
} as unknown as PayloadRequest

beforeEach(() => {
  vi.resetAllMocks()
  find.mockResolvedValue({ docs: [] })
  findGlobal.mockResolvedValue({})
})

describe('recent content activity', () => {
  it('includes the six newest edits even when they all belong to one collection', async () => {
    const posts = Array.from({ length: 7 }, (_, index) => ({
      id: String(index),
      title: `Post ${index}`,
      updatedAt: new Date(Date.UTC(2026, 9, 16, 12, 7 - index)).toISOString(),
    }))
    find.mockImplementation(async ({ collection, limit }) => ({
      docs: collection === 'posts' ? posts.slice(0, limit) : [],
    }))
    const result = await getRecentContent(req)
    expect(result.map((item) => item.title)).toEqual([
      'Post 0',
      'Post 1',
      'Post 2',
      'Post 3',
      'Post 4',
      'Post 5',
    ])
  })

  it('combines people, FAQs, media and settings with meaningful titles and working destinations', async () => {
    const docs: Record<string, object[]> = {
      people: [{ id: 'person', name: 'QA person', updatedAt: '2026-10-16T11:00:00Z' }],
      faqs: [{ id: 'faq', question: 'QA question?', updatedAt: '2026-10-16T12:00:00Z' }],
      media: [{ id: 'image', filename: 'qa-photo.png', updatedAt: '2026-10-16T10:00:00Z' }],
    }
    find.mockImplementation(async ({ collection }) => ({ docs: docs[collection] ?? [] }))
    findGlobal.mockResolvedValue({ updatedAt: '2026-10-16T13:00:00Z' })
    expect(await getRecentContent(req)).toEqual([
      {
        collection: 'Settings',
        title: 'Site Settings',
        href: '/admin/globals/site-settings',
        updatedAt: '2026-10-16T13:00:00Z',
      },
      {
        collection: 'FAQs',
        title: 'QA question?',
        href: '/admin/collections/faqs/faq',
        updatedAt: '2026-10-16T12:00:00Z',
      },
      {
        collection: 'People',
        title: 'QA person',
        href: '/admin/collections/people/person',
        updatedAt: '2026-10-16T11:00:00Z',
      },
      {
        collection: 'Media',
        title: 'qa-photo.png',
        href: '/admin/collections/media/image',
        updatedAt: '2026-10-16T10:00:00Z',
      },
    ])
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ req, overrideAccess: false, depth: 0 }),
    )
    expect(
      find.mock.calls.some(([options]) => ['users', 'passwords'].includes(options.collection)),
    ).toBe(false)
  })

  it('handles an empty site without inventing activity', async () => {
    expect(await getRecentContent(req)).toEqual([])
  })
})
