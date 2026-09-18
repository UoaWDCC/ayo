'use client'

import { useFormFields } from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'

import { BlockPreview } from './BlockPreview'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import './index.scss'

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero',
  'rich-text': 'RichText',
  video: 'Video',
  quote: 'Quote',
  image: 'Image',
  table: 'Table',
  faq: 'FAQ',
}

const PagesPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  // Defers the expensive derived recompute below off the hot keystroke path, so a burst of
  // fast input dispatches its state updates without each one forcing a full re-render here.
  const fields = useDeferredValue(rawFields)
  const [mode, setMode] = useState<'block' | 'full'>('block')
  const [activeIndex, setActiveIndex] = useState(0)

  const rows = fields.layout?.rows || []
  // Rows default to `collapsed: undefined` (rendered expanded) until a row is explicitly
  // toggled, at which point Payload starts writing an explicit boolean. Treat anything
  // other than `true` as expanded so freshly-added and never-toggled rows count correctly.
  const isExpanded = (row: { collapsed?: boolean }) => row.collapsed !== true
  const prevExpandedRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const prevExpanded = prevExpandedRef.current
    const expandedIndices = rows.reduce<number[]>((acc, row, i) => {
      if (isExpanded(row)) acc.push(i)
      return acc
    }, [])
    const newlyExpanded = rows.findIndex((row) => isExpanded(row) && !prevExpanded[row.id])

    setActiveIndex((current) => {
      if (newlyExpanded !== -1) return newlyExpanded
      const currentRow = rows[current]
      const currentStillExpanded = currentRow ? isExpanded(currentRow) : false
      if (!currentStillExpanded && expandedIndices.length > 0) return expandedIndices[0]
      return current
    })

    prevExpandedRef.current = Object.fromEntries(rows.map((row) => [row.id, isExpanded(row)]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((row) => `${row.id}:${row.collapsed}`).join(',')])

  const values = useMemo(() => reduceFieldsToValues(fields, true), [fields]) as {
    layout?: { blockType?: string; id?: string }[]
    title?: string
  }
  const layout = values.layout || []
  const activeBlock = layout[activeIndex] || layout[0]

  return (
    <div className="ayo-pages-preview">
      <div className="ayo-pages-preview__head">
        <span className="ayo-pages-preview__label">Preview</span>
        <div className="ayo-pages-preview__toggle">
          <button type="button" aria-pressed={mode === 'block'} onClick={() => setMode('block')}>
            Block
          </button>
          <button type="button" aria-pressed={mode === 'full'} onClick={() => setMode('full')}>
            Full page
          </button>
        </div>
      </div>

      {mode === 'block' ? (
        layout.length === 0 ? (
          <p className="ayo-pages-preview__empty">No blocks yet.</p>
        ) : activeBlock ? (
          <>
            <span className="ayo-pages-preview__block-label">
              {BLOCK_LABELS[activeBlock.blockType || ''] || activeBlock.blockType}
            </span>
            <div className="ayo-pages-preview__frame">
              <BlockPreview block={activeBlock} pageTitle={values.title || ''} />
            </div>
          </>
        ) : null
      ) : layout.length === 0 ? (
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
