import { APIError, type CollectionBeforeDeleteHook } from 'payload'
import type { Media } from '@/payload-types'

// Upload fields used by the public site, including uploads inside page blocks and post arrays.
const uploadFields = new Set(['photo', 'image', 'logo', 'backgroundImage'])
const sources = [
  'pages',
  'posts',
  'concerts',
  'people',
  'partners',
  'opportunities',
  'link',
] as const

function uploadID(value: unknown): unknown {
  return value && typeof value === 'object' && 'id' in value ? value.id : value
}

export function usesMedia(value: unknown, media: Pick<Media, 'id' | 'url' | 'filename'>): boolean {
  if (typeof value === 'string') {
    // Also protect document links and rich-text links that use the file URL rather than an upload ID.
    const destination = value.split(/[?#]/, 1)[0]
    return Boolean(
      (media.url && destination === media.url.split(/[?#]/, 1)[0]) ||
      (media.filename && destination === `/api/media/file/${encodeURIComponent(media.filename)}`),
    )
  }
  if (Array.isArray(value)) return value.some((item) => usesMedia(item, media))
  if (!value || typeof value !== 'object') return false
  const node = value as Record<string, unknown>
  if (node.relationTo === 'media' && uploadID(node.value) === media.id) return true
  return Object.entries(node).some(([key, child]) =>
    uploadFields.has(key) && uploadID(child) === media.id ? true : usesMedia(child, media),
  )
}

export const protectUsedMedia: CollectionBeforeDeleteHook = async ({ req, id }) => {
  // Inspect every reference, including content hidden from the current editor. Deletion must
  // never break someone else's content. All reads share the delete request's transaction.
  const media = await req.payload.findByID({
    collection: 'media',
    id,
    depth: 0,
    req,
    overrideAccess: true,
  })
  for (const collection of sources) {
    const { docs } = await req.payload.find({
      collection,
      pagination: false,
      depth: 0,
      req,
      overrideAccess: true,
    })
    const usedBy = docs.find((doc) => usesMedia(doc, media))
    if (usedBy) {
      const label = 'title' in usedBy ? usedBy.title : usedBy.name
      throw new APIError(
        `This file is used by ${collection}: "${label}". Remove or replace it there before deleting it.`,
        400,
      )
    }
  }
  for (const collection of ['pages', 'posts'] as const) {
    // Read history in batches so older references are checked without loading it all at once.
    let page = 1
    while (true) {
      const result = await req.payload.findVersions({
        collection,
        page,
        limit: 100,
        depth: 0,
        req,
        overrideAccess: true,
      })
      if (result.docs.some((doc) => usesMedia(doc.version, media)))
        throw new APIError(
          `This file is used in saved ${collection} history. Keep it so earlier edits can be restored.`,
          400,
        )
      if (!result.hasNextPage) break
      page++
    }
  }
}
