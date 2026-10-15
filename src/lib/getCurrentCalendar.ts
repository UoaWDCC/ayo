import { getPayload } from 'payload'
import config from '@payload-config'
import type { CalendarLink } from '@/payload-types'

/** Explicit selection wins. Only a single legacy record can act as a fallback. */
export async function getCurrentCalendar(): Promise<CalendarLink | null> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const selection = settings.currentContent?.calendar
    const id = typeof selection === 'object' ? selection?.id : selection
    if (id)
      return await payload.findByID({
        collection: 'calendar-links',
        id,
        depth: 1,
        disableErrors: true,
      })
    const result = await payload.find({ collection: 'calendar-links', limit: 2, depth: 1 })
    return result.totalDocs === 1 ? result.docs[0] : null
  } catch (error) {
    console.error('Could not load the current calendar:', error)
    return null
  }
}
