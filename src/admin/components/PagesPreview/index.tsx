'use client'

import { useFormFields } from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'
import React, { useDeferredValue, useMemo } from 'react'

import { BlockPreview } from './BlockPreview'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import './index.scss'

const PagesPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  // Defers the expensive derived recompute below off the hot keystroke path, so a burst of
  // fast input dispatches its state updates without each one forcing a full re-render here.
  const fields = useDeferredValue(rawFields)

  const values = useMemo(() => reduceFieldsToValues(fields, true), [fields]) as {
    layout?: { blockType?: string; id?: string }[]
    title?: string
  }
  const layout = values.layout || []

  return (
    <div className="ayo-pages-preview">
      <div className="ayo-pages-preview__head">
        <span className="ayo-pages-preview__label">Preview</span>
      </div>

      {layout.length === 0 ? (
        <p className="ayo-pages-preview__empty">No blocks yet.</p>
      ) : (
        <div className="ayo-pages-preview__frame ayo-pages-preview__frame--full">
          {layout.map((block, i) => (
            <div className="ayo-pages-preview__full-block" key={block.id || i}>
              <BlockPreview block={block} pageTitle={values.title || ''} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const PagesPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PagesPreviewInner />
  </PreviewErrorBoundary>
)

export default PagesPreview
