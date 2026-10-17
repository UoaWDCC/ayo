import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Concert } from '@/payload-types'
import { concertLink, concertResourceLinks } from '@/lib/concertLinks'
import { getConcertEvents } from '@/lib/concertEvents'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@payload-config', () => ({ default: {} }))

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-15T00:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
  find.mockReset()
})

function fixture(overrides: Partial<Concert> = {}): Concert {
  return {
    id: 'qa-concert',
    title: 'AYO QA links',
    photo: 'qa-media',
    description: {
      root: { type: 'root', version: 1, format: '', indent: 0, direction: null, children: [] },
    },
    repertoire: [{ composer: 'QA', workTitle: 'QA' }],
    performances: [
      {
        dateTime: '2026-12-01T06:00:00Z',
        dateTime_tz: 'Pacific/Auckland',
        venue: 'QA',
        venueAddress: 'QA',
        price: 'QA',
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('concert destinations', () => {
  it('accepts full web links and site paths, and trims surrounding whitespace', () => {
    expect(concertLink(' https://example.org/gallery?a=1 ')).toBe('https://example.org/gallery?a=1')
    expect(concertLink('/api/media/file/programme.pdf')).toBe('/api/media/file/programme.pdf')
    expect(concertLink('http://example.org/tickets')).toBe('http://example.org/tickets')
  })

  it.each([
    undefined,
    null,
    '',
    'TBA',
    '#',
    'programme.pdf',
    '//example.org',
    'javascript:alert(1)',
    'https://',
    '/bad path',
    '/\\example.org',
  ])('omits placeholder or malformed destination %s', (value) => {
    expect(concertLink(value)).toBeUndefined()
  })

  it('keeps every real programme, gallery and recording link with distinct labels', () => {
    expect(
      concertResourceLinks({
        pdf: '/sample.pdf',
        photo_links: [
          { link: 'https://example.org/photo-1' },
          { link: '' },
          { link: 'https://example.org/photo-2' },
          { link: 'https://example.org/photo-3' },
        ],
        video_links: [
          { link: 'https://example.org/video-1' },
          { link: 'https://example.org/video-2' },
        ],
      }),
    ).toEqual([
      { label: 'Programme', href: '/sample.pdf' },
      { label: 'Photos 1', href: 'https://example.org/photo-1' },
      { label: 'Photos 2', href: 'https://example.org/photo-2' },
      { label: 'Photos 3', href: 'https://example.org/photo-3' },
      { label: 'Recordings 1', href: 'https://example.org/video-1' },
      { label: 'Recordings 2', href: 'https://example.org/video-2' },
    ])
  })
})

describe('public concert actions', () => {
  it('uses each future performance booking and skips past or unavailable bookings', async () => {
    const base = fixture().performances[0]
    find.mockResolvedValue({
      docs: [
        fixture({
          performances: [
            { ...base, dateTime: '2026-12-03T06:00:00Z', bookingUrl: 'https://example.org/third' },
            { ...base, dateTime: '2026-01-01T06:00:00Z', bookingUrl: 'https://example.org/past' },
            { ...base, dateTime: '2026-12-01T06:00:00Z', bookingUrl: 'TBA' },
            { ...base, dateTime: '2026-12-02T06:00:00Z', bookingUrl: 'https://example.org/second' },
          ],
        }),
      ],
    })
    const { upcoming } = await getConcertEvents()
    expect(upcoming[0].performances.map((p) => p.bookingUrl)).toEqual([
      undefined,
      undefined,
      'https://example.org/second',
      'https://example.org/third',
    ])
    expect(upcoming[0]).toMatchObject({
      ctaLabel: 'Book Now',
      ctaHref: 'https://example.org/second',
      footerNote: 'Tickets available.',
    })
  })

  it('does not claim tickets are available when no valid booking link exists', async () => {
    find.mockResolvedValue({ docs: [fixture({ pdf: '/sample.pdf' })] })
    const { upcoming } = await getConcertEvents()
    expect(upcoming[0].ctaHref).toBeUndefined()
    expect(upcoming[0].ctaLabel).toBeUndefined()
    expect(upcoming[0].footerNote).toBeUndefined()
    expect(upcoming[0].links).toEqual([{ label: 'Programme', href: '/sample.pdf' }])
  })

  it.each([
    {
      resource: { photo_links: [{ link: 'https://example.org/gallery' }] },
      label: 'View photos',
      href: 'https://example.org/gallery',
      note: 'Photos available.',
    },
    {
      resource: { video_links: [{ link: 'https://example.org/video' }] },
      label: 'Watch recording',
      href: 'https://example.org/video',
      note: 'Recordings available.',
    },
    {
      resource: { pdf: '/sample.pdf' },
      label: 'View programme',
      href: '/sample.pdf',
      note: undefined,
    },
  ])('past concerts point their action at $label', async ({ resource, label, href, note }) => {
    find.mockResolvedValue({
      docs: [
        fixture({
          ...resource,
          performances: [{ ...fixture().performances[0], dateTime: '2026-01-01T06:00:00Z' }],
        }),
      ],
    })
    const { previous } = await getConcertEvents()
    expect(previous[0].ctaLabel).toBe(label)
    expect(previous[0].ctaHref).toBe(href)
    expect(previous[0].footerNote).toBe(note)
    expect(previous[0].performances[0].bookingUrl).toBeUndefined()
  })

  it('has no dead See Now action for a past concert without resources', async () => {
    find.mockResolvedValue({
      docs: [
        fixture({
          performances: [{ ...fixture().performances[0], dateTime: '2026-01-01T06:00:00Z' }],
        }),
      ],
    })
    const { previous } = await getConcertEvents()
    expect(previous[0].links).toEqual([])
    expect(previous[0].ctaHref).toBeUndefined()
    expect(previous[0].ctaLabel).toBeUndefined()
  })
})
