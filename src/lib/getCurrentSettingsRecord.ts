import { getPayload, type DataFromCollectionSlug } from 'payload'
import config from '@payload-config'

type SettingsCollection = 'calendar-links' | 'processing-of-data-agreement'

/** Explicit selection wins. Only a single legacy record can act as a fallback. */
export async function getCurrentSettingsRecord<C extends SettingsCollection>(
  collection: C,
): Promise<DataFromCollectionSlug<C> | null> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const selection =
      collection === 'calendar-links'
        ? settings.currentContent?.calendar
        : settings.currentContent?.dataAgreement
    const id = typeof selection === 'object' ? selection?.id : selection
    if (id) return await payload.findByID({ collection, id, depth: 1, disableErrors: true })
    const result = await payload.find({ collection, limit: 2, depth: 1 })
    return result.totalDocs === 1 ? result.docs[0] : null
  } catch (error) {
    console.error(`Could not load the current ${collection} record:`, error)
    return null
  }
}
