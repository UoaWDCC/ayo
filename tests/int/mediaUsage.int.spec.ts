import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'
import { protectUsedMedia, usesMedia } from '@/hooks/protectUsedMedia'

const media = { id: 'image-id', url: 'https://images.example.org/photo.jpg', filename: 'photo.jpg' }
const api = { find: vi.fn(), findByID: vi.fn(), findVersions: vi.fn() }
const req = { payload: api } as unknown as PayloadRequest
const remove = () => protectUsedMedia({ id: media.id, req } as never)

beforeEach(() => {
  vi.resetAllMocks()
  api.findByID.mockResolvedValue(media)
  api.find.mockResolvedValue({ docs: [] })
  api.findVersions.mockResolvedValue({ docs: [], hasNextPage: false })
})

describe('media deletion protection', () => {
  it('recognises page blocks, photo arrays, rich text uploads and file links', () => {
    for (const value of [
      { layout: [{ blockType: 'hero', backgroundImage: media.id }] },
      { photos: [{ photo: { id: media.id } }] },
      {
        description: {
          root: { children: [{ type: 'upload', relationTo: 'media', value: media.id }] },
        },
      },
      { fields: { doc: { relationTo: 'media', value: media.id } } },
      { url: media.url + '?download=1' },
      { url: '/api/media/file/photo.jpg#page=2' },
    ])
      expect(usesMedia(value, media)).toBe(true)
    expect(usesMedia({ title: media.id, photo: 'another-image', empty: null }, media)).toBe(false)
  })

  it('blocks deletion and identifies the content using the image', async () => {
    api.find.mockResolvedValueOnce({ docs: [{ title: 'Home', layout: [{ image: media.id }] }] })
    await expect(remove()).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('Home'),
    })
    expect(api.findVersions).not.toHaveBeenCalled()
    expect(api.find).toHaveBeenCalledWith(
      expect.objectContaining({ req, overrideAccess: true, depth: 0 }),
    )
  })

  it('checks later history batches so restoring old content cannot lose an image', async () => {
    api.findVersions
      .mockResolvedValueOnce({ docs: [], hasNextPage: true })
      .mockResolvedValueOnce({
        docs: [{ version: { layout: [{ image: media.id }] } }],
        hasNextPage: false,
      })
    await expect(remove()).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('saved pages history'),
    })
    expect(api.findVersions).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, req, overrideAccess: true }),
    )
  })

  it('permits unused files and checks post history as well as page history', async () => {
    await expect(remove()).resolves.toBeUndefined()
    expect(api.findVersions).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'posts', req }),
    )
  })

  it('fails closed if a reference lookup fails', async () => {
    api.find.mockRejectedValueOnce(new Error('Database unavailable'))
    await expect(remove()).rejects.toThrow('Database unavailable')
  })
})
