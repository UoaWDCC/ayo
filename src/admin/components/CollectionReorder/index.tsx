'use client'

import { useConfig, useTableColumns } from '@payloadcms/ui'
import type { BeforeListTableClientProps } from 'payload'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/admin/components/StatusCell'
import {
  isReorderCollection,
  moveItem,
  type OrderItem,
  type OrderSnapshot,
  type ReorderCollection,
} from '@/lib/ordering'
import './index.scss'

function Reorder({ collection }: { collection: ReorderCollection }) {
  const { config } = useConfig()
  const router = useRouter()
  const { resetColumnsState } = useTableColumns()
  const [open, setOpen] = useState(false)
  const [snapshot, setSnapshot] = useState<OrderSnapshot | null>(null)
  const [groupID, setGroupID] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [movedID, setMovedID] = useState<string | null>(null)
  const rows = useRef(new Map<string, HTMLLIElement>())
  const header = useRef<HTMLDivElement>(null)
  const previousPositions = useRef(new Map<string, number>())
  const dragged = useRef<string | null>(null)
  const controller = useRef<AbortController | null>(null)
  const endpoint = `${config.serverURL}${config.routes.api}/${collection}/reorder`
  const group = snapshot?.groups.find((item) => item.id === groupID)
  const dirty = !!group && items.some((item, index) => item.id !== group.items[index]?.id)

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    for (const [id, row] of rows.current) {
      const previous = previousPositions.current.get(id)
      if (previous !== undefined && !reducedMotion && row.animate) {
        const distance = previous - row.getBoundingClientRect().top
        if (distance)
          row.animate(
            [{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }],
            { duration: 220, easing: 'ease-out' },
          )
      }
    }
    previousPositions.current.clear()
    const movedRow = movedID ? rows.current.get(movedID) : undefined
    if (movedRow) {
      const bounds = movedRow.getBoundingClientRect()
      if (
        bounds.top < (header.current?.getBoundingClientRect().bottom ?? 0) ||
        bounds.bottom > window.innerHeight
      ) {
        movedRow.scrollIntoView?.({
          block: 'nearest',
          behavior: reducedMotion ? 'instant' : 'smooth',
        })
      }
    }
  }, [items, movedID])

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (!dirty) return
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', prevent)
    return () => window.removeEventListener('beforeunload', prevent)
  }, [dirty])

  const load = useCallback(async () => {
    controller.current?.abort()
    const pending = new AbortController()
    controller.current = pending
    setBusy(true)
    setError('')
    setNotice('')
    setMovedID(null)
    try {
      const response = await fetch(endpoint, { credentials: 'include', signal: pending.signal })
      if (!response.ok) throw new Error('Could not load the order. Try again.')
      const data: OrderSnapshot = await response.json()
      if (pending.signal.aborted) return
      setSnapshot(data)
      const selected = data.groups.find((item) => item.id === groupID) ?? data.groups[0]
      setGroupID(selected?.id ?? '')
      setItems(selected?.items ?? [])
    } catch (error) {
      if (!pending.signal.aborted)
        setError(error instanceof Error ? error.message : 'Could not load the order.')
    } finally {
      if (!pending.signal.aborted) setBusy(false)
    }
  }, [endpoint, groupID])

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return
    for (const [id, row] of rows.current)
      previousPositions.current.set(id, row.getBoundingClientRect().top)
    setMovedID(items[from].id)
    setItems((current) => moveItem(current, from, to))
    setNotice(`${items[from].label} moved from position ${from + 1} to ${to + 1}. Not saved yet.`)
  }

  async function resetColumns() {
    setBusy(true)
    setError('')
    try {
      await resetColumnsState()
    } catch {
      setError('Could not reset the columns. Try again.')
    } finally {
      setBusy(false)
    }
  }
  async function save() {
    if (!snapshot || !dirty) return
    setBusy(true)
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group: groupID,
          ids: items.map((item) => item.id),
          revision: snapshot.revision,
        }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(
          data.errors?.[0]?.message ??
            'Could not save the order. No changes were saved. Reload the order before trying again.',
        )
      const saved: OrderSnapshot = data
      setSnapshot(saved)
      setItems(saved.groups.find((item) => item.id === groupID)?.items ?? [])
      setNotice('Order saved.')
      setMovedID(null)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save the order.')
    } finally {
      setBusy(false)
      setSaving(false)
    }
  }

  return (
    <section
      className={`ayo-reorder${open ? ' ayo-reorder--open' : ''}`}
      aria-label="Collection reordering"
    >
      {!open ? (
        <div className="ayo-reorder__toolbar">
          <button
            type="button"
            className="ayo-reorder__button ayo-reorder__button--primary"
            disabled={busy}
            onClick={() => {
              setOpen(true)
              void load()
            }}
          >
            <span aria-hidden="true">↕</span> Reorder
          </button>
          <span className="ayo-reorder__toolbar-hint">Change the website display order</span>
          <button
            type="button"
            className="ayo-reorder__button ayo-reorder__reset"
            disabled={busy}
            onClick={() => void resetColumns()}
          >
            {busy ? 'Resetting…' : 'Reset columns'}
          </button>
          {error && (
            <p className="ayo-reorder__error" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="ayo-reorder__header" ref={header}>
            <h2>Display order</h2>
            <div className="ayo-reorder__actions">
              <button
                type="button"
                className="ayo-reorder__button ayo-reorder__button--primary"
                disabled={!dirty || busy}
                onClick={() => void save()}
              >
                {saving ? 'Saving…' : 'Save order'}
              </button>
              <button
                type="button"
                className="ayo-reorder__button"
                disabled={saving}
                onClick={() => {
                  controller.current?.abort()
                  setBusy(false)
                  setOpen(false)
                  setSnapshot(null)
                  setItems([])
                  setError('')
                  setNotice('')
                  setMovedID(null)
                }}
              >
                Cancel
              </button>
            </div>
            <p className="ayo-reorder__status" role="status" aria-live="polite">
              {notice ||
                (dirty
                  ? 'Unsaved order. Save or cancel before changing groups.'
                  : 'No unsaved changes.')}
            </p>
          </div>
          <p className="ayo-reorder__intro">
            Drag rows or use the arrows, then select Save order. Cancel discards unsaved moves and
            returns to the list.
          </p>
          {snapshot && snapshot.groups.length > 0 && (
            <label className="ayo-reorder__group">
              Group{' '}
              <select
                value={groupID}
                disabled={busy || dirty}
                onChange={(event) => {
                  const selected = snapshot.groups.find((item) => item.id === event.target.value)!
                  setGroupID(selected.id)
                  setItems(selected.items)
                  setNotice('')
                  setMovedID(null)
                  setError('')
                }}
              >
                {snapshot.groups.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} ({item.items.length})
                  </option>
                ))}
              </select>
            </label>
          )}
          {group && (
            <p className="ayo-reorder__hint">
              Showing {items.length} record{items.length === 1 ? '' : 's'} in this group.
              {(collection === 'people' || collection === 'partners') &&
                ' This includes inactive records.'}
              {collection === 'people' &&
                (groupID === 'team'
                  ? ' Team roles set the main order. This order applies to people sharing a role.'
                  : ' Instrument sections follow the order set in Roles.')}
            </p>
          )}
          {busy && !snapshot && <p role="status">Loading order…</p>}
          {error && (
            <div role="alert" className="ayo-reorder__error">
              <p>{error}</p>
              <button
                type="button"
                className="ayo-reorder__button"
                disabled={busy}
                onClick={() => void load()}
              >
                Reload order
              </button>
              <span> Reloading discards unsaved moves.</span>
            </div>
          )}
          {snapshot && !snapshot.groups.length && <p>No records to reorder yet.</p>}
          {group && items.length < 2 && <p>This group needs at least two records to reorder.</p>}
          {items.length > 0 && (
            <div className="ayo-reorder__columns" aria-hidden="true">
              <span />
              <span>#</span>
              <span>Record</span>
              <span>Move</span>
            </div>
          )}
          <ol className="ayo-reorder__list" aria-label="Current order" aria-busy={busy}>
            {items.map((item, index) => (
              <li
                key={item.id}
                ref={(row) => {
                  if (row) rows.current.set(item.id, row)
                  else rows.current.delete(item.id)
                }}
                className={item.id === movedID ? 'ayo-reorder__row--moved' : undefined}
                draggable={!busy && items.length > 1}
                onDragStart={(event) => {
                  dragged.current = item.id
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', item.id)
                }}
                onDragEnd={() => {
                  dragged.current = null
                }}
                onDragOver={(event) => {
                  if (!busy && dragged.current) event.preventDefault()
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  if (busy || !dragged.current) return
                  move(
                    items.findIndex((row) => row.id === dragged.current),
                    index,
                  )
                  dragged.current = null
                }}
              >
                <span className="ayo-reorder__handle" aria-hidden="true">
                  ⠿
                </span>
                <span className="ayo-reorder__position">{index + 1}</span>
                <span className="ayo-reorder__label">
                  {item.label}
                  {(collection === 'people' || collection === 'partners') && (
                    <StatusBadge active={!item.inactive} />
                  )}
                </span>
                <div className="ayo-reorder__actions">
                  <button
                    type="button"
                    aria-label={`Move ${item.label} up`}
                    title="Move up"
                    disabled={busy || index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${item.label} down`}
                    title="Move down"
                    disabled={busy || index === items.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
export function CollectionReorder({ collectionSlug }: BeforeListTableClientProps) {
  return isReorderCollection(collectionSlug) ? (
    <Reorder key={collectionSlug} collection={collectionSlug} />
  ) : null
}
