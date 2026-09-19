import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { getConcertEvents } from '@/lib/concertEvents'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let mediaId: string

const TEST_TITLES = ['TEST_CONCERT_upcoming', 'TEST_CONCERT_past']

// 1x1 transparent PNG, just enough for the required `photo` upload field.
const PNG_1X1 = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000100ffff03000006000557bfabd40000000049454e44ae426082',
  'hex',
)

const testDescription = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Test description.', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

function concertData(overrides: {
  title: string
  performances: { dateTime: string }[]
  repertoire?: { composer: string; workTitle: string }[]
}) {
  return {
    title: overrides.title,
    description: testDescription,
    photo: mediaId,
    repertoire: overrides.repertoire ?? [{ composer: 'Test Composer', workTitle: 'Test Work' }],
    performances: overrides.performances.map((p) => ({
      dateTime: p.dateTime,
      venueAddress: '1 Test Street, Auckland',
      bookingUrl: 'https://example.com/tickets',
      price: '$1',
    })),
  }
}

describe('Concerts collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const media = await payload.create({
      collection: 'media',
      data: { alt: 'TEST_CONCERT_media' },
      file: {
        data: PNG_1X1,
        mimetype: 'image/png',
        name: 'test-concert.png',
        size: PNG_1X1.length,
      },
    })
    mediaId = media.id

    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()

    await payload.create({
      collection: 'concerts',
      data: concertData({ title: 'TEST_CONCERT_upcoming', performances: [{ dateTime: future }] }),
    })

    await payload.create({
      collection: 'concerts',
      data: concertData({ title: 'TEST_CONCERT_past', performances: [{ dateTime: past }] }),
    })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'concerts', where: { title: { in: TEST_TITLES } } })
    if (mediaId) await payload.delete({ collection: 'media', id: mediaId })
  })

  it('rejects a concert with no repertoire', async () => {
    await expect(
      payload.create({
        collection: 'concerts',
        data: {
          ...concertData({
            title: 'TEST_CONCERT_invalid_repertoire',
            performances: [{ dateTime: new Date().toISOString() }],
          }),
          repertoire: [],
        },
      }),
    ).rejects.toThrow()
  })

  it('rejects a concert with no performances', async () => {
    await expect(
      payload.create({
        collection: 'concerts',
        data: { ...concertData({ title: 'TEST_CONCERT_invalid_performances', performances: [] }) },
      }),
    ).rejects.toThrow()
  })

  it('splits concerts into upcoming and previous by performance date', async () => {
    const { upcoming, previous } = await getConcertEvents()

    expect(upcoming.some((e) => e.title === 'TEST_CONCERT_upcoming')).toBe(true)
    expect(previous.some((e) => e.title === 'TEST_CONCERT_past')).toBe(true)
    expect(upcoming.some((e) => e.title === 'TEST_CONCERT_past')).toBe(false)
    expect(previous.some((e) => e.title === 'TEST_CONCERT_upcoming')).toBe(false)
  })

  it('resolves the photo to a usable image url', async () => {
    const { upcoming } = await getConcertEvents()
    const event = upcoming.find((e) => e.title === 'TEST_CONCERT_upcoming')

    expect(event?.image).toBeTruthy()
    expect(event?.image).not.toBe('/hero-placeholder.jpg')
  })
})
