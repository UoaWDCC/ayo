import { createHash } from 'node:crypto'
import type { Payload } from 'payload'
import type { Page } from '@/payload-types'
import type { JoinStoryInput, ReviewedStoryImage } from './clientContent/input'
import { importReviewedImage } from './populateCmsImages'
import { safeHref } from '@/lib/urls'
import path from 'node:path'
import { access } from 'node:fs/promises'

type Story = Extract<NonNullable<Page['layout']>[number], { blockType: 'join-stage' }>

export async function populateJoinStory({
  payload,
  story,
  apply = false,
  includeImages = false,
  log = console.log,
}: {
  payload: Payload
  story?: JoinStoryInput
  apply?: boolean
  includeImages?: boolean
  log?: (message: string) => void
}): Promise<void> {
  if (!story) {
    log('Join AYO story: no reviewed input supplied. Existing content is preserved.')
    return
  }
  const readPage = async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'join-ayo' } },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    })
    if (docs.length > 1) throw new Error('Multiple Join AYO pages. Resolve duplicates first.')
    return docs[0]
  }
  const page = await readPage()
  if (page?.layout?.some((block) => block.blockType === 'join-stage')) {
    log('Keep Join AYO story, including its text and image choices.')
    return
  }
  if (story.collage.photos.length > 24 || story.sections.items.length > 4)
    throw new Error('Join AYO story allows up to 24 collage photos and 4 orchestra sections.')
  if (story.register.buttonUrl && !safeHref(story.register.buttonUrl, { allowSitePath: true }))
    throw new Error('Invalid Join AYO registration link.')
  const block: Story = {
    blockType: 'join-stage',
    opening: { heading: story.opening.heading },
    collage: {
      firstLine: { heading: story.collage.firstLine.heading },
      secondLine: { text: story.collage.secondLine.text },
      photos: story.collage.photos.map(({ label }) => ({ label })),
    },
    history: {
      heading: story.history.heading,
      eyebrow: story.history.eyebrow,
      milestones: story.history.milestones.map(({ year, title, description }) => ({
        year,
        title,
        description,
      })),
    },
    sections: {
      items: story.sections.items.map(({ name, description }) => ({ name, description })),
    },
    crescendo: { heading: story.crescendo.heading },
    finale: { heading: story.finale.heading },
    register: {
      heading: story.register.heading,
      eyebrow: story.register.eyebrow,
      body: story.register.body,
      buttonLabel: story.register.buttonLabel,
      buttonUrl: story.register.buttonUrl,
      contactName: story.register.contactName,
      contactEmail: story.register.contactEmail,
    },
  }
  const assignments: { name: string; source?: ReviewedStoryImage; assign: (id: string) => void }[] =
    [
      {
        name: 'curtain',
        source: story.opening.curtainImage,
        assign: (id) => {
          block.opening.curtainImage = id
        },
      },
      ...story.collage.photos.map((photo, index) => ({
        name: `collage ${index + 1}`,
        source: photo.image,
        assign: (id: string) => {
          block.collage.photos![index].image = id
        },
      })),
      {
        name: 'crescendo',
        source: story.crescendo.image,
        assign: (id) => {
          block.crescendo.image = id
        },
      },
      {
        name: 'finale',
        source: story.finale.image,
        assign: (id) => {
          block.finale.image = id
        },
      },
    ]
  for (const { name, source } of assignments) {
    if (!source) continue
    if ((!source.file && !safeHref(source.url)) || !safeHref(source.source) || !source.alt?.trim())
      throw new Error(
        `Join AYO ${name} needs a reviewed image URL or file, source URL and alt text.`,
      )
    if (source.file) {
      const relative = path.relative(
        path.resolve('src/scripts/clientContent/assets'),
        path.resolve(source.file),
      )
      if (relative.startsWith('..') || path.isAbsolute(relative))
        throw new Error('Story image must be inside src/scripts/clientContent/assets.')
      await access(source.file)
    }
    log(`${includeImages ? 'Import' : 'Skip'} Join AYO ${name} image${apply ? '' : ' (dry run)'}.`)
  }
  log(
    `${apply ? 'Add' : 'Would add'} Join AYO story with ${block.history.milestones?.length ?? 0} milestones.`,
  )
  log('History, orchestra section and call-to-action images are excluded from this import.')
  if (!apply) return
  if (!page) throw new Error('Create the Join AYO page before importing its story.')
  if (includeImages) {
    for (const { name, source, assign } of assignments) {
      if (!source) continue
      const hash = createHash('sha256')
        .update(source.file || source.url!)
        .digest('hex')
        .slice(0, 20)
      assign(
        await importReviewedImage(
          payload,
          { name: `Join AYO ${name}`, ...source },
          `ayo-story-${hash}.jpg`,
        ),
      )
    }
  }
  const latest = await readPage()
  if (!latest || JSON.stringify(latest.layout) !== JSON.stringify(page.layout))
    throw new Error('Join AYO changed during import. Rerun to preserve the latest edits.')
  await payload.update({
    collection: 'pages',
    id: latest.id,
    data: { layout: [...(latest.layout ?? []), block] },
    overrideAccess: true,
  })
}
