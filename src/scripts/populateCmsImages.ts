import type { Payload } from 'payload'
import sharp from 'sharp'
import type { ImageSource } from './clientContent/input'

/** Optional part of the population command. Fills blank image fields only. */
export async function populateCmsImages({
  payload,
  images,
  apply = false,
  log = console.log,
}: {
  payload: Payload
  images: readonly ImageSource[]
  apply?: boolean
  log?: (message: string) => void
}): Promise<void> {
  // Resolve all names before uploading, so ambiguous matches never cause partial assignments.
  const matches = await Promise.all(
    images.map(async (image) => {
      const result = image.type
        ? await payload.find({
            collection: 'people',
            where: { and: [{ name: { equals: image.name } }, { type: { equals: image.type } }] },
            limit: 2,
            depth: 0,
            overrideAccess: true,
          })
        : await payload.find({
            collection: 'partners',
            where: { name: { equals: image.name } },
            limit: 2,
            depth: 0,
            overrideAccess: true,
          })
      if (result.docs.length > 1) throw new Error(`Multiple image matches for ${image.name}.`)
      return { image, doc: result.docs[0] }
    }),
  )
  for (const { image, doc } of matches) {
    if (!doc) {
      log(`Image target not yet present: ${image.name}`)
      continue
    }
    if (('photo' in doc && doc.photo) || ('logo' in doc && doc.logo)) {
      log(`Keep image: ${image.name}`)
      continue
    }
    log(`${apply ? 'Import' : 'Would import'} image: ${image.name}`)
    if (!apply) continue

    const filename = `ayo-source-${image.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${new URL(image.url).pathname.match(/\.[a-z]+$/i)?.[0] ?? '.jpg'}`
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs.length > 1) throw new Error(`Duplicate media filename: ${filename}`)
    let media = existing.docs[0]
    if (!media) {
      const response = await fetch(image.url, { signal: AbortSignal.timeout(30_000) })
      if (!response.ok)
        throw new Error(`Image download failed for ${image.name}: ${response.status}`)
      const data = Buffer.from(await response.arrayBuffer())
      if (data.length > 15 * 1024 * 1024) throw new Error(`Image too large: ${image.name}`)
      const metadata = await sharp(data).metadata()
      if (!['jpeg', 'png'].includes(metadata.format ?? '') || !metadata.width || !metadata.height)
        throw new Error(`Invalid portrait or logo: ${image.name}`)
      media = await payload.create({
        collection: 'media',
        data: { alt: image.type ? `Portrait of ${image.name}` : `${image.name} logo` },
        file: {
          data,
          name: filename,
          mimetype: metadata.format === 'png' ? 'image/png' : 'image/jpeg',
          size: data.length,
        },
        overrideAccess: true,
      })
    }
    // Re-read immediately before assigning so a concurrent editor's image is preserved.
    if (image.type) {
      const latest = await payload.findByID({
        collection: 'people',
        id: doc.id,
        depth: 0,
        overrideAccess: true,
      })
      if (!latest.photo)
        await payload.update({
          collection: 'people',
          id: doc.id,
          data: { photo: media.id },
          overrideAccess: true,
        })
    } else {
      const latest = await payload.findByID({
        collection: 'partners',
        id: doc.id,
        depth: 0,
        overrideAccess: true,
      })
      if (!latest.logo)
        await payload.update({
          collection: 'partners',
          id: doc.id,
          data: { logo: media.id, isActive: true },
          overrideAccess: true,
        })
    }
  }
}
