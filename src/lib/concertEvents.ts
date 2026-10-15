import { getPayload } from 'payload'
import config from '@payload-config'
import type { Concert, Media } from '@/payload-types'
import { richTextToPlainText } from '@/admin/components/shared/richTextToPlainText'
import { formatNZDateTime } from './concertDates'
import { concertLink, concertResourceLinks } from './concertLinks'

export type AgendaEvent = {
  id: string
  type: string
  deadlineDate: string
  year: number
  month: string
  location: string
  title: string
  subtitle: string
  image: string
  description: string
  performances: { time: string; date: string; venue: string; bookingUrl?: string }[]
  links: { label: string; href: string }[]
  footerNote?: string
  ctaLabel?: string
  ctaHref?: string
}

function fmtTime(iso: string) {
  return formatNZDateTime(iso, { hour: '2-digit', minute: '2-digit', hour12: false })
}

function fmtDateLong(iso: string) {
  return formatNZDateTime(iso, { weekday: 'long', day: 'numeric', month: 'long' })
}

function fmtDateShort(iso: string) {
  return formatNZDateTime(iso, { weekday: 'short', day: 'numeric', month: 'long' })
}

function concertToEvent(concert: Concert, now: Date): AgendaEvent {
  const sorted = [...concert.performances].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  )
  const upcoming = sorted.find((p) => new Date(p.dateTime) >= now)
  const nearest = upcoming || sorted[sorted.length - 1]
  const isUpcoming = Boolean(upcoming)

  const photo = concert.photo
  const image =
    typeof photo === 'object' && photo !== null
      ? (photo as Media).url || '/hero-placeholder.jpg'
      : '/hero-placeholder.jpg'

  const links = concertResourceLinks(concert)
  const booking = sorted.find((p) => new Date(p.dateTime) >= now && concertLink(p.bookingUrl))
  const photos = links.find((link) => link.label.startsWith('Photos'))
  const recording = links.find((link) => link.label.startsWith('Recordings'))
  const programme = links.find((link) => link.label === 'Programme')
  const resource = photos || recording || programme
  const ctaHref = isUpcoming ? concertLink(booking?.bookingUrl) : resource?.href
  let ctaLabel: string | undefined
  let footerNote: string | undefined
  if (ctaHref) {
    if (isUpcoming) {
      ctaLabel = 'Book Now'
      footerNote = 'Tickets available.'
    } else if (photos) {
      ctaLabel = 'View photos'
      footerNote = 'Photos available.'
    } else if (recording) {
      ctaLabel = 'Watch recording'
      footerNote = 'Recordings available.'
    } else {
      ctaLabel = 'View programme'
    }
  }

  return {
    id: concert.id,
    type: 'Concert',
    deadlineDate: nearest?.dateTime || concert.createdAt,
    year: Number(formatNZDateTime(nearest?.dateTime || concert.createdAt, { year: 'numeric' })),
    month: nearest ? formatNZDateTime(nearest.dateTime, { month: 'long' }) : '',
    location: 'Auckland, New Zealand',
    title: concert.title,
    subtitle: nearest
      ? `${fmtDateShort(nearest.dateTime)}${nearest.venue ? ` · ${nearest.venue}` : ''}`
      : '',
    image,
    description: richTextToPlainText(concert.description),
    performances: sorted.map((p) => ({
      time: fmtTime(p.dateTime),
      date: fmtDateLong(p.dateTime),
      venue: p.venue || '',
      bookingUrl: new Date(p.dateTime) >= now ? concertLink(p.bookingUrl) : undefined,
    })),
    links,
    footerNote,
    ctaLabel,
    ctaHref,
  }
}

export async function getConcertEvents(): Promise<{
  upcoming: AgendaEvent[]
  previous: AgendaEvent[]
}> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'concerts',
      depth: 1,
      limit: 100,
      sort: '-createdAt',
    })

    const now = new Date()
    const upcoming: AgendaEvent[] = []
    const previous: AgendaEvent[] = []

    for (const concert of docs) {
      const event = concertToEvent(concert, now)
      const hasUpcomingPerformance = concert.performances.some((p) => new Date(p.dateTime) >= now)
      if (hasUpcomingPerformance) {
        upcoming.push(event)
      } else {
        previous.push(event)
      }
    }

    return { upcoming, previous }
  } catch (error) {
    console.error('Error fetching concerts:', error)
    return { upcoming: [], previous: [] }
  }
}
