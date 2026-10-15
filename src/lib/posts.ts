import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post, Media } from '@/payload-types'

export { categoryLabel, formatPublishedDate, richTextToPlainText } from './postPresentation'

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
export function getPhotoUrl(photo: string | number | Media | null | undefined): string | null {
  if (typeof photo === 'object' && photo !== null) {
    return photo.url ?? null
  }
  return null
}
