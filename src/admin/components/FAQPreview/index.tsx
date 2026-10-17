'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import type { Faq } from '@/payload-types'
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import { PreviewPanel } from '../shared/PreviewPanel'
import { SavedPageLink } from '../shared/SavedPageLink'
import './index.scss'

type FAQDoc = Pick<Faq, 'id' | 'question' | 'answer' | 'sortOrder'>
const CATEGORY_LABELS: Record<string, string> = {
  'about-us': 'About Us',
  'concerts-events': 'Concerts & Events',
  'join-ayo': 'Join AYO',
  news: 'News',
  'support-us': 'Support Us',
}

// Preview only: ordering is saved explicitly from the collection's Reorder controls.
function FAQPreviewInner() {
  const rawFields = useFormFields(([fields]) => fields)
  const fields = useDeferredValue(rawFields)
  const { config } = useConfig()
  const { id } = useDocumentInfo()
  const [items, setItems] = useState<FAQDoc[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const values = useMemo(() => reduceFieldsToValues(fields, true) as Partial<Faq>, [fields])
  const category = values.category
  const fetchItems = useCallback(
    async (cat: string, signal: AbortSignal) => {
      const query = `where[category][equals]=${encodeURIComponent(cat)}&sort=sortOrder,id&limit=0&depth=0`
      const response = await fetch(`${config.serverURL}${config.routes.api}/faqs?${query}`, {
        credentials: 'include',
        signal,
      })
      if (!response.ok) throw new Error('Unable to load FAQs')
      const body: { docs: FAQDoc[] } = await response.json()
      if (!signal.aborted) setItems(body.docs)
    },
    [config.serverURL, config.routes.api],
  )
  useEffect(() => {
    setItems(null)
    setLoadError(false)
    if (!category) return
    const controller = new AbortController()
    fetchItems(category, controller.signal).catch(() => {
      if (!controller.signal.aborted) setLoadError(true)
    })
    return () => controller.abort()
  }, [category, attempt, fetchItems])
  const displayItems = useMemo(() => {
    if (!items || items.some((item) => item.id === id) || !category) return items
    return [
      { id: '__unsaved__', question: values.question ?? '', answer: values.answer ?? '' },
      ...items,
    ]
  }, [items, id, category, values.question, values.answer])

  return (
    <PreviewPanel
      savedPage={<SavedPageLink href={category ? `/${category}` : null} />}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Content preview</span>
          <span className="ayo-preview__page">
            {category ? CATEGORY_LABELS[category] : 'No page selected'}
          </span>
        </div>
      }
    >
      {!category ? (
        <p className="ayo-faq-order__empty">Choose a page to preview this question and answer.</p>
      ) : loadError ? (
        <div role="status">
          <p>Could not load the FAQ preview.</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            Retry
          </button>
        </div>
      ) : !displayItems ? (
        <p className="ayo-faq-order__empty">Loading…</p>
      ) : (
        <>
          <div className="ayo-faq-order">
            {displayItems.map((item) => {
              const current = item.id === id || item.id === '__unsaved__'
              const open = current || openId === item.id
              return (
                <div
                  key={item.id}
                  className={`ayo-faq-order__item${current ? ' ayo-faq-order__item--current' : ''}`}
                >
                  <div className="ayo-faq-order__row">
                    <button
                      type="button"
                      aria-expanded={open}
                      className="ayo-faq-order__question"
                      onClick={() => !current && setOpenId(openId === item.id ? null : item.id)}
                    >
                      {current ? values.question || 'Untitled question' : item.question}
                    </button>
                    {current && <span className="ayo-faq-order__flag">Editing</span>}
                  </div>
                  {open && (
                    <p className="ayo-faq-order__answer">
                      {current ? values.answer || 'No answer yet.' : item.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="ayo-faq-order__hint">
            To change the order, select Reorder in the{' '}
            <a href={`${config.routes.admin}/collections/faqs`}>FAQs list</a>.
          </p>
        </>
      )}
    </PreviewPanel>
  )
}
export function FAQPreview() {
  return (
    <PreviewErrorBoundary>
      <FAQPreviewInner />
    </PreviewErrorBoundary>
  )
}
export default FAQPreview
