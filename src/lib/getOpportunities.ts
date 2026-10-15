import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { safeHref } from './urls'

/**
 * One row of the Opportunities listing, shaped for the client components —
 * distinct from the `Opportunity` document type Payload generates.
 */
export type OpportunityListing = {
  id: string
  type: string
  title: string
  /** The deadline written out for display, derived from `deadlineDate`. */
  deadlineLabel: string
  /** ISO timestamp the listing sorts on. */
  deadlineDate: string
  description: string
  applyUrl?: string
  value?: string
  imageUrl?: string
}

const NZ_TIME_ZONE = 'Pacific/Auckland'

function ordinal(day: number): string {
  // 11th–13th break the usual 1st/2nd/3rd pattern.
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

/**
 * "20th of May, 11:59pm NZST" — always in New Zealand time, and with the
 * right abbreviation either side of daylight saving, whatever the server's
 * own time zone is.
 */
export function formatDeadline(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: NZ_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(date)

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  // en-NZ renders the day period as "pm" or "p.m." depending on the runtime's
  // ICU data; the site's format is a bare "pm".
  const period = part('dayPeriod').toLowerCase().replace(/[\s.]/g, '')

  return `${ordinal(Number(part('day')))} of ${part('month')}, ${part('hour')}:${part(
    'minute',
  )}${period} ${part('timeZoneName')}`
}

function mediaUrl(image: string | number | Media | null | undefined): string | undefined {
  if (typeof image === 'object' && image !== null) return image.url ?? undefined
  return undefined
}

/**
 * The opportunities still open for applications, soonest deadline first.
 * Ones whose closing date has passed are left out rather than listed under an
 * "Apply by" line that has already expired.
 */
export async function getOpportunities(): Promise<OpportunityListing[]> {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'opportunities',
      pagination: false,
      sort: 'closingDate',
    })

    const now = Date.now()

    return docs.flatMap((doc) => {
      const closes = new Date(doc.closingDate)
      if (Number.isNaN(closes.getTime()) || closes.getTime() < now) return []

      return [
        {
          id: String(doc.id),
          type: doc.type,
          title: doc.title,
          deadlineLabel: formatDeadline(doc.closingDate),
          deadlineDate: new Date(doc.closingDate).toISOString(),
          description: doc.description,
          applyUrl: safeHref(doc.applyUrl),
          value: doc.value ?? undefined,
          imageUrl: mediaUrl(doc.image),
        },
      ]
    })
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return []
  }
}
