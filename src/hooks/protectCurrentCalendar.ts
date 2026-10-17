import { APIError, type CollectionBeforeDeleteHook } from 'payload'

export const protectCurrentCalendar: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const settings = await req.payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    req,
    overrideAccess: false,
  })
  const selected = settings.currentContent?.calendar
  const selectedID = typeof selected === 'object' ? selected?.id : selected
  let current = selectedID === String(id)
  if (!selectedID) {
    // Avoid MongoDB's estimated count operation inside a delete transaction.
    const { docs } = await req.payload.find({
      collection: 'calendar-links',
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
      'My AYO is using this calendar. Choose another calendar in Site Settings before deleting it.',
      400,
    )
}
