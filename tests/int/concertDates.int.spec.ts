import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Concert } from '@/payload-types'
import { formatNZDateTime } from '@/lib/concertDates'
import { getConcertEvents } from '@/lib/concertEvents'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@payload-config', () => ({ default: {} }))

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  find.mockReset()
})

const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false } as const

describe.each(['UTC', 'America/Los_Angeles', 'Pacific/Auckland'])(
  'NZ concert dates on a %s host',
  (host) => {
    it('uses NZ summer and winter offsets, independent of the host', () => {
      vi.stubEnv('TZ', host)
      expect(formatNZDateTime('2026-01-01T07:15:00Z', timeOptions)).toBe('20:15')
      expect(formatNZDateTime('2026-07-01T07:15:00Z', timeOptions)).toBe('19:15')
    })

    it('handles the NZ daylight-saving jump and repeated hour', () => {
      vi.stubEnv('TZ', host)
      expect(formatNZDateTime('2026-09-26T13:30:00Z', timeOptions)).toBe('01:30')
      expect(formatNZDateTime('2026-09-26T14:30:00Z', timeOptions)).toBe('03:30')
      expect(formatNZDateTime('2026-04-04T13:30:00Z', timeOptions)).toBe('02:30')
      expect(formatNZDateTime('2026-04-04T14:30:00Z', timeOptions)).toBe('02:30')
    })
  },
)

it('returns an empty label for missing or invalid dates', () => {
  for (const value of [undefined, null, '', 'invalid']) {
    expect(formatNZDateTime(value, timeOptions)).toBe('')
  }
})

it('keeps public dates, archive month/year and upcoming classification consistent across NZ New Year', async () => {
  vi.stubEnv('TZ', 'UTC')
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-12-31T11:00:00Z'))
  const concert: Concert = {
    id: 'qa-concert',
    title: 'AYO QA New Year',
    description: {
      root: { type: 'root', version: 1, format: '', indent: 0, direction: null, children: [] },
    },
    photo: 'qa-media',
    repertoire: [{ composer: 'QA', workTitle: 'QA' }],
    performances: [
      {
        dateTime: '2026-12-31T11:30:00Z',
        dateTime_tz: 'Pacific/Auckland',
        venue: 'QA venue',
        venueAddress: 'QA address',
        bookingUrl: 'https://example.org/qa',
        price: 'QA',
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }
  find.mockResolvedValue({ docs: [concert] })

  const { upcoming, previous } = await getConcertEvents()
  expect(previous).toHaveLength(0)
  expect(upcoming[0]).toMatchObject({
    year: 2027,
    month: 'January',
    subtitle: 'Fri, 1 January · QA venue',
    performances: [{ time: '00:30', date: 'Friday, 1 January', venue: 'QA venue' }],
  })

  vi.setSystemTime(new Date('2026-12-31T12:00:00Z'))
  const afterPerformance = await getConcertEvents()
  expect(afterPerformance.upcoming).toHaveLength(0)
  expect(afterPerformance.previous[0].year).toBe(2027)
})
