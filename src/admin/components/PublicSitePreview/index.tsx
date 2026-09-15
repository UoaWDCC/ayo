'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

import './index.scss'

type Repertoire = { composer?: string; soloist?: string; workTitle?: string }
type Performance = { dateTime?: string; venue?: string }

type ConcertPreviewData = {
  title?: string
  description?: unknown
  photo?: string | { alt?: string; filename?: string; url?: string } | null
  repertoire?: Repertoire[]
  performances?: Performance[]
}

type MediaDoc = { alt?: string; filename?: string; url?: string }

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}

function fmtTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
}

// Flattens a Lexical richText JSON value to plain text.
function richTextToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value : ''
  const nodes = (value as { root?: { children?: unknown[] } }).root?.children
  if (!Array.isArray(nodes)) return ''
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join('')
    return ''
  }
  return nodes.map(walk).join(' ').trim()
}

// Reproduces the public site's EventsCard (listing) and EventCard (grid card) using live form state.
export const PublicSitePreview: React.FC = () => {
  const fields = useFormFields(([fieldState]) => fieldState)
  const { config } = useConfig()
  const [mode, setMode] = useState<'listing' | 'card'>('listing')
  const [media, setMedia] = useState<MediaDoc | null>(null)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as ConcertPreviewData, [fields])
  const photoValue = values.photo
  const photoId = typeof photoValue === 'string' ? photoValue : null

  useEffect(() => {
    if (typeof photoValue === 'object' && photoValue) {
      setMedia(photoValue)
      return
    }
    if (!photoId) {
      setMedia(null)
      return
    }
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${photoId}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setMedia(doc))
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId])

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

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
        <div className="ayo-preview__toggle">
          <button type="button" aria-pressed={mode === 'listing'} onClick={() => setMode('listing')}>
            Listing
          </button>
          <button type="button" aria-pressed={mode === 'card'} onClick={() => setMode('card')}>
            Card
          </button>
        </div>
      </div>

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
            <div className="ayo-preview__card-actions">
              <span>Set list</span>
              <span>Book</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PublicSitePreview
