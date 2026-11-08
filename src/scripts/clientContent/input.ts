import { readFile } from 'node:fs/promises'
import type { Faq, Person } from '@/payload-types'

export type ReviewedStoryImage = { source: string; alt: string } & (
  { url: string; file?: never } | { file: string; url?: never }
)
export type JoinStoryInput = {
  opening: { heading: string; curtainImage?: ReviewedStoryImage }
  collage: {
    photos: { label?: string; image?: ReviewedStoryImage }[]
    firstLine: { heading: string }
    secondLine: { text: string }
  }
  history: {
    eyebrow?: string
    heading: string
    milestones: { year: string; title: string; description?: string }[]
  }
  sections: { items: { name: string; description?: string }[] }
  crescendo: { heading: string; image?: ReviewedStoryImage }
  finale: { heading: string; image?: ReviewedStoryImage }
  register: {
    eyebrow?: string
    heading: string
    body?: string
    buttonLabel?: string
    buttonUrl?: string
    contactName?: string
    contactEmail?: string
  }
}

export type ImageSource = {
  name: string
  type?: Person['type']
  url: string
  source: string
}

export type ClientContentInput = {
  pages: {
    slug: string
    title: string
    slogan: string
    subtitle?: string
    sections: { heading: string; paragraphs: string[] }[]
    rows?: { label: string; paragraphs: string[]; linkLabel?: string; linkUrl?: string }[]
  }[]
  faqs: { question: string; answer: string; category: Faq['category']; sortOrder: number }[]
  players: { name: string; years: string; description: string; sortOrder: number; role: string }[]
  team: { name: string; roles: string[]; years: string }[]
  partners: { name: string; websiteUrl: string }[]
  images: ImageSource[]
  pending: string[]
  instagramUrl?: string
  joinStory?: JoinStoryInput
}

export async function loadClientContent(
  file = process.env.CMS_CONTENT_FILE || '.private/cms-content/content.json',
): Promise<ClientContentInput> {
  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch {
    throw new Error(
      'Private CMS input is unavailable. Set CMS_CONTENT_FILE to your private JSON file.',
    )
  }
  let input: unknown
  try {
    input = JSON.parse(text)
  } catch {
    throw new Error('Private CMS input must be valid JSON.')
  }
  if (!input || typeof input !== 'object') throw new Error('Invalid private CMS input.')
  for (const key of ['pages', 'faqs', 'players', 'team', 'partners', 'images', 'pending']) {
    if (!Array.isArray((input as Record<string, unknown>)[key]))
      throw new Error(`Private CMS input must include a ${key} array.`)
  }

  return input as ClientContentInput
}
