// src/lib/posts.t

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post, Media } from '@/payload-types'

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  alumni_story: 'Alumni Story',
  interview: 'Interview',
  scholarships: 'Scholarships',
  newsletters: 'Newsletters',
  education: 'Education',
  audience: 'Audience',
}

export function categoryLabel(category?: string | null): string {
  if (!category) return ''
  return CATEGORY_LABELS[category] ?? category
}

// Matches the old placeholder label style ("Sun. 21 June").
export function formatPublishedDate(date?: string | null): string {
  if (!date) return ''
  const formatted = new Intl.DateTimeFormat('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date))
  return formatted.replace(',', '')
}

export function richTextToPlainText(richText: unknown, maxLength = 220): string {
  if (!richText || typeof richText !== 'object') return ''
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  const collect = (nodes: unknown[]): string =>
    nodes
      .map((node) => {
        const n = node as { type?: string; text?: string; children?: unknown[] }
        if (n.type === 'text') return n.text ?? ''
        if (n.children) return collect(n.children)
        return ''
      })
      .join(' ')

  const text = collect(root.children).replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}

export async function getPosts(): Promise<Post[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      limit: 100,
      sort: '-publishedDate',
    })
    return docs
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs[0] || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getRelatedPosts(currentSlug: string, count = 3): Promise<Post[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { not_equals: currentSlug } },
      limit: count,
      sort: '-publishedDate',
    })
    return docs
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}
export function getPhotoUrl(photo: number | Media | null | undefined): string | null {
  if (typeof photo === 'object' && photo !== null) {
    return photo.url ?? null
  }
  return null
}
