import { afterEach, describe, expect, it, vi } from 'vitest'
import sharp from 'sharp'
import type { Payload } from 'payload'
import { populateCmsImages } from '@/scripts/populateCmsImages'
import { importReviewedImage } from '@/scripts/populateCmsImages'
import { writeFile, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { cmsContentFixture } from '../fixtures/cmsContent'

function setup() {
  const person = { id: 'example-player', name: 'Example Player', type: 'player', photo: '' }
  let media: { id: string; filename: string } | undefined
  const api = {
    find: vi.fn(
      async ({
        collection,
        where,
      }: {
        collection: string
        where: { and?: { name?: { equals: string } }[] }
      }) => {
        if (collection === 'media') return { docs: media ? [media] : [] }
        return { docs: where.and?.[0].name?.equals === person.name ? [person] : [] }
      },
    ),
    findByID: vi.fn(async () => person),
    create: vi.fn(async ({ file }: { file: { name: string } }) => {
      media = { id: 'portrait', filename: file.name }
      return media
    }),
    update: vi.fn(async ({ data }: { data: { photo: string } }) => {
      Object.assign(person, data)
      return person
    }),
  }
  const run = (apply = false) =>
    populateCmsImages({
      payload: api as unknown as Payload,
      images: cmsContentFixture.images,
      apply,
      log: vi.fn(),
    })
  return { api, person, run }
}

let localImage: string | undefined
afterEach(async () => {
  vi.unstubAllGlobals()
  if (localImage) await unlink(localImage)
  localImage = undefined
})

describe('Reviewed image population', () => {
  it('uploads a bundled image without a network request', async () => {
    localImage = `src/scripts/clientContent/assets/qa-${randomUUID()}.png`
    const data = await sharp({ create: { width: 12, height: 8, channels: 3, background: 'white' } })
      .png()
      .toBuffer()
    await writeFile(localImage, data)
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { api } = setup()
    await importReviewedImage(
      api as unknown as Payload,
      { name: 'Example scene', file: localImage, alt: 'Fictional test image' },
      'example-scene.png',
    )
    expect(fetch).not.toHaveBeenCalled()
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({ file: expect.objectContaining({ data, mimetype: 'image/png' }) }),
    )
  })

  it('rejects local image paths outside the bundled asset folder', async () => {
    const { api } = setup()
    await expect(
      importReviewedImage(
        api as unknown as Payload,
        { name: 'Invalid image', file: 'README.md', alt: 'Example' },
        'invalid.jpg',
      ),
    ).rejects.toThrow('inside src/scripts/clientContent/assets')
    expect(api.create).not.toHaveBeenCalled()
  })
  it('does not download or write in a dry run', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const { api, run } = setup()
    await run()
    expect(fetch).not.toHaveBeenCalled()
    expect(api.create).not.toHaveBeenCalled()
    expect(api.update).not.toHaveBeenCalled()
  })

  it('fills a missing portrait and preserves it on reruns', async () => {
    const data = await sharp({
      create: { width: 12, height: 16, channels: 3, background: 'white' },
    })
      .png()
      .toBuffer()
    const fetch = vi.fn(async () => new Response(data))
    vi.stubGlobal('fetch', fetch)
    const { api, person, run } = setup()
    await run(true)
    expect(person.photo).toBe('portrait')
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { alt: 'Portrait of Example Player' },
        file: expect.objectContaining({ mimetype: 'image/png' }),
      }),
    )
    await run(true)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(api.create).toHaveBeenCalledTimes(1)
    expect(api.update).toHaveBeenCalledTimes(1)
  })

  it('reuses an upload after a failed assignment', async () => {
    const data = await sharp({
      create: { width: 12, height: 16, channels: 3, background: 'white' },
    })
      .png()
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

  it('rejects duplicate target names before any writes', async () => {
    const { api, run } = setup()
    api.find.mockResolvedValueOnce({ docs: [{ id: 'one' }, { id: 'two' }] } as never)
    await expect(run(true)).rejects.toThrow('Multiple image matches')
    expect(api.create).not.toHaveBeenCalled()
    expect(api.update).not.toHaveBeenCalled()
  })

  it('does not replace an image added while the download was running', async () => {
    const data = await sharp({
      create: { width: 12, height: 16, channels: 3, background: 'white' },
    })
      .png()
      .toBuffer()
    const { api, person, run } = setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        person.photo = 'client-chosen'
        return new Response(data)
      }),
    )
    await run(true)
    expect(person.photo).toBe('client-chosen')
    expect(api.update).not.toHaveBeenCalled()
  })

  it('rejects a failed download without creating or assigning media', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('Unavailable', { status: 503 })),
    )
    const { api, run } = setup()
    await expect(run(true)).rejects.toThrow('Image download failed')
    expect(api.create).not.toHaveBeenCalled()
    expect(api.update).not.toHaveBeenCalled()
  })
})
