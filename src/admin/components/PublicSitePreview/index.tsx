'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import { richTextToPlainText } from '../shared/richTextToPlainText'
import React, { useDeferredValue, useMemo, useState } from 'react'
import { formatNZDateTime } from '@/lib/concertDates'
import { concertLink, concertResourceLinks } from '@/lib/concertLinks'
import { SavedPageLink } from '../shared/SavedPageLink'

import { PreviewPanel } from '../shared/PreviewPanel'
import { useMediaUrl } from '../shared/useMediaUrl'
import './index.scss'

type Repertoire = { composer?: string; soloist?: string; workTitle?: string }
type Performance = { dateTime?: string; venue?: string; bookingUrl?: string | null }

type ConcertPreviewData = {
  title?: string
  description?: unknown
  photo?: string | { alt?: string; filename?: string; url?: string } | null
  repertoire?: Repertoire[]
  performances?: Performance[]
  pdf?: string | null
  photo_links?: { link?: string | null }[] | null
  video_links?: { link?: string | null }[] | null
}

function fmtDate(iso?: string) {
  return formatNZDateTime(iso, { weekday: 'short', day: 'numeric', month: 'short' })
}

function fmtTime(iso?: string) {
  return formatNZDateTime(iso, { hour: 'numeric', minute: '2-digit' }).toLowerCase()
}

// Reproduces the public site's EventsCard (listing) and EventCard (grid card) using live form state.
const PublicSitePreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  // Defers the expensive derived recompute below off the hot keystroke path, so a burst of
  // fast input dispatches its state updates without each one forcing a full re-render here.
  const fields = useDeferredValue(rawFields)
  const [mode, setMode] = useState<'listing' | 'card'>('listing')

  const values = useMemo(() => reduceFieldsToValues(fields, true) as ConcertPreviewData, [fields])
  const media = useMediaUrl(values.photo)

  const repertoire = values.repertoire || []
  const performances = useMemo(
    () =>
      [...(values.performances || [])].sort((a, b) => {
        const at = a.dateTime ? new Date(a.dateTime).getTime() : 0
        const bt = b.dateTime ? new Date(b.dateTime).getTime() : 0
        return at - bt
      }),
    [values.performances],
  )
  const first = performances[0]
  const place = performances.some((p) => p.venue) ? 'Auckland, New Zealand' : ''
  const resources = concertResourceLinks(values)
  const nextBooking = performances.find(
    (p) => p.dateTime && new Date(p.dateTime) >= new Date() && concertLink(p.bookingUrl),
  )
  const bookingUrl = concertLink(nextBooking?.bookingUrl)

  return (
    <PreviewPanel
      resetKey={mode}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Content preview</span>
          <div className="ayo-preview__toggle">
            <button
              type="button"
              aria-pressed={mode === 'listing'}
              onClick={() => setMode('listing')}
            >
              Listing
            </button>
            <button type="button" aria-pressed={mode === 'card'} onClick={() => setMode('card')}>
              Card
            </button>
          </div>
        </div>
      }
      savedPage={<SavedPageLink href="/concerts-events" />}
    >
      <div className="ayo-preview__frame">
        {media?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ayo-preview__image" src={media.url} alt={media.alt || ''} />
        ) : (
          <div className="ayo-preview__image ayo-preview__image--empty" />
        )}

        {mode === 'listing' ? (
          <>
            <p className="ayo-preview__miniheader">
              <span>{values.title || 'Untitled concert'}</span>
              <br />
              {place}
            </p>
            <ul className="ayo-preview__dates">
              {performances.map((p, i) => (
                <li key={i}>
                  {fmtDate(p.dateTime)}, {fmtTime(p.dateTime)}
                  {p.venue ? ` – ${p.venue}` : ''}
                </li>
              ))}
            </ul>
            <ul className="ayo-preview__programme">
              <li className="ayo-preview__programme-label">Programme</li>
              {repertoire.map((r, i) => (
                <li key={i}>
                  {r.composer || 'Composer'} – {r.workTitle || 'Work title'}
                  {r.soloist ? ` (soloist: ${r.soloist})` : ''}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h3 className="ayo-preview__card-title">{values.title || 'Untitled concert'}</h3>
            {first ? (
              <p className="ayo-preview__card-meta">
                {fmtDate(first.dateTime)}
                {first.venue ? ` · ${first.venue}` : ''}
              </p>
            ) : null}
            <p className="ayo-preview__card-desc">{richTextToPlainText(values.description)}</p>
          </>
        )}
        {(resources.length > 0 || bookingUrl) && (
          <div className="ayo-preview__card-actions">
            {resources.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
            {bookingUrl && (
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                Book next available performance
              </a>
            )}
          </div>
        )}
      </div>
    </PreviewPanel>
  )
}

export const PublicSitePreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PublicSitePreviewInner />
  </PreviewErrorBoundary>
)

export default PublicSitePreview
