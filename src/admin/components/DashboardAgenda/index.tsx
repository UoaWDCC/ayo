import type { WidgetServerProps } from 'payload'
import Link from 'next/link'

import './index.scss'

type Concert = {
  id: string
  title: string
  performances?: { dateTime?: string; venue?: string }[]
  repertoire?: unknown[]
  photo_links?: unknown[]
  video_links?: unknown[]
}

const RECENT_COLLECTIONS = [
  { slug: 'concerts', label: 'Concerts' },
  { slug: 'pages', label: 'Pages' },
  { slug: 'posts', label: 'Posts' },
] as const

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
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-NZ', {
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
    limit: 100,
    overrideAccess: true,
  })
  const concerts = concertsRes.docs as unknown as Concert[]

  const upcoming = concerts
    .filter((c) => isUpcoming(c, now))
    .sort(
      (a, b) =>
        new Date(nearestPerformance(a, now)?.dateTime || 0).getTime() -
        new Date(nearestPerformance(b, now)?.dateTime || 0).getTime(),
    )

  const followUp = concerts.filter((c) => awaitingFollowUp(c, now))

  const recentLists = await Promise.all(
    RECENT_COLLECTIONS.map(({ slug }) =>
      payload.find({
        collection: slug,
        depth: 0,
        limit: 3,
        sort: '-updatedAt',
        overrideAccess: true,
      }),
    ),
  )
  const recent = recentLists
    .flatMap((res, i) =>
      res.docs.map((d) => ({
        collection: RECENT_COLLECTIONS[i].label,
        title: (d as { title?: string }).title || 'Untitled',
        updatedAt: (d as { updatedAt: string }).updatedAt,
      })),
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  const emailHandle = (user?.email || '').split('@')[0] || ''
  const greetingName = emailHandle
    ? emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1)
    : 'there'

  const next = upcoming[0]
  const nextPerf = next ? nearestPerformance(next, now) : null

  return (
    <div className="ayo-agenda">
      <p className="ayo-agenda__eyebrow">
        {now.toLocaleDateString('en-NZ', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <h2 className="ayo-agenda__greeting">Kia ora, {greetingName}.</h2>
      <p className="ayo-agenda__lead">
        {upcoming.length === 0
          ? 'No concert series are on sale.'
          : `${upcoming.length} concert ${upcoming.length === 1 ? 'series is' : 'series are'} on sale.`}
        {next && nextPerf
          ? ` The next is ${next.title}${nextPerf.venue ? `, at ${nextPerf.venue}` : ''} on ${fmtDate(nextPerf.dateTime)}.`
          : ''}
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
          <p className="ayo-agenda__empty">Nothing on sale right now.</p>
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
        {recent.map((r, i) => (
          <div key={i} className="ayo-agenda__row ayo-agenda__row--static">
            <span className="ayo-agenda__row-collection">{r.collection}</span>
            <span className="ayo-agenda__row-title">{r.title}</span>
            <span className="ayo-agenda__row-meta">{fmtDate(r.updatedAt)}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
