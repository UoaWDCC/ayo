import { describe, expect, it, vi } from 'vitest'
import type { Page } from '@/payload-types'
import type { Payload, UploadFieldValidation, Where } from 'payload'
import { validatePartnerLogo } from '@/collections/Partners'
import { buildClientContent } from '@/scripts/clientContent'
import { cmsContentFixture } from '../fixtures/cmsContent'
import { populateCmsContent } from '@/scripts/populateCmsContent'

const target = 'POPULATE localhost:27017/ayo_test | media not configured'
const clientContent = buildClientContent(cmsContentFixture)
type RecordData = { id: string; [key: string]: unknown }

function matches(doc: RecordData, where: Where): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (key === 'and') return (condition as Where[]).every((part) => matches(doc, part))
    return doc[key] === (condition as { equals: unknown }).equals
  })
}

function setup() {
  const records = new Map<string, RecordData[]>()
  let social = { instagram: '', facebook: 'https://facebook.com/keep-me' }
  let sequence = 0
  const api = {
    find: vi.fn(async ({ collection, where }: { collection: string; where: Where }) => ({
      docs: (records.get(collection) ?? []).filter((doc) => matches(doc, where)),
    })),
    create: vi.fn(async ({ collection, data }: { collection: string; data: object }) => {
      const doc = { ...data, id: `record-${++sequence}` }
      records.set(collection, [...(records.get(collection) ?? []), doc])
      return doc
    }),
    findGlobal: vi.fn(async () => ({ social })),
    updateGlobal: vi.fn(async ({ data }: { data: { social: typeof social } }) => {
      social = data.social
    }),
    update: vi.fn(
      async ({ collection, where, data }: { collection: string; where: Where; data: object }) => {
        const docs = (records.get(collection) ?? []).filter((doc) => matches(doc, where))
        docs.forEach((doc) => Object.assign(doc, data))
        return { docs, errors: [] }
      },
    ),
  }
  const confirm = vi.fn(async () => target)
  const run = (apply = false, fillMissingBios = false) =>
    populateCmsContent({
      payload: api as unknown as Payload,
      input: cmsContentFixture,
      target,
      apply,
      fillMissingBios,
      confirm,
      log: vi.fn(),
    })
  return { api, records, confirm, run, getSocial: () => social }
}

describe('Text-only client population', () => {
  it('only fills blank biographies when explicitly enabled and preserves other fields', async () => {
    const { api, records, run } = setup()
    await run(true)
    const player = records.get('people')!.find((doc) => doc.type === 'player')!
    player.description = ''
    player.photo = 'client-photo'
    await run(true)
    expect(player.description).toBe('')
    await run(true, true)
    expect(player.description).toBe(cmsContentFixture.players[0].description)
    expect(player.photo).toBe('client-photo')
    expect(api.update).toHaveBeenCalledTimes(1)
    player.description = 'Client edited biography'
    await run(true, true)
    expect(player.description).toBe('Client edited biography')
    expect(api.update).toHaveBeenCalledTimes(1)
  })

  it('previews missing biographies without changing them', async () => {
    const { api, records, run } = setup()
    await run(true)
    const player = records.get('people')!.find((doc) => doc.type === 'player')!
    player.description = ''
    await run(false, true)
    expect(player.description).toBe('')
    expect(api.update).not.toHaveBeenCalled()
  })

  it('includes all four My AYO sections with their headings and subtitles', () => {
    const seed = clientContent.find(({ key }) => key === 'pages:my-ayo')!
    const page = seed.data(new Map()) as Page
    const sections = page.layout?.filter((block) => block.blockType === 'member-section') ?? []
    expect(sections.map(({ section }) => section)).toEqual([
      'login',
      'calendar',
      'resources',
      'links',
    ])
    for (const section of sections) {
      expect(section.heading.trim()).not.toBe('')
      expect(section.subtitle?.trim()).toBeTruthy()
    }
  })

  it('allows missing logos only for inactive partners and retains upload ID validation', async () => {
    const options = (isActive: boolean) =>
      ({
        siblingData: { isActive },
        event: 'onChange',
        relationTo: 'media',
        req: { payload: { collections: { media: {} }, db: { defaultIDType: 'text' } } },
      }) as unknown as Parameters<UploadFieldValidation>[1]
    expect(await validatePartnerLogo(null, options(false))).toBe(true)
    expect(await validatePartnerLogo(null, options(true))).toBe(
      'Add a logo before making this partner active.',
    )
    expect(await validatePartnerLogo('manual-photo', options(true))).toBe(true)
    expect(await validatePartnerLogo({} as never, options(false))).toContain(
      'invalid relationships',
    )
  })

  it('defaults to a read-only dry run without confirmation', async () => {
    const { api, confirm, run } = setup()
    await run()
    expect(api.find).toHaveBeenCalledTimes(clientContent.length)
    expect(confirm).not.toHaveBeenCalled()
    expect(api.create).not.toHaveBeenCalled()
    expect(api.updateGlobal).not.toHaveBeenCalled()
  })

  it('requires the exact target before writing', async () => {
    const { api, confirm, run } = setup()
    confirm.mockResolvedValue('yes')
    await expect(run(true)).rejects.toThrow('Nothing written')
    expect(api.create).not.toHaveBeenCalled()
    expect(api.updateGlobal).not.toHaveBeenCalled()
  })

  it('creates all text and resolves relationships without uploading or activating partners', async () => {
    const { api, records, run, getSocial } = setup()
    await run(true)
    expect(api.create).toHaveBeenCalledTimes(clientContent.length)
    expect(records.get('pages')).toHaveLength(9)
    expect(records.get('faqs')).toHaveLength(6)
    expect(records.get('people')).toHaveLength(2)
    const roles = new Set(records.get('roles')!.map(({ id }) => id))
    const teamRoles = new Set(records.get('team-roles')!.map(({ id }) => id))
    for (const person of records.get('people')!) {
      expect(person.photo).toBeUndefined()
      if (person.type === 'player') expect(roles.has(person.role as string)).toBe(true)
      else for (const role of person.teamRoles as string[]) expect(teamRoles.has(role)).toBe(true)
    }
    for (const partner of records.get('partners')!) {
      expect(partner.isActive).toBe(false)
      expect(partner.logo).toBeUndefined()
    }
    expect([...records.keys()].sort()).toEqual([
      'faqs',
      'pages',
      'partners',
      'people',
      'roles',
      'team-roles',
    ])
    expect(getSocial()).toEqual({
      instagram: 'https://instagram.com/example',
      facebook: 'https://facebook.com/keep-me',
    })
  })

  it('preserves existing edits, images and social settings on reruns', async () => {
    const { api, records, run } = setup()
    await run(true)
    const person = records.get('people')![0]
    person.description = 'Client revised biography'
    person.photo = 'manual-photo'
    api.findGlobal.mockResolvedValue({
      social: { instagram: 'https://instagram.com/client', facebook: '' },
    })
    api.create.mockClear()
    api.updateGlobal.mockClear()
    await run(true)
    expect(api.create).not.toHaveBeenCalled()
    expect(api.updateGlobal).not.toHaveBeenCalled()
    expect(person).toMatchObject({ description: 'Client revised biography', photo: 'manual-photo' })
  })

  it('rejects ambiguous existing records before creating anything', async () => {
    const { api, records, run } = setup()
    records.set('partners', [
      { id: 'one', name: 'Example Partner' },
      { id: 'two', name: 'Example Partner' },
    ])
    await expect(run(true)).rejects.toThrow('Multiple records match partners:Example Partner')
    expect(api.create).not.toHaveBeenCalled()
    expect(api.updateGlobal).not.toHaveBeenCalled()
  })

  it('stops on an error and resumes missing records without duplicating earlier writes', async () => {
    const { api, records, run } = setup()
    const create = api.create.getMockImplementation()!
    let count = 0
    api.create.mockImplementation(async (args) => {
      if (++count === 20) throw new Error('Database unavailable')
      return create(args)
    })
    await expect(run(true)).rejects.toThrow('Database unavailable')
    expect(api.create).toHaveBeenCalledTimes(20)
    expect(api.updateGlobal).not.toHaveBeenCalled()
    api.create.mockImplementation(create)
    await run(true)
    expect([...records.values()].flat()).toHaveLength(clientContent.length)
    for (const docs of records.values())
      expect(new Set(docs.map(({ id }) => id)).size).toBe(docs.length)
  })

  it('keeps the fixed About Us section order and excludes source placeholders', () => {
    const ids = new Map(clientContent.map(({ key }) => [key, key]))
    const about = clientContent.find(({ key }) => key === 'pages:about-us')!
    const data = about.data(ids) as { layout: { blockType: string }[] }
    expect(data.layout.filter(({ blockType }) => blockType === 'rich-text')).toHaveLength(9)
    for (const seed of clientContent) {
      const text = JSON.stringify(seed.data(ids))
      expect(text).not.toMatch(/\(LINKS?\)|\bTBC\b|\[INSERT|—|;/)
      expect(text).not.toContain('backgroundImage')
    }
  })
})
