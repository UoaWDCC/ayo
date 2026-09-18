'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useMemo, useState } from 'react'

import './index.scss'

type FAQPreviewData = {
  question?: string
  answer?: string
  category?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'about-us': 'About Us',
  'concerts-events': 'Concerts & Events',
  'join-ayo': 'Join AYO',
  'support-us': 'Support Us',
}

// Reproduces the public site's FAQItem accordion (src/app/(frontend)/components/FAQItem.tsx)
// using live, unsaved form state.
const FAQPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const [open, setOpen] = useState(true)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as FAQPreviewData, [fields])

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
        <span className="ayo-preview__page">
          {values.category ? CATEGORY_LABELS[values.category] || values.category : 'No page set'}
        </span>
      </div>

      <div className="ayo-preview__frame ayo-faq">
        <button
          type="button"
          className="ayo-faq__row"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="ayo-faq__question">{values.question || 'Untitled question'}</span>
          <span
            className={`ayo-faq__chevron${open ? ' ayo-faq__chevron--open' : ''}`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>
        {open ? <p className="ayo-faq__answer">{values.answer || 'No answer yet.'}</p> : null}
      </div>
    </div>
  )
}

export const FAQPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <FAQPreviewInner />
  </PreviewErrorBoundary>
)

export default FAQPreview
