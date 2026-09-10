import { getPayload } from 'payload'
import config from '@payload-config'
import type { Faq } from '@/payload-types'

export async function getFaqsByCategory(category: Faq['category']): Promise<Faq[]> {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'faqs',
      where: {
        category: {
          equals: category,
        },
      },
      sort: 'sortOrder',
      limit: 0,
    })

    return docs
  } catch (error) {
    console.error('Error fetching FAQs by category:', error)
    return []
  }
}
