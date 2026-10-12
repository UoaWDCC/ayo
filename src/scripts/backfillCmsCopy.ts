/**
 * One-off backfill for the copy that used to be hardcoded in the frontend.
 *
 * Every page heading, sub-line and outbound social URL now comes from Payload.
 * This script writes the previous hardcoded values into the matching CMS
 * fields so the site reads exactly as it did before the change.
 *
 * Run once per environment:
 *
 *   pnpm payload run src/scripts/backfillCmsCopy.ts
 *
 * It only ever fills blanks: a field an editor has already set is left alone,
 * so running it twice changes nothing. Anything it can't fill on its own is
 * printed at the end as a short to-do list.
 *
 * Set DRY_RUN=1 to print what would be written without touching the database
 * (`payload run` keeps its own CLI flags, so this is an env var, not a flag):
 *
 *   DRY_RUN=1 pnpm payload run src/scripts/backfillCmsCopy.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

/** Hero slogan + subtitle, keyed by page slug. */
const HERO_COPY: Record<string, { slogan: string; subtitle: string }> = {
  home: {
    slogan: 'Here Plays The Future',
    subtitle: "Aotearoa's first and original youth orchestra, founded 1948.",
  },
  'about-us': {
    slogan: 'About Us',
    subtitle: "Aotearoa's first and original youth orchestra, founded 1948.",
  },
  news: { slogan: 'News', subtitle: 'Catch up to the latest updates about us.' },
  'concerts-events': {
    slogan: 'Concerts & Events',
    subtitle: 'Full symphonic programmes performed by our own ranks.',
  },
  'join-ayo': {
    slogan: 'Join AYO',
    subtitle: "Play alongside Aotearoa's most talented young musicians.",
  },
  'support-us': {
    slogan: 'Support Us',
    subtitle: 'Help us keep music thriving for the next generation.',
  },
  'contact-us': { slogan: 'Contact Us', subtitle: "We'd love to hear from you." },
  'my-ayo': {
    slogan: 'My AYO',
    subtitle: 'The calendar, resources and links for current AYO members.',
  },
  policies: {
    slogan: 'Policies',
    subtitle: 'Guidelines and procedures that keep AYO running smoothly.',
  },
}

/** Headings for the fixed sections of the My AYO page. */
const MY_AYO_SECTIONS = [
  {
    section: 'login' as const,
    heading: 'Member login',
    subtitle: "Enter the members' password to continue.",
  },
  {
    section: 'calendar' as const,
    heading: 'Calendar',
    subtitle: 'Rehearsals, concerts and key dates for the season.',
  },
  {
    section: 'resources' as const,
    heading: 'Resources',
    subtitle: 'Handbooks, forms and documents for members.',
  },
  {
    section: 'links' as const,
    heading: 'Links',
    subtitle: 'Useful sites and services for AYO members.',
  },
]

const HIGHLIGHTS_VIDEO_URL = 'https://youtu.be/8HixIOtXEN4?si=N13_yW1Zjo5zVaH-'
const HIGHLIGHTS_VIDEO_CAPTION = '75th Anniversary Concert - Friday, 23rd of October, 2023'
const INSTAGRAM_URL = 'https://www.instagram.com/aucklandyouthorchestra/'

const dryRun = process.env.DRY_RUN === '1'

const todo: string[] = []
const written: string[] = []

const blank = (value?: string | null) => !value || value.trim() === ''

async function run() {
  const payload = await getPayload({ config })

  if (dryRun) console.log('\nDRY RUN — nothing will be written.')

  for (const [slug, copy] of Object.entries(HERO_COPY)) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const page = docs[0]

    // A route with no page document behind it has nowhere to keep its copy, so
    // create the document. The hero block can't be created here (its background
    // image is required), which is why the subtitle goes on the to-do list.
    if (!page) {
      const newLayout: LayoutBlock[] =
        slug === 'my-ayo'
          ? MY_AYO_SECTIONS.map((section) => ({ blockType: 'member-section', ...section }))
          : []

      if (!dryRun) {
        await payload.create({
          collection: 'pages',
          data: { title: copy.slogan, slug, layout: newLayout },
        })
      }

      written.push(`${slug}: created the page, titled "${copy.slogan}"`)
      todo.push(
        `The new "${slug}" page has no hero block — add one (it needs a background image) and set its subtitle to "${copy.subtitle}".`,
      )
      continue
    }

    const layout: LayoutBlock[] = [...(page.layout ?? [])]
    let changed = false

    const hero = layout.find((block) => block.blockType === 'hero')
    if (!hero) {
      todo.push(
        `The "${slug}" page has no hero block — add one (it needs a background image), then set its slogan to "${copy.slogan}".`,
      )
    } else {
      if (blank(hero.slogan)) {
        hero.slogan = copy.slogan
        changed = true
        written.push(`${slug}: hero slogan`)
      }
      if (blank(hero.subtitle)) {
        hero.subtitle = copy.subtitle
        changed = true
        written.push(`${slug}: hero subtitle`)
      }
    }

    if (slug === 'my-ayo') {
      for (const section of MY_AYO_SECTIONS) {
        const existing = layout.find(
          (block) => block.blockType === 'member-section' && block.section === section.section,
        )
        if (existing) continue

        layout.push({ blockType: 'member-section', ...section })
        changed = true
        written.push(`my-ayo: ${section.section} section heading`)
      }
    }

    if (slug === 'home') {
      const quote = layout.find((block) => block.blockType === 'quote')
      if (!quote) {
        todo.push(
          'The home page has no quote block, so its video section is not rendered. Add one (quote text + image are required) and set its video URL to ' +
            `${HIGHLIGHTS_VIDEO_URL}.`,
        )
      } else if (blank(quote.videoUrl)) {
        quote.videoUrl = HIGHLIGHTS_VIDEO_URL
        changed = true
        written.push('home: quote block video URL')
      }
    }

    if (slug === 'concerts-events') {
      const video = layout.find((block) => block.blockType === 'video')
      if (!video) {
        layout.push({
          blockType: 'video',
          videoUrl: HIGHLIGHTS_VIDEO_URL,
          text: HIGHLIGHTS_VIDEO_CAPTION,
        })
        changed = true
        written.push('concerts-events: highlights video block')
      } else if (blank(video.videoUrl)) {
        video.videoUrl = HIGHLIGHTS_VIDEO_URL
        changed = true
        written.push('concerts-events: highlights video URL')
      }
    }

    if (changed && !dryRun) {
      await payload.update({ collection: 'pages', id: page.id, data: { layout } })
    }
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (blank(settings?.social?.instagram)) {
    if (!dryRun) {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: { social: { ...settings?.social, instagram: INSTAGRAM_URL } },
      })
    }
    written.push('site settings: Instagram URL')
  }

  // The footer's other three icons only ever pointed at "#", so there is no
  // previous value to restore for them.
  for (const platform of ['youtube', 'facebook', 'linkedin'] as const) {
    if (blank(settings?.social?.[platform])) {
      todo.push(
        `Site Settings → Social Media → ${platform}: no URL on record, add the real profile link.`,
      )
    }
  }

  const verb = dryRun ? 'Would fill' : 'Filled'
  console.log(
    written.length
      ? `\n${verb} ${written.length} field(s):`
      : '\nNothing to fill — already up to date.',
  )
  written.forEach((line) => console.log(`  • ${line}`))

  if (todo.length) {
    console.log('\nNeeds a person in the admin UI:')
    todo.forEach((line) => console.log(`  • ${line}`))
  }

  console.log('')
  process.exit(0)
}

await run()
