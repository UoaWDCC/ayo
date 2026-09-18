'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import { richTextToPlainText } from '../shared/richTextToPlainText'
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react'

import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }
type UploadValue = string | MediaDoc | null | undefined

type PostPreviewData = {
  title?: string
  description?: unknown
  photos?: { photo?: UploadValue }[]
  category?: string
  author?: string
  publishedDate?: string
  slug?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  alumni_story: 'Alumni Story',
  interview: 'Interview',
  scholarships: 'Scholarships',
  newsletters: 'Newsletters',
  education: 'Education',
  audience: 'Audience',
}

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Reproduces the A2 Posts-edit card preview (photo, title, date, clamped description, category
// · author) plus the A2 fact list (Slug / Photos / Published). The public /news page still runs
// on hardcoded mock data (see Phase 3 notes), so this matches the approved A2 CMS treatment
// using real Payload fields rather than claiming 1:1 frontend fidelity.
const PostsPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const { config } = useConfig()
  const [media, setMedia] = useState<MediaDoc | null>(null)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as PostPreviewData, [fields])
  const photos = values.photos || []
  const firstPhoto = photos[0]?.photo
  const photoId = typeof firstPhoto === 'string' ? firstPhoto : null

  useEffect(() => {
    if (typeof firstPhoto === 'object' && firstPhoto) {
      setMedia(firstPhoto)
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

  const categoryLabel = values.category ? CATEGORY_LABELS[values.category] || values.category : ''

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
      </div>

      <div className="ayo-post-card">
        {media?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ayo-post-card__image" src={media.url} alt={media.alt || ''} />
        ) : (
          <div className="ayo-post-card__image ayo-post-card__image--empty" />
        )}
        <h3 className="ayo-post-card__title">{values.title || 'Untitled post'}</h3>
        {values.publishedDate ? (
          <p className="ayo-post-card__date">{fmtDate(values.publishedDate)}</p>
        ) : null}
        <p className="ayo-post-card__desc">{richTextToPlainText(values.description)}</p>
        <p className="ayo-post-card__readmore">Read More</p>
        {categoryLabel || values.author ? (
          <p className="ayo-post-card__meta">
            {[categoryLabel, values.author].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </div>

      <dl className="ayo-facts">
        <div className="ayo-facts__row">
          <dt>Slug</dt>
          <dd>{values.slug ? `/${values.slug}` : '—'}</dd>
        </div>
        <div className="ayo-facts__row">
          <dt>Photos</dt>
          <dd>{photos.length}</dd>
        </div>
        <div className="ayo-facts__row">
          <dt>Published</dt>
          <dd>{values.publishedDate ? fmtDate(values.publishedDate) : 'Not set'}</dd>
        </div>
      </dl>
    </div>
  )
}

export const PostsPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PostsPreviewInner />
  </PreviewErrorBoundary>
)

export default PostsPreview
