import { getPayload } from 'payload'
import config from '@payload-config'
import type { Partner } from '@/payload-types'

export async function getPartners(): Promise<Partner[]> {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'partners',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: ['partnerType', 'sortOrder', 'name'],
      pagination: false,
    })
    return docs
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}
