import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

const testQuestions = ['TEST_FAQ_first', 'TEST_FAQ_second', 'TEST_FAQ_other_page']

describe('FAQ collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    await payload.create({
      collection: 'faqs',
      data: {
        question: 'TEST_FAQ_second',
        answer: 'Second answer.',
        category: 'join-ayo',
        sortOrder: 2,
      },
    })

    await payload.create({
      collection: 'faqs',
      data: {
        question: 'TEST_FAQ_first',
        answer: 'First answer.',
        category: 'join-ayo',
        sortOrder: 1,
      },
    })

    await payload.create({
      collection: 'faqs',
      data: {
        question: 'TEST_FAQ_other_page',
        answer: 'Unrelated answer.',
        category: 'support-us',
        sortOrder: 1,
      },
    })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'faqs',
      where: { question: { in: testQuestions } },
    })
  })

  it('filters by category', async () => {
    const { docs } = await payload.find({
      collection: 'faqs',
      where: {
        and: [{ category: { equals: 'join-ayo' } }, { question: { in: testQuestions } }],
      },
    })

    expect(docs).toHaveLength(2)
    expect(docs.every((doc) => doc.category === 'join-ayo')).toBe(true)
  })

  it('sorts by sortOrder ascending', async () => {
    const { docs } = await payload.find({
      collection: 'faqs',
      where: {
        and: [{ category: { equals: 'join-ayo' } }, { question: { in: testQuestions } }],
      },
      sort: 'sortOrder',
    })

    expect(docs.map((doc) => doc.question)).toEqual(['TEST_FAQ_first', 'TEST_FAQ_second'])
  })

  it('rejects an entry with no question', async () => {
    await expect(
      payload.create({
        collection: 'faqs',
        data: {
          answer: 'Answer with no question.',
          category: 'about-us',
        },
      } as never),
    ).rejects.toThrow()
  })
})
