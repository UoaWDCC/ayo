// src/lib/newsData.ts

// this whole file is a stand-in for a Payload "posts" collection. Nothing outside this file touches `rawPosts` directly
// pages only call the exported functions at the bottom so migrating should mean editing THIS file only(in theory), not the pages that use it.

export type NewsBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; alt?: string }
  | { type: 'imagePair'; images: string[]; caption?: string }

export type NewsPost = {
  id: number
  slug: string
  type: string
  title: string
  author: string
  publishLabel: string
  publishDate: string
  description: string
  heroImage: string
  body: NewsBlock[]
}

// to be replaced by payload
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

const defaultBody: NewsBlock[] = [
  {
    type: 'paragraph',
    text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance. A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
  },
  {
    type: 'heading',
    text: 'A season of new sound',
  },
  {
    type: 'imagePair',
    images: ['/grey_rectangle.png', '/grey_rectangle.png'],
    caption:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné.',
  },
  {
    type: 'paragraph',
    text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
  },
  {
    type: 'quote',
    text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné.',
  },
  {
    type: 'paragraph',
    text: 'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonín Dvořák, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
  },
  {
    type: 'image',
    src: '/grey_rectangle.png',
  },
]

// Same fields/values as the original listing array — just adds heroImage + body so each card has somewhere real to link to.

const rawPosts: Omit<NewsPost, 'slug'>[] = [
  {
    id: 1,
    type: 'Newsletter',
    title: 'AYO Newsletter - July, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Mary Lin',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 2,
    type: 'Newsletter',
    title: 'AYO Newsletter - June, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Mary Lin',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 3,
    type: 'Story',
    title: 'AYO Newsletter - May, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Mary Lin',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 4,
    type: 'Newsletter',
    title: 'AYO Newsletter - May, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 5,
    type: 'Story',
    title: 'AYO Story - June, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 6,
    type: 'Story',
    title: 'AYO Story - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 7,
    type: 'Scholarship Updates',
    title: 'AYO Story - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 8,
    type: 'Photo Essays',
    title: 'AYO Photo Essay - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 9,
    type: 'Alumni News',
    title: 'AYO Alumni News - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
  {
    id: 10,
    type: 'Story',
    title: 'AYO Story - August, 2026',
    publishLabel: 'Sun. 21 August',
    publishDate: '2026-08-21T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    author: 'Howard Lu',
    heroImage: '/grey_rectangle.png',
    body: defaultBody,
  },
]

export const newsPosts: NewsPost[] = rawPosts.map((post) => ({
  ...post,
  slug: `${slugify(post.title)}-${post.id}`,
}))

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, count = 3): NewsPost[] {
  return newsPosts.filter((post) => post.slug !== currentSlug).slice(0, count)
}
