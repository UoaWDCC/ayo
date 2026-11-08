import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'
import sharp from 'sharp'
import { populateJoinStory } from '@/scripts/populateJoinStory'
import type { JoinStoryInput } from '@/scripts/clientContent/input'
import bundledStory from '@/scripts/clientContent/joinStory.json'

const image = {
  url: 'https://example.com/orchestra.jpg',
  source: 'https://example.com/gallery',
  alt: 'Example orchestra',
}
const story: JoinStoryInput = {
  opening: { heading: 'Opening', curtainImage: image },
  collage: {
    photos: [{ label: 'Together', image }],
    firstLine: { heading: 'First' },
    secondLine: { text: 'Second' },
  },
  history: { heading: 'History', milestones: [{ year: '2000', title: 'Fictional milestone' }] },
  sections: { items: [{ name: 'Strings', description: 'Example section' }] },
  crescendo: { heading: 'Crescendo', image },
  finale: { heading: 'Finale', image },
  register: { heading: 'Auditions', buttonLabel: 'Register', buttonUrl: '/contact-us' },
}
function setup() {
  const page = {
    id: 'join-page',
    layout: [{ blockType: 'hero', slogan: 'Existing page' }] as object[],
  }
  const media: { id: string; filename: string }[] = []
  const api = {
    find: vi.fn(
      async ({
        collection,
        where,
      }: {
        collection: string
        where: { filename?: { equals: string } }
      }) => ({
        docs:
          collection === 'pages'
            ? [structuredClone(page)]
            : media.filter((doc) => doc.filename === where.filename?.equals),
      }),
    ),
    create: vi.fn(async ({ file }: { file: { name: string } }) => {
      const doc = { id: `media-${media.length + 1}`, filename: file.name }
      media.push(doc)
      return doc
    }),
    update: vi.fn(async ({ data }: { data: { layout: object[] } }) => {
      page.layout = data.layout
      return page
    }),
  }
  const log = vi.fn()
  const run = (apply = false, includeImages = true, input = story) =>
    populateJoinStory({
      payload: api as unknown as Payload,
      story: input,
      apply,
      includeImages,
      log,
    })
  return { api, page, run, log }
}
afterEach(() => vi.unstubAllGlobals())
describe('Join AYO story import', () => {
  it('previews the bundled story and verifies its local image paths without writing', async () => {
    const { api, run, log } = setup()
    await run(false, true, bundledStory)
    expect(log).toHaveBeenCalledWith('Would add Join AYO story with 5 milestones.')
    expect(api.create).not.toHaveBeenCalled()
    expect(api.update).not.toHaveBeenCalled()
  })
  it('previews text and agreed image slots without downloads or writes', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { api, run, log } = setup()
    await run()
    expect(log).toHaveBeenCalledWith('Import Join AYO curtain image (dry run).')
    expect(log).toHaveBeenCalledWith('Would add Join AYO story with 1 milestones.')
    expect(fetch).not.toHaveBeenCalled()
    expect(api.create).not.toHaveBeenCalled()
    expect(api.update).not.toHaveBeenCalled()
  })
  it('imports approved text without excluded image fields or old database IDs', async () => {
    const { run, page } = setup()
    const input = {
      ...story,
      register: { ...story.register, image: 'placeholder-id' },
      history: {
        ...story.history,
        milestones: [{ ...story.history.milestones[0], image: 'old-history-id' }],
      },
    }
    await run(true, false, input)
    expect(page.layout[0]).toEqual({ blockType: 'hero', slogan: 'Existing page' })
    expect(JSON.stringify(page.layout[1])).not.toContain('placeholder-id')
    expect(JSON.stringify(page.layout[1])).not.toContain('old-history-id')
    expect(page.layout[1]).toMatchObject({ blockType: 'join-stage', register: story.register })
  })
  it('reuses reviewed media across scenes and preserves existing stories on reruns', async () => {
    const data = await sharp({ create: { width: 12, height: 8, channels: 3, background: 'white' } })
      .jpeg()
      .toBuffer()
    const fetch = vi.fn(async () => new Response(data))
    vi.stubGlobal('fetch', fetch)
    const { api, run, page } = setup()
    await run(true)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(api.create).toHaveBeenCalledTimes(1)
    expect(page.layout[1]).toMatchObject({
      opening: { curtainImage: 'media-1' },
      collage: { photos: [{ image: 'media-1' }] },
      crescendo: { image: 'media-1' },
      finale: { image: 'media-1' },
    })
    await run(true)
    expect(api.update).toHaveBeenCalledTimes(1)
  })
  it('retries after a failed page assignment without uploading the images again', async () => {
    const data = await sharp({ create: { width: 12, height: 8, channels: 3, background: 'white' } })
      .jpeg()
      .toBuffer()
    const fetch = vi.fn(async () => new Response(data))
    vi.stubGlobal('fetch', fetch)
    const { api, run } = setup()
    api.update.mockRejectedValueOnce(new Error('Database unavailable'))
    await expect(run(true)).rejects.toThrow('Database unavailable')
    await run(true)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(api.create).toHaveBeenCalledTimes(1)
  })
  it('refuses to replace a page edited during an image download', async () => {
    const { api, run, page } = setup()
    const data = await sharp({ create: { width: 12, height: 8, channels: 3, background: 'white' } })
      .jpeg()
      .toBuffer()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        page.layout.push({ blockType: 'rich-text', content: 'New edit' })
        return new Response(data)
      }),
    )
    await expect(run(true)).rejects.toThrow('changed during import')
    expect(api.update).not.toHaveBeenCalled()
  })
  it('rejects missing source evidence before uploading', async () => {
    const { api, run } = setup()
    await expect(
      run(true, true, {
        ...story,
        opening: { heading: 'Opening', curtainImage: { ...image, source: '' } },
      }),
    ).rejects.toThrow('reviewed image URL')
    expect(api.create).not.toHaveBeenCalled()
  })
})
