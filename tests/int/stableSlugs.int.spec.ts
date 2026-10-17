import { describe, expect, it, vi } from 'vitest'
import type { CollectionBeforeValidateHook } from 'payload'
import type { Page, Post } from '@/payload-types'
import { stablePostSlug } from '@/hooks/stablePostSlug'
import { protectPageSlug } from '@/hooks/protectPageSlug'

function args<T extends Page | Post>(
  data: Partial<T>,
  originalDoc?: T,
  find = vi.fn().mockResolvedValue({ docs: [] }),
) {
  return {
    data,
    originalDoc,
    operation: originalDoc ? 'update' : 'create',
    req: { payload: { find } },
    context: {},
    collection: {},
  } as unknown as Parameters<CollectionBeforeValidateHook<T>>[0]
}

describe('stable story URLs', () => {
  it('keeps an existing URL when the title changes, without querying for a new slug', async () => {
    const find = vi.fn()
    const input = args<Post>(
      { title: 'A new title' },
      { id: 'one', title: 'Old title', slug: 'old-title' } as Post,
      find,
    )
    expect(await stablePostSlug(input)).toMatchObject({ title: 'A new title', slug: 'old-title' })
    expect(find).not.toHaveBeenCalled()
  })
  it('rejects attempts to change an established URL', async () => {
    await expect(
      stablePostSlug(args<Post>({ slug: 'replacement' }, { id: 'one', slug: 'old-title' } as Post)),
    ).rejects.toMatchObject({ status: 400 })
  })
  it('normalises new titles and passes the request to the collision check', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    const input = args<Post>({ title: 'Māori & Music!' }, undefined, find)
    expect(await stablePostSlug(input)).toMatchObject({ slug: 'maori-music' })
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ req: input.req, overrideAccess: true }),
    )
  })
  it('handles duplicate titles with a free numbered URL', async () => {
    const find = vi
      .fn()
      .mockResolvedValueOnce({ docs: [{ id: 'one' }] })
      .mockResolvedValueOnce({ docs: [{ id: 'two' }] })
      .mockResolvedValueOnce({ docs: [] })
    expect(
      await stablePostSlug(args<Post>({ title: 'Same title' }, undefined, find)),
    ).toMatchObject({ slug: 'same-title-3' })
  })
  it('gives punctuation-only titles a usable URL', async () => {
    expect(await stablePostSlug(args<Post>({ title: '!!!' }))).toMatchObject({ slug: 'story' })
  })
  it('fills a legacy missing URL from the existing title on a partial update', async () => {
    expect(
      await stablePostSlug(
        args<Post>({ author: 'Editor' }, { id: 'one', title: 'Legacy title' } as Post),
      ),
    ).toMatchObject({ slug: 'legacy-title' })
  })
})

describe('fixed page URLs', () => {
  it('allows content updates and unchanged URLs', () => {
    const original = { id: 'home', slug: 'home' } as Page
    expect(
      protectPageSlug(args<Page>({ title: 'New heading', slug: 'home' }, original)),
    ).toMatchObject({ title: 'New heading' })
    expect(protectPageSlug(args<Page>({ title: 'New heading' }, original))).toMatchObject({
      title: 'New heading',
    })
  })
  it('rejects route changes', () => {
    expect(() =>
      protectPageSlug(args<Page>({ slug: 'unknown' }, { id: 'home', slug: 'home' } as Page)),
    ).toThrow()
  })
})
