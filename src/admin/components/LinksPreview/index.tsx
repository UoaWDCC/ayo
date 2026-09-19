'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useMemo } from 'react'

import './index.scss'

type LinkPreviewData = {
  name?: string
  url?: string
  category?: string
}

// Reproduces the public site's Resources/Links row treatment
// (src/app/(frontend)/components/Resources.tsx and Links.tsx) using live, unsaved form state.
// Resources rows additionally show a date (real records show updatedAt); Links rows do not.
const LinksPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as LinkPreviewData, [fields])
  const isResources = values.category === 'resources'

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
        <span className="ayo-preview__section">
          {values.category ? (isResources ? 'Resources' : 'Links') : 'No section set'}
        </span>
      </div>

      <div className="ayo-link-row">
        <span className="ayo-link-row__name">{values.name || 'Untitled link'}</span>
        {isResources ? <span className="ayo-link-row__date">Updated date shown here</span> : null}
      </div>
      {values.url ? <p className="ayo-preview__url">{values.url}</p> : null}
    </div>
  )
}

export const LinksPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <LinksPreviewInner />
  </PreviewErrorBoundary>
)

export default LinksPreview
