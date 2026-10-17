'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import { categoryLabel, formatPublishedDate, richTextToPlainText } from '@/lib/postPresentation'
import { SavedPageLink } from '../shared/SavedPageLink'
import React, { useDeferredValue, useMemo, useState } from 'react'

import { PreviewPanel } from '../shared/PreviewPanel'
import { useMediaUrl } from '../shared/useMediaUrl'
import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }
type UploadValue = string | MediaDoc | null | undefined
// Live form-state richText values aren't typed further than `unknown` at this layer.
type RichTextData = Parameters<typeof RichText>[0]['data']

type PostPreviewData = {
  title?: string
  description?: unknown
  photos?: { photo?: UploadValue }[]
  category?: string
  author?: string
  publishedDate?: string
  slug?: string
}

// Compact guides use the same date, category and excerpt formatting as the public site.
// The saved-page link opens the complete public layout, gallery and related stories.
const PostsPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const [mode, setMode] = useState<'card' | 'article'>('card')

  const values = useMemo(() => reduceFieldsToValues(fields, true) as PostPreviewData, [fields])
  const photos = values.photos || []
  const media = useMediaUrl(photos[0]?.photo)

  const category = categoryLabel(values.category)

  return (
    <PreviewPanel
      resetKey={mode}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Content preview</span>
          <div className="ayo-preview__toggle">
            <button type="button" aria-pressed={mode === 'card'} onClick={() => setMode('card')}>
              Card
            </button>
            <button
              type="button"
              aria-pressed={mode === 'article'}
              onClick={() => setMode('article')}
            >
              Article
            </button>
          </div>
        </div>
      }
      savedPage={
        <SavedPageLink href={values.slug ? `/news/${encodeURIComponent(values.slug)}` : null} />
      }
    >
      {mode === 'card' ? (
        <>
          <div className="ayo-post-card">
            {media?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ayo-post-card__image" src={media.url} alt={media.alt || ''} />
            ) : (
              <div className="ayo-post-card__image ayo-post-card__image--empty" />
            )}
            <h3 className="ayo-post-card__title">{values.title || 'Untitled post'}</h3>
            {values.publishedDate ? (
              <p className="ayo-post-card__date">{formatPublishedDate(values.publishedDate)}</p>
            ) : null}
            <p className="ayo-post-card__desc">{richTextToPlainText(values.description)}</p>
            <p className="ayo-post-card__readmore">Read More</p>
            {category || values.author ? (
              <p className="ayo-post-card__meta">
                {[category, values.author].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>

          <dl className="ayo-facts">
            <div className="ayo-facts__row">
              <dt>Website URL</dt>
              <dd>
                {values.slug ? `/news/${encodeURIComponent(values.slug)}` : 'Not created yet'}
              </dd>
            </div>
            <div className="ayo-facts__row">
              <dt>Photos</dt>
              <dd>{photos.length}</dd>
            </div>
            <div className="ayo-facts__row">
              <dt>Published date</dt>
              <dd>
                {values.publishedDate ? formatPublishedDate(values.publishedDate) : 'Not set'}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <div className="ayo-post-article">
          <div className="ayo-post-article__hero">
            {media?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.url} alt={media.alt || ''} />
            ) : (
              <div className="ayo-post-article__hero-empty" />
            )}
            <div className="ayo-post-article__scrim" />
            <div className="ayo-post-article__hero-text">
              <h1>{values.title || 'Untitled post'}</h1>
              <p>
                {[
                  values.publishedDate ? formatPublishedDate(values.publishedDate) : null,
                  values.author ? `By ${values.author}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          </div>
          <div className="ayo-post-article__body">
            <RichText data={values.description as RichTextData} />
          </div>
        </div>
      )}
    </PreviewPanel>
  )
}

export const PostsPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PostsPreviewInner />
  </PreviewErrorBoundary>
)

export default PostsPreview
