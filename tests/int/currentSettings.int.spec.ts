import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import { getCurrentSettingsRecord } from '@/lib/getCurrentSettingsRecord'
import { protectCurrentSettingsRecord } from '@/hooks/protectCurrentSettingsRecord'
import { CalendarLink } from '@/collections/CalendarLink'
import { getSocialLinks } from '@/lib/getSiteSettings'

const api = vi.hoisted(() => ({
  find: vi.fn(),
  findByID: vi.fn(),
  findGlobal: vi.fn(),
  count: vi.fn(),
}))
vi.mock('payload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('payload')>()),
  getPayload: async () => api,
}))
vi.mock('@payload-config', () => ({ default: {} }))
beforeEach(() => {
  vi.resetAllMocks()
  api.findGlobal.mockResolvedValue({})
})

describe('current website records', () => {
  it('requires a calendar destination, including when an editor clears the last saved URL', () => {
    const validate = CalendarLink.hooks!.beforeValidate![0]
    expect(() =>
      validate({
        data: { publicLink: '' },
        originalDoc: { publicLink: 'https://example.org/calendar' },
      } as never),
    ).toThrow(
      expect.objectContaining({
        status: 400,
        data: expect.objectContaining({
          errors: [{ path: 'publicLink', message: 'Add at least one calendar link.' }],
        }),
      }),
    )
    expect(
      validate({
        data: { title: 'Renamed' },
        originalDoc: { publicLink: 'https://example.org/calendar' },
      } as never),
    ).toEqual({ title: 'Renamed' })
  })
  it('omits malformed legacy social destinations from public links', async () => {
    api.findGlobal.mockResolvedValue({
      social: { instagram: 'not-a-url', youtube: 'https://youtube.com/@ayo' },
    })
    expect(await getSocialLinks()).toEqual([
      { platform: 'youtube', name: 'Youtube', href: 'https://youtube.com/@ayo' },
    ])
  })
  it('uses the explicitly chosen calendar without choosing a more recently edited record', async () => {
    api.findGlobal.mockResolvedValue({ currentContent: { calendar: 'chosen' } })
    api.findByID.mockResolvedValue({ id: 'chosen', title: 'Chosen calendar' })
    expect(await getCurrentSettingsRecord('calendar-links')).toMatchObject({ id: 'chosen' })
    expect(api.find).not.toHaveBeenCalled()
    expect(api.findByID).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'chosen', collection: 'calendar-links' }),
    )
  })
  it('uses the independent data agreement selector', async () => {
    api.findGlobal.mockResolvedValue({
      currentContent: { calendar: 'calendar', dataAgreement: 'agreement' },
    })
    api.findByID.mockResolvedValue({ id: 'agreement' })
    expect(await getCurrentSettingsRecord('processing-of-data-agreement')).toMatchObject({
      id: 'agreement',
    })
  })
  it('preserves a single legacy record without writing to settings', async () => {
    api.find.mockResolvedValue({ totalDocs: 1, docs: [{ id: 'legacy' }] })
    expect(await getCurrentSettingsRecord('calendar-links')).toMatchObject({ id: 'legacy' })
  })
  it('does not choose arbitrarily between multiple unselected records', async () => {
    api.find.mockResolvedValue({ totalDocs: 2, docs: [{ id: 'a' }, { id: 'b' }] })
    expect(await getCurrentSettingsRecord('calendar-links')).toBeNull()
  })
  it('does not silently substitute a different record when the chosen record is missing', async () => {
    api.findGlobal.mockResolvedValue({ currentContent: { calendar: 'missing' } })
    api.findByID.mockResolvedValue(null)
    expect(await getCurrentSettingsRecord('calendar-links')).toBeNull()
    expect(api.find).not.toHaveBeenCalled()
  })
  it('blocks deleting the selected record using the same request and access checks', async () => {
    api.findGlobal.mockResolvedValue({ currentContent: { calendar: 'chosen' } })
    const req = { payload: api } as unknown as PayloadRequest
    await expect(
      protectCurrentSettingsRecord('calendar-links')({
        req,
        id: 'chosen',
        collection: {},
      } as never),
    ).rejects.toMatchObject({ status: 400 })
    expect(api.findGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ req, overrideAccess: false }),
    )
  })
  it('protects the sole legacy record but permits deleting an unused record', async () => {
    const req = { payload: api } as unknown as PayloadRequest
    api.find
      .mockResolvedValueOnce({ docs: [{ id: 'legacy' }] })
      .mockResolvedValueOnce({ docs: [{ id: 'legacy' }, { id: 'qa-record' }] })
    const protect = protectCurrentSettingsRecord('calendar-links')
    await expect(protect({ req, id: 'legacy' } as never)).rejects.toMatchObject({ status: 400 })
    await expect(protect({ req, id: 'qa-record' } as never)).resolves.toBeUndefined()
  })
})
