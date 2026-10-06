import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getInstagramFeed } from '@/lib/instagramFeedHelper'

const okResponse = (data: unknown) => ({ ok: true, status: 200, json: async () => data })
const errResponse = (status: number, error: object) => ({
  ok: false,
  status,
  json: async () => ({ error }),
})

describe('getInstagramFeed', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('maps images, videos (thumbnail) and carousels', async () => {
    fetchMock.mockResolvedValue(
      okResponse({
        data: [
          {
            id: '1',
            caption: 'Rehearsal',
            media_type: 'IMAGE',
            media_url: 'https://img/1.jpg',
            permalink: 'https://ig/p/1',
            timestamp: '2026-10-01T10:00:00+0000',
          },
          {
            id: '2',
            media_type: 'VIDEO',
            media_url: 'https://vid/2.mp4',
            thumbnail_url: 'https://img/2.jpg',
            permalink: 'https://ig/p/2',
            timestamp: '2026-10-02T10:00:00+0000',
          },
          {
            id: '3',
            caption: 'Concert',
            media_type: 'CAROUSEL_ALBUM',
            media_url: 'https://img/3.jpg',
            permalink: 'https://ig/p/3',
            timestamp: '2026-10-03T10:00:00+0000',
          },
        ],
      }),
    )

    const result = await getInstagramFeed({ token: 'test-token' })

    expect(result.ok).toBe(true)
    expect(result.posts).toHaveLength(3)
    expect(result.posts[1]).toMatchObject({ imageUrl: 'https://img/2.jpg', caption: '' })
  })

  it('skips posts without a usable image', async () => {
    fetchMock.mockResolvedValue(
      okResponse({
        data: [
          {
            id: '9',
            media_type: 'VIDEO',
            media_url: 'https://vid/9.mp4',
            permalink: 'https://ig/p/9',
            timestamp: 'x',
          },
        ],
      }),
    )
    const result = await getInstagramFeed({ token: 'test-token' })
    expect(result).toEqual({ ok: true, posts: [] })
  })

  it('returns missing_token without calling the API', async () => {
    const result = await getInstagramFeed({ token: '' })
    expect(result).toEqual({ ok: false, reason: 'missing_token', posts: [] })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('flags an expired token (code 190)', async () => {
    fetchMock.mockResolvedValue(errResponse(400, { code: 190, message: 'Token expired' }))
    const result = await getInstagramFeed({ token: 'old' })
    expect(result).toEqual({ ok: false, reason: 'token_expired', posts: [] })
    expect(console.warn).toHaveBeenCalled()
  })

  it('returns fetch_failed on network errors and never leaks the token in logs', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNRESET'))
    const result = await getInstagramFeed({ token: 'super-secret' })
    expect(result).toEqual({ ok: false, reason: 'fetch_failed', posts: [] })
    const logged = JSON.stringify((console.warn as any).mock.calls)
    expect(logged).not.toContain('super-secret')
  })
})
