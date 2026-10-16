import type { WidgetServerProps } from 'payload'
import Link from 'next/link'
import type { Concert } from '@/payload-types'
import { getRecentContent } from '@/lib/adminRecentContent'
import { formatNZDateTime } from '@/lib/concertDates'

import './index.scss'

function sortedPerformances(c: Concert) {
  return [...(c.performances || [])].sort(
    (a, b) => new Date(a.dateTime || 0).getTime() - new Date(b.dateTime || 0).getTime(),
  )
}

function nearestPerformance(c: Concert, now: Date) {
  const perfs = sortedPerformances(c)
  return perfs.find((p) => p.dateTime && new Date(p.dateTime) >= now) || perfs[perfs.length - 1]
}

function isUpcoming(c: Concert, now: Date) {
  return (c.performances || []).some((p) => p.dateTime && new Date(p.dateTime) >= now)
}

// Derived at read time, never stored: a concert whose last performance has passed with no links yet.
function awaitingFollowUp(c: Concert, now: Date) {
  return (
    !isUpcoming(c, now) && (c.photo_links || []).length === 0 && (c.video_links || []).length === 0
  )
}

function fmtDate(iso?: string) {
  return formatNZDateTime(iso, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function ConcertRow({
  concert,
  meta,
  action,
}: {
  concert: Concert
  meta: string
  action?: string
}) {
  const href = `/admin/collections/concerts/${concert.id}`
  return (
    <div className="ayo-agenda__row">
      <Link href={href} className="ayo-agenda__row-title">
        {concert.title}
      </Link>
      <span className="ayo-agenda__row-end">
        <span className="ayo-agenda__row-meta">{meta}</span>
        {action ? (
          <Link href={href} className="ayo-agenda__row-action">
            {action}
          </Link>
        ) : null}
      </span>
    </div>
  )
}

// Registered as a full-width dashboard widget (admin.dashboard.widgets), additive to Payload's native dashboard.
export default async function DashboardAgenda({ req }: WidgetServerProps) {
  const { payload, user } = req
  const now = new Date()

  const concertsRes = await payload.find({
    collection: 'concerts',
    depth: 0,
    pagination: false,
    req,
    overrideAccess: false,
  })
  const concerts = concertsRes.docs

  const upcoming = concerts
    .filter((c) => isUpcoming(c, now))
    .sort(
      (a, b) =>
        new Date(nearestPerformance(a, now)?.dateTime || 0).getTime() -
        new Date(nearestPerformance(b, now)?.dateTime || 0).getTime(),
    )

  const followUp = concerts.filter((c) => awaitingFollowUp(c, now))

  const recent = await getRecentContent(req)

  const emailHandle = (user?.email || '').split('@')[0] || ''
  const greetingName = emailHandle
    ? emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1)
    : 'there'

  const next = upcoming[0]
  const nextPerf = next ? nearestPerformance(next, now) : null

  return (
    <div className="ayo-agenda">
      <h2 className="ayo-agenda__greeting">Kia ora, {greetingName}.</h2>
      <p className="ayo-agenda__lead">
        {upcoming.length === 0
          ? 'No upcoming concert series.'
          : `${upcoming.length} upcoming concert series.`}
        {next && nextPerf ? (
          <>
            {' The next is '}
            <strong>{next.title}</strong>
            {nextPerf.venue ? `, at ${nextPerf.venue}` : ''}
            {` on ${fmtDate(nextPerf.dateTime)}.`}
          </>
        ) : null}
      </p>

      <div className="ayo-agenda__actions">
        <Link className="ayo-agenda__cta" href="/admin/collections/concerts/create">
          New Concert
        </Link>
        <Link className="ayo-agenda__link" href="/admin/collections/posts/create">
          New Post
        </Link>
        <Link className="ayo-agenda__link" href="/admin/collections/pages">
          Edit Pages
        </Link>
      </div>

      <section className="ayo-agenda__section">
        <h3>Upcoming concerts</h3>
        {upcoming.length === 0 ? (
          <p className="ayo-agenda__empty">No upcoming concerts right now.</p>
        ) : (
          upcoming.map((c) => {
            const p = nearestPerformance(c, now)
            return (
              <ConcertRow
                key={c.id}
                concert={c}
                meta={`${fmtDate(p?.dateTime)} · ${p?.venue || 'venue not set'}`}
              />
            )
          })
        )}
      </section>

      {followUp.length ? (
        <section className="ayo-agenda__section">
          <h3>Add photos or video</h3>
          {followUp.map((c) => {
            const p = nearestPerformance(c, now)
            const works = (c.repertoire || []).length
            return (
              <ConcertRow
                key={c.id}
                concert={c}
                meta={`${(c.performances || []).length} performances · ${works} works · performed ${fmtDate(p?.dateTime)}`}
                action="Add links"
              />
            )
          })}
        </section>
      ) : null}

      <section className="ayo-agenda__section">
        <h3>Recently updated</h3>
        {recent.length === 0 && <p className="ayo-agenda__empty">No changes yet.</p>}
        {recent.map((r) => (
          <Link key={r.href} href={r.href} className="ayo-agenda__row ayo-agenda__row--link">
            <span className="ayo-agenda__row-collection">{r.collection}</span>
            <span className="ayo-agenda__row-title">{r.title}</span>
            <span className="ayo-agenda__row-meta">{fmtDate(r.updatedAt)}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
