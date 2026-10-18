import type { CollectionSlug, Payload } from 'payload'

// Explicit scope prevents a future collection from being erased accidentally.
export const resetCollections = [
  'pages',
  'posts',
  'faqs',
  'opportunities',
  'concerts',
  'people',
  'partners',
  'link',
  'team-roles',
  'roles',
  'passwords',
  'calendar-links',
  'media',
] as const satisfies readonly CollectionSlug[]

export function resetTarget(env: Partial<NodeJS.ProcessEnv>): string {
  // Require an explicit database name. Never print credentials or URI query parameters.
  const match = env.DATABASE_URL?.match(
    /^mongodb(?:\+srv)?:\/\/(?:[^/]*@)?([^/?#]+)\/([^/?#]+)(?:\?[^#]*)?$/,
  )
  if (!match) throw new Error('DATABASE_URL must specify a MongoDB host and database name.')
  const database = `${match[1]}/${match[2]}`
  const endpoint = env.S3_ENDPOINT ? new URL(env.S3_ENDPOINT) : undefined
  if (
    endpoint &&
    (!['https:', 'http:'].includes(endpoint.protocol) || endpoint.username || endpoint.password)
  )
    throw new Error('S3_ENDPOINT must be an HTTP(S) endpoint without credentials.')
  const storage = endpoint && env.S3_BUCKET ? `${endpoint.host}/${env.S3_BUCKET}` : 'not configured'
  return `RESET ${database} | media ${storage}`
}

export async function resetCmsContent({
  payload,
  target,
  apply = false,
  storageConfigured,
  confirm,
  log = console.log,
}: {
  payload: Payload
  target: string
  apply?: boolean
  storageConfigured: boolean
  confirm: (phrase: string) => Promise<string>
  log?: (message: string) => void
}): Promise<void> {
  const unexpected = payload.config.collections.filter(
    ({ slug }) =>
      !slug.startsWith('payload-') &&
      slug !== 'users' &&
      !resetCollections.some((name) => name === slug),
  )
  if (unexpected.length || payload.config.globals.some(({ slug }) => slug !== 'site-settings'))
    throw new Error('CMS configuration changed. Review the reset scope before continuing.')

  log(`\n${apply ? 'APPLY REQUESTED' : 'DRY RUN'}\n${target}`)
  log(
    'Preserve all admin accounts. Clear Site Settings and all website content, including member passwords.',
  )
  log('Media includes CMS uploads and generated sizes, not unrelated files in the bucket.')
  log(
    'Stop the website server and other writers before applying. This reset is not atomic or reversible.',
  )

  let mediaCount = 0
  for (const collection of resetCollections) {
    const { totalDocs } = await payload.count({ collection, overrideAccess: true, where: {} })
    if (collection === 'media') mediaCount = totalDocs
    log(`${collection}: ${totalDocs} records`)
  }
  const versioned = payload.config.collections.filter(
    ({ slug, versions }) => versions && resetCollections.some((name) => name === slug),
  )
  for (const { slug } of versioned) {
    const { totalDocs } = await payload.db.countVersions({ collection: slug, where: {} })
    log(`${slug} history: ${totalDocs} versions`)
  }
  if (!apply) {
    log('\nDry run complete. No content or files deleted.')
    return
  }
  if (mediaCount && !storageConfigured)
    throw new Error(
      'Media exists but S3 storage is incomplete. Restore its storage configuration first.',
    )
  if ((await confirm(target)) !== target)
    throw new Error('Confirmation did not match. Nothing deleted.')

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      social: { instagram: null, youtube: null, facebook: null, linkedin: null },
      currentContent: { calendar: null },
    },
  })
  for (const collection of resetCollections) {
    if (collection === 'media') continue
    if (collection === 'calendar-links') {
      // The normal delete hook protects the last calendar even after settings are cleared.
      // This confirmed, offline reset deliberately bypasses it for calendar records only.
      await payload.db.deleteMany({ collection, where: {} })
    } else {
      const result = await payload.delete({
        collection,
        where: {},
        overrideAccess: true,
        overrideLock: true,
        depth: 0,
      })
      if (result.errors.length)
        throw new Error(`Could not clear ${collection}. Reset stopped before media deletion.`)
    }
    log(`Cleared ${collection}`)
  }
  // Also remove orphaned history before the media-reference guard runs.
  for (const { slug } of versioned) await payload.db.deleteVersions({ collection: slug, where: {} })

  // Use Payload so local originals, image sizes and cloud-storage hooks all run.
  // Delete sequentially to bound storage requests and stop on the first error.
  while (true) {
    const { docs } = await payload.find({
      collection: 'media',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (!docs.length) break
    await payload.delete({
      collection: 'media',
      id: docs[0].id,
      overrideAccess: true,
      overrideLock: true,
    })
    log(`Deleted media ${docs[0].id}`)
  }
  for (const collection of resetCollections) {
    const { totalDocs } = await payload.count({ collection, where: {}, overrideAccess: true })
    if (totalDocs)
      throw new Error(`${collection} still contains records. Stop other writers before retrying.`)
  }
  log('\nReset complete. Admin accounts preserved.')
}
