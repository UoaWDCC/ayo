'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useMemo } from 'react'

import { PreviewPanel } from '../shared/PreviewPanel'
import { SavedPageLink } from '../shared/SavedPageLink'
import { useMediaUrl } from '../shared/useMediaUrl'
import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }

type PartnerPreviewData = {
  name?: string
  logo?: string | MediaDoc | null
  isActive?: boolean
}

// Reproduces the public site's SponsorList logo tile (src/app/(frontend)/components/SponsorList.tsx)
// using live, unsaved form state.
const PartnersPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as PartnerPreviewData, [fields])
  const media = useMediaUrl(values.logo)

  return (
    <PreviewPanel
      savedPage={<SavedPageLink href="/support-us" />}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Preview</span>
          {values.isActive === false ? (
            <span className="ayo-preview__inactive">Hidden (inactive)</span>
          ) : null}
        </div>
      }
    >
      <div className="ayo-partner-tile">
        {media?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="ayo-partner-tile__logo"
            src={media.url}
            alt={values.name || media.alt || ''}
          />
        ) : (
          <div className="ayo-partner-tile__logo ayo-partner-tile__logo--empty" />
        )}
      </div>
    </PreviewPanel>
  )
}

export const PartnersPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PartnersPreviewInner />
  </PreviewErrorBoundary>
)

export default PartnersPreview
