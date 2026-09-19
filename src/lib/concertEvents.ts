import { getPayload } from 'payload'
import config from '@payload-config'
import type { Concert, Media } from '@/payload-types'
import { richTextToPlainText } from '@/admin/components/shared/richTextToPlainText'

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
  performances: { time: string; date: string; venue: string }[]
  links: { label: string; href: string }[]
  footerNote?: string
  ctaLabel?: string
  ctaHref?: string
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function fmtDateLong(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' })
}

function fmtDateShort(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'long' })
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

  const links: AgendaEvent['links'] = [
    ...(concert.photo_links || [])
      .filter((l): l is { link: string; id?: string | null } => Boolean(l.link))
      .map(() => ({ label: 'Photos', href: '#' })),
    ...(concert.video_links || [])
      .filter((l): l is { link: string; id?: string | null } => Boolean(l.link))
      .map(() => ({ label: 'Recordings', href: '#' })),
  ].slice(0, 2)

  return {
    id: concert.id,
    type: 'Concert',
    deadlineDate: nearest?.dateTime || concert.createdAt,
    year: nearest
      ? new Date(nearest.dateTime).getFullYear()
      : new Date(concert.createdAt).getFullYear(),
    month: nearest ? new Date(nearest.dateTime).toLocaleDateString('en-NZ', { month: 'long' }) : '',
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
    })),
    links,
    footerNote: isUpcoming
      ? 'Tickets available.'
      : links.length > 0
        ? 'Photos available.'
        : undefined,
    ctaLabel: isUpcoming ? 'Book Now' : 'See Now',
    ctaHref: (isUpcoming ? nearest?.bookingUrl : undefined) || '#',
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
