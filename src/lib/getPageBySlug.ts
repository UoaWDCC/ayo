import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page } from '@/payload-types'

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return docs[0] || null
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return null
  }
}
