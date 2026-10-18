import { describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'
import { resetCmsContent, resetCollections, resetTarget } from '@/scripts/resetCmsContent'

const target = 'RESET localhost:27017/ayo_test | media storage.example.org/ayo-test'

function setup() {
  let applied = false
  let mediaExists = true
  const api = {
    config: {
      collections: [
        ...resetCollections.map((slug) => ({
          slug,
          versions: slug === 'pages' || slug === 'posts',
        })),
        { slug: 'users' },
        { slug: 'payload-preferences' },
      ],
      globals: [{ slug: 'site-settings' }],
    },
    count: vi.fn(async () => ({ totalDocs: applied ? 0 : 1 })),
    updateGlobal: vi.fn(async () => {
      applied = true
    }),
    delete: vi.fn(async ({ collection }: { collection: string }) => {
      if (collection === 'media') mediaExists = false
      return { docs: [], errors: [] }
    }),
    find: vi.fn(async () => ({ docs: mediaExists ? [{ id: 'media-1' }] : [] })),
    db: {
      countVersions: vi.fn(async () => ({ totalDocs: 3 })),
      deleteVersions: vi.fn(),
      deleteMany: vi.fn(),
    },
  }
  const confirm = vi.fn(async () => target)
  const run = (options = {}) =>
    resetCmsContent({
      payload: api as unknown as Payload,
      target,
      storageConfigured: true,
      confirm,
      log: vi.fn(),
      ...options,
    })
  return { api, confirm, run }
}

describe('CMS reset safety', () => {
  it('defaults to a dry run without prompting or mutating anything', async () => {
    const { api, confirm, run } = setup()
    await run()
    expect(api.count).toHaveBeenCalled()
    expect(confirm).not.toHaveBeenCalled()
    expect(api.updateGlobal).not.toHaveBeenCalled()
    expect(api.delete).not.toHaveBeenCalled()
    expect(api.db.deleteMany).not.toHaveBeenCalled()
    expect(api.db.deleteVersions).not.toHaveBeenCalled()
  })

  it('rejects a mismatched target before any deletion or settings change', async () => {
    const { api, confirm, run } = setup()
    confirm.mockResolvedValue('yes')
    await expect(run({ apply: true })).rejects.toThrow('Nothing deleted')
    expect(api.updateGlobal).not.toHaveBeenCalled()
    expect(api.delete).not.toHaveBeenCalled()
    expect(api.db.deleteMany).not.toHaveBeenCalled()
    expect(api.db.deleteVersions).not.toHaveBeenCalled()
  })

  it('refuses incomplete storage and newly added collections', async () => {
    const { api, run } = setup()
    await expect(run({ apply: true, storageConfigured: false })).rejects.toThrow('S3 storage')
    api.config.collections.push({ slug: 'future-content' as 'users' })
    await expect(run({ apply: true })).rejects.toThrow('reset scope')
    expect(api.updateGlobal).not.toHaveBeenCalled()
    expect(api.delete).not.toHaveBeenCalled()
  })

  it('clears references and history before media and preserves user accounts', async () => {
    const { api, run } = setup()
    await run({ apply: true })
    expect(api.db.deleteMany).toHaveBeenCalledExactlyOnceWith({
      collection: 'calendar-links',
      where: {},
    })
    const mediaCall = api.delete.mock.calls.findIndex(([args]) => args.collection === 'media')
    const mediaOrder = api.delete.mock.invocationCallOrder[mediaCall]
    expect(Math.max(...api.db.deleteVersions.mock.invocationCallOrder)).toBeLessThan(mediaOrder)
    expect(api.updateGlobal.mock.invocationCallOrder[0]).toBeLessThan(mediaOrder)
    expect(api.delete.mock.calls.some(([args]) => args.collection === 'users')).toBe(false)
    expect(api.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'media', id: 'media-1' }),
    )
  })

  it('stops on content deletion errors without touching media', async () => {
    const { api, run } = setup()
    api.delete.mockResolvedValueOnce({ docs: [], errors: [{ message: 'failed' }] } as never)
    await expect(run({ apply: true })).rejects.toThrow('Reset stopped before media deletion')
    expect(api.find).not.toHaveBeenCalled()
    expect(api.db.deleteVersions).not.toHaveBeenCalled()
  })

  it('stops if storage deletion fails and reports remaining content', async () => {
    const failed = setup()
    failed.api.delete.mockImplementation(async ({ collection }) => {
      if (collection === 'media') throw new Error('Storage unavailable')
      return { docs: [], errors: [] }
    })
    await expect(failed.run({ apply: true })).rejects.toThrow('Storage unavailable')
    expect(
      failed.api.delete.mock.calls.filter(([args]) => args.collection === 'media'),
    ).toHaveLength(1)

    const remaining = setup()
    remaining.api.count.mockResolvedValue({ totalDocs: 1 })
    await expect(remaining.run({ apply: true })).rejects.toThrow('still contains records')
  })
})

describe('reset target display', () => {
  it('supports replica sets and hides database credentials and URI options', () => {
    expect(
      resetTarget({
        DATABASE_URL: 'mongodb://admin:private@host1:27017,host2:27017/ayo?replicaSet=private',
        S3_ENDPOINT: 'https://storage.example.org',
        S3_BUCKET: 'ayo',
      }),
    ).toBe('RESET host1:27017,host2:27017/ayo | media storage.example.org/ayo')
    expect(
      resetTarget({ DATABASE_URL: 'mongodb+srv://admin:private@cluster.example.org/ayo' }),
    ).toBe('RESET cluster.example.org/ayo | media not configured')
  })

  it('requires an explicit database and rejects credentials in storage endpoints', () => {
    for (const DATABASE_URL of [
      undefined,
      'mongodb://localhost',
      'mongodb://localhost/?authSource=admin',
    ])
      expect(() => resetTarget({ DATABASE_URL })).toThrow('database name')
    expect(() =>
      resetTarget({
        DATABASE_URL: 'mongodb://localhost/ayo',
        S3_ENDPOINT: 'https://user:secret@storage.example.org',
      }),
    ).toThrow('without credentials')
  })
})
