import type { CollectionSlug, Payload } from 'payload'

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
  'calendar-links',
  'media',
] as const satisfies readonly CollectionSlug[]

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
      slug !== 'passwords' &&
      !resetCollections.some((name) => name === slug),
  )
  if (unexpected.length || payload.config.globals.some(({ slug }) => slug !== 'site-settings'))
    throw new Error('CMS configuration changed. Review the reset scope before continuing.')

  log(`\n${apply ? 'APPLY REQUESTED' : 'DRY RUN'}\n${target}`)
  log(
    'Preserve all admin accounts and My AYO member passwords. Clear Site Settings and website content.',
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

  for (const { slug } of versioned) await payload.db.deleteVersions({ collection: slug, where: {} })

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
  log('\nReset complete. Admin accounts and My AYO member passwords preserved.')
}
