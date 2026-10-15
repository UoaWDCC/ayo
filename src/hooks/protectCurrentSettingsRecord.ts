import { APIError, type CollectionBeforeDeleteHook } from 'payload'

export function protectCurrentSettingsRecord(
  collection: 'calendar-links' | 'processing-of-data-agreement',
): CollectionBeforeDeleteHook {
  return async ({ req, id }) => {
    const settings = await req.payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      req,
      overrideAccess: false,
    })
    const selected =
      collection === 'calendar-links'
        ? settings.currentContent?.calendar
        : settings.currentContent?.dataAgreement
    const selectedID = typeof selected === 'object' ? selected?.id : selected
    let current = selectedID === String(id)
    if (!selectedID) {
      // Avoid MongoDB's estimated count operation inside a delete transaction.
      const { docs } = await req.payload.find({
        collection,
        pagination: false,
        depth: 0,
        select: { title: true },
        req,
        overrideAccess: false,
      })
      current = docs.length === 1
    }
    if (current)
      throw new APIError(
        'This record is currently used by the website. Choose another record in Site Settings before deleting it.',
        400,
      )
  }
}
