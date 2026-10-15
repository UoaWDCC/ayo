import { describe, expect, it } from 'vitest'
import { categoryLabel, formatPublishedDate, richTextToPlainText } from '@/lib/postPresentation'

// Both the public news routes and the admin preview import these formatters.
describe('shared news presentation', () => {
  it('uses the NZ calendar date at a UTC day boundary', () => {
    expect(formatPublishedDate('2026-12-31T12:00:00.000Z')).toBe('Fri 1 January')
  })
  it('handles missing and invalid dates without breaking a preview', () => {
    expect(formatPublishedDate()).toBe('')
    expect(formatPublishedDate('not a date')).toBe('')
  })
  it('uses the same readable category names', () => {
    expect(categoryLabel('alumni_story')).toBe('Alumni Story')
    expect(categoryLabel()).toBe('')
  })
  it('extracts a nested rich-text excerpt and applies the public length limit', () => {
    const body = {
      root: {
        children: [{ type: 'paragraph', children: [{ type: 'text', text: 'A'.repeat(230) }] }],
      },
    }
    const excerpt = richTextToPlainText(body)
    expect(excerpt).toHaveLength(221)
    expect(excerpt.endsWith('…')).toBe(true)
    expect(richTextToPlainText(null)).toBe('')
  })
})
