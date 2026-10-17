'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useMemo } from 'react'

import { PreviewPanel } from '../shared/PreviewPanel'
import { SavedPageLink } from '../shared/SavedPageLink'
import { concertLink } from '@/lib/concertLinks'
import './index.scss'

type LinkPreviewData = {
  name?: string
  url?: string
  category?: string
}

// Reproduces the public site's Resources/Links row treatment
// (src/app/(frontend)/components/DocumentList.tsx) using live, unsaved form state.
// Resources rows additionally show a date (real records show updatedAt); Links rows do not.
const LinksPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as LinkPreviewData, [fields])
  const isResources = values.category === 'resources'

  return (
    <PreviewPanel
      savedPage={<SavedPageLink href="/my-ayo" />}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Content preview</span>
          <span className="ayo-preview__section">
            {values.category ? (isResources ? 'Resources' : 'Links') : 'No section selected'}
          </span>
        </div>
      }
    >
      <div className="ayo-link-row">
        <span className="ayo-link-row__name">{values.name || 'Untitled link'}</span>
        {isResources ? <span className="ayo-link-row__date">Last updated date</span> : null}
      </div>
      {concertLink(values.url) ? (
        <p className="ayo-preview__url">
          <a href={concertLink(values.url)} target="_blank" rel="noopener noreferrer">
            Open link ↗
          </a>
        </p>
      ) : values.url ? (
        <p role="status">Enter a full web URL or a site path to test this link.</p>
      ) : null}
    </PreviewPanel>
  )
}

export const LinksPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <LinksPreviewInner />
  </PreviewErrorBoundary>
)

export default LinksPreview
