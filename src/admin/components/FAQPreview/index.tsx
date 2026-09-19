'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useDocumentInfo, useForm, useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'

import './index.scss'

type FAQPreviewData = {
  question?: string
  answer?: string
  category?: string
}

type FAQDoc = { id: string; question?: string; answer?: string; sortOrder?: number }

const CATEGORY_LABELS: Record<string, string> = {
  'about-us': 'About Us',
  'concerts-events': 'Concerts & Events',
  'join-ayo': 'Join AYO',
  'support-us': 'Support Us',
}

// Reproduces the public site's FAQItem accordion (src/app/(frontend)/components/FAQItem.tsx)
// using live, unsaved form state, plus every other FAQ sharing this one's page — derived live
// from real FAQ records, never hard-coded. Ordering is set by dragging rows here rather than
// typing a sortOrder number: sortOrder is a hidden field (see FAQ.ts), written directly to every
// affected FAQ (via the API for siblings, via the form for this document) as soon as a row drops.
const FAQPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const { config } = useConfig()
  const { id } = useDocumentInfo()
  const { dispatchFields } = useForm()
  const [items, setItems] = useState<FAQDoc[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [orderError, setOrderError] = useState(false)
  const draggedId = useRef<string | null>(null)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as FAQPreviewData, [fields])
  const category = values.category

  const fetchItems = (cat: string, signal?: AbortSignal) => {
    const query = `where[category][equals]=${encodeURIComponent(cat)}&sort=sortOrder&limit=200&depth=0`
    return fetch(`${config.serverURL}${config.routes.api}/faqs?${query}`, {
      credentials: 'include',
      signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setItems(body?.docs ?? []))
  }

  // This document doesn't show up in the fetched list above either before its first save (no id
  // yet) or right after its Page is changed but not yet saved (the database still has it under
  // the old category, so the new category's query won't return it). Show it as a fixed,
  // non-draggable row on top in both cases instead, so there's still something to preview.
  const displayItems = useMemo(() => {
    if (!items) return items
    if (items.some((item) => item.id === id)) return items
    if (!category) return items
    return [{ id: '__unsaved__', question: values.question, answer: values.answer }, ...items]
  }, [items, id, category, values.question, values.answer])

  useEffect(() => {
    if (!category) {
      setItems(null)
      return
    }
    const controller = new AbortController()
    fetchItems(category, controller.signal).catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const patchSortOrder = (docId: string, sortOrder: number) =>
    fetch(`${config.serverURL}${config.routes.api}/faqs/${docId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder }),
    }).then((res) => {
      if (!res.ok) throw new Error(`Failed to update sortOrder for ${docId}`)
    })

  const handleDragStart = (docId: string) => () => {
    draggedId.current = docId
  }

  const handleDragOver = (docId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    if (!items || !draggedId.current || draggedId.current === docId) return
    const fromIndex = items.findIndex((i) => i.id === draggedId.current)
    const toIndex = items.findIndex((i) => i.id === docId)
    if (fromIndex === -1 || toIndex === -1) return
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setItems(next)
  }

  const handleDragEnd = () => {
    draggedId.current = null
    if (!items || !category) return
    const changed = items.filter((item, index) => item.sortOrder !== index)
    if (changed.length === 0) return
    setSavingOrder(true)
    setOrderError(false)
    Promise.all(
      changed.map((item) => {
        const index = items.indexOf(item)
        if (item.id === id) {
          dispatchFields({ type: 'UPDATE', path: 'sortOrder', value: index })
        }
        return patchSortOrder(item.id, index)
      }),
    )
      .then(() =>
        setItems((prev) => prev?.map((item, index) => ({ ...item, sortOrder: index })) ?? prev),
      )
      .catch(() => {
        // One or more PATCHes failed — the on-screen order no longer matches the database, so
        // re-fetch the real state rather than leave a stale, silently-wrong order on screen.
        setOrderError(true)
        return fetchItems(category)
      })
      .finally(() => setSavingOrder(false))
  }

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
        <span className="ayo-preview__page">
          {category ? CATEGORY_LABELS[category] || category : 'No page set'}
        </span>
      </div>

      {!category ? (
        <p className="ayo-faq-order__empty">Set a page to preview and order this FAQ.</p>
      ) : displayItems === null ? (
        <p className="ayo-faq-order__empty">Loading…</p>
      ) : (
        <>
          <div className="ayo-faq-order">
            {displayItems.map((item) => {
              const isCurrent = item.id === id || item.id === '__unsaved__'
              const isDraggable = item.id !== '__unsaved__'
              const isOpen = isCurrent || openId === item.id
              const question = isCurrent ? values.question || 'Untitled question' : item.question
              const answer = isCurrent ? values.answer || 'No answer yet.' : item.answer
              return (
                <div
                  key={item.id}
                  className={`ayo-faq-order__item${isCurrent ? ' ayo-faq-order__item--current' : ''}`}
                  draggable={isDraggable}
                  onDragStart={isDraggable ? handleDragStart(item.id) : undefined}
                  onDragOver={isDraggable ? handleDragOver(item.id) : undefined}
                  onDragEnd={isDraggable ? handleDragEnd : undefined}
                >
                  <div className="ayo-faq-order__row">
                    {isDraggable ? (
                      <span className="ayo-faq-order__handle" aria-hidden="true">
                        ⠿
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="ayo-faq-order__question"
                      onClick={() => !isCurrent && setOpenId(openId === item.id ? null : item.id)}
                    >
                      {question || 'Untitled question'}
                    </button>
                    {isCurrent ? <span className="ayo-faq-order__flag">Editing</span> : null}
                  </div>
                  {isOpen ? <p className="ayo-faq-order__answer">{answer}</p> : null}
                </div>
              )
            })}
          </div>
          <p className={`ayo-faq-order__hint${orderError ? ' ayo-faq-order__hint--error' : ''}`}>
            {savingOrder
              ? 'Saving order…'
              : orderError
                ? "Couldn't save that order — showing the last saved order instead."
                : 'Drag a question to reorder it on the page.'}
          </p>
        </>
      )}
    </div>
  )
}

export const FAQPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <FAQPreviewInner />
  </PreviewErrorBoundary>
)

export default FAQPreview
