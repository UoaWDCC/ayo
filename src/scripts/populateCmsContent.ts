import type { Payload } from 'payload'
import { buildClientContent, type Seed } from './clientContent'
import type { ClientContentInput } from './clientContent/input'
import { populateCmsImages } from './populateCmsImages'
import { populateJoinStory } from './populateJoinStory'

async function existingID(payload: Payload, seed: Seed): Promise<string | undefined> {
  const { docs } = await payload.find({
    collection: seed.collection,
    where: seed.where,
    limit: 2,
    depth: 0,
    overrideAccess: true,
  })
  if (docs.length > 1)
    throw new Error(`Multiple records match ${seed.key}. Resolve duplicates first.`)
  return docs[0]?.id
}

export async function populateCmsContent({
  payload,
  input,
  target,
  apply = false,
  includeImages = false,
  fillMissingBios = false,
  confirm,
  log = console.log,
}: {
  payload: Payload
  input: ClientContentInput
  target: string
  apply?: boolean
  includeImages?: boolean
  fillMissingBios?: boolean
  confirm: (phrase: string) => Promise<string>
  log?: (message: string) => void
}): Promise<void> {
  const clientContent = buildClientContent(input)
  log(`\n${apply ? 'APPLY REQUESTED' : 'DRY RUN'}\n${target}`)
  log(
    'Create missing client text records. Existing records, admin accounts and passwords are preserved.',
  )
  log(
    includeImages
      ? 'Fill missing images from reviewed sources. Existing image assignments are preserved.'
      : 'No images are uploaded or assigned. Partners start inactive until their logos are added.',
  )
  log('Matching uses page URLs, names and FAQ questions. Renamed records may need manual matching.')
  log('Stop the app and other writers before applying. New content is visible immediately.')

  const keys = new Set(clientContent.map(({ key }) => key))
  if (keys.size !== clientContent.length)
    throw new Error('Duplicate keys in the client content manifest.')
  const ids = new Map<string, string>()
  const missing: Seed[] = []
  for (const seed of clientContent) {
    const id = await existingID(payload, seed)
    if (id) ids.set(seed.key, id)
    else missing.push(seed)
    log(`${id ? 'Keep' : 'Create'} ${seed.key}`)
  }
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
  })
  const fillInstagram = Boolean(input.instagramUrl?.trim()) && !settings.social?.instagram?.trim()
  log(`${fillInstagram ? 'Fill' : 'Keep'} Instagram profile URL in Site Settings`)
  log(`\n${missing.length} records to create, ${ids.size} existing records to keep.`)
  log('\nStill needs manual work:')
  input.pending.forEach((message) => log(`- ${message}`))
  const joinPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'join-ayo' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (
    !input.joinStory &&
    !joinPage.docs[0]?.layout?.some((block) => block.blockType === 'join-stage')
  )
    log('- Add the Join AYO Scroll Story in Pages > Join AYO with approved copy and photos.')
  if (input.joinStory)
    await populateJoinStory({ payload, story: input.joinStory, includeImages, log })
  if (includeImages) await populateCmsImages({ payload, images: input.images, log })
  if (fillMissingBios) await fillPlayerBiographies(payload, input.players, false, log)
  if (!apply) {
    log('\nDry run complete. No records or files changed.')
    return
  }
  if ((await confirm(target)) !== target)
    throw new Error('Confirmation did not match. Nothing written.')

  for (const seed of missing) {
    const existing = await existingID(payload, seed)
    if (existing) {
      ids.set(seed.key, existing)
      log(`Keep ${seed.key}`)
      continue
    }
    const doc = await payload.create({
      collection: seed.collection,
      data: seed.data(ids),
      depth: 0,
      overrideAccess: true, // Intentional CLI import, including fixed page records.
    })
    ids.set(seed.key, doc.id)
    log(`Created ${seed.key}`)
  }
  if (fillInstagram) {
    const latest = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
    })
    if (!latest.social?.instagram?.trim()) {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: { social: { ...latest.social, instagram: input.instagramUrl } },
        overrideAccess: true,
      })
    }
  }
  if (input.joinStory)
    await populateJoinStory({ payload, story: input.joinStory, includeImages, apply: true, log })
  if (includeImages) await populateCmsImages({ payload, images: input.images, apply: true, log })
  if (fillMissingBios) await fillPlayerBiographies(payload, input.players, true, log)
  log('\nPopulation complete. Review the site before production.')
}

async function fillPlayerBiographies(
  payload: Payload,
  players: ClientContentInput['players'],
  apply: boolean,
  log: (message: string) => void,
): Promise<void> {
  for (const player of players.filter(({ description }) => description.trim())) {
    const { docs } = await payload.find({
      collection: 'people',
      where: { and: [{ name: { equals: player.name } }, { type: { equals: 'player' } }] },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    })
    if (docs.length > 1) throw new Error(`Multiple biography matches for ${player.name}.`)
    const doc = docs[0]
    if (!doc || doc.description?.trim()) continue
    log(`${apply ? 'Fill' : 'Would fill'} missing biography: ${player.name}`)
    if (apply) {
      const result = await payload.update({
        collection: 'people',

        where: {
          and: [{ id: { equals: doc.id } }, { description: { equals: doc.description ?? null } }],
        },
        data: { description: player.description },
        overrideAccess: true,
      })
      if (result.errors.length) throw new Error(`Could not fill biography for ${player.name}.`)
    }
  }
}
