import { describe, expect, it } from 'vitest'
import {
  safeHref,
  validateCalendarURL,
  validateDocumentURL,
  validateRequiredDocumentURL,
  validateWebURL,
} from '@/lib/urls'

describe('website destinations', () => {
  it.each([
    'not-a-url',
    'TBA',
    '#',
    '//example.org',
    'javascript:alert(1)',
    'data:text/html,test',
    'https://',
    'https://user:password@example.org',
    'https://example.org/bad path',
    '/\\example.org',
  ])('rejects unusable destination %s', (value) => {
    expect(safeHref(value)).toBeUndefined()
    expect(validateWebURL(value)).not.toBe(true)
  })
  it('accepts full web URLs and trims their surrounding spaces', () => {
    expect(safeHref(' https://example.org/test?q=1 ')).toBe('https://example.org/test?q=1')
    expect(validateWebURL('http://localhost:3000/test')).toBe(true)
  })
  it('allows site document paths only for document fields', () => {
    expect(validateDocumentURL('/api/media/file/handbook.pdf')).toBe(true)
    expect(validateWebURL('/api/media/file/handbook.pdf')).not.toBe(true)
  })
  it('allows empty optional links but requires a destination for a member document', () => {
    expect(validateWebURL('')).toBe(true)
    expect(validateDocumentURL(null)).toBe(true)
    expect(validateRequiredDocumentURL('   ')).not.toBe(true)
  })
  it('allows webcal subscriptions without allowing them as ordinary web links', () => {
    expect(validateCalendarURL('webcal://example.org/calendar.ics')).toBe(true)
    expect(validateWebURL('webcal://example.org/calendar.ics')).not.toBe(true)
  })
})
