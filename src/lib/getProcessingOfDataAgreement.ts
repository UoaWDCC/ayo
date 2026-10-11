import { getPayload } from 'payload'
import config from '@payload-config'
import type { ProcessingOfDataAgreement } from '@/payload-types'

export async function getProcessingOfDataAgreement(): Promise<ProcessingOfDataAgreement | null> {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'processing-of-data-agreement',
      sort: '-updatedAt',
      limit: 1,
    })

    return docs[0] ?? null
  } catch (error) {
    console.error('Error fetching processing of data agreement:', error)
    return null
  }
}
