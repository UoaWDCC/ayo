'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react'

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
  const { config } = useConfig()
  const [media, setMedia] = useState<MediaDoc | null>(null)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as PartnerPreviewData, [fields])
  const logoValue = values.logo
  const logoId = typeof logoValue === 'string' ? logoValue : null

  useEffect(() => {
    if (typeof logoValue === 'object' && logoValue) {
      setMedia(logoValue)
      return
    }
    if (!logoId) {
      setMedia(null)
      return
    }
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${logoId}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setMedia(doc))
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoId])

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
        {values.isActive === false ? (
          <span className="ayo-preview__inactive">Hidden (inactive)</span>
        ) : null}
      </div>

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
    </div>
  )
}

export const PartnersPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PartnersPreviewInner />
  </PreviewErrorBoundary>
)

export default PartnersPreview
