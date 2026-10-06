'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useDocumentInfo, useForm, useFormFields } from '@payloadcms/ui'
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'

import './index.scss'

type RoleFormData = { roleName?: string }
type RoleDoc = { id: string; roleName?: string; sortOrder?: number }

const RolesOrderPreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const values = useMemo(() => reduceFieldsToValues(fields, true) as RoleFormData, [fields])
  const { config } = useConfig()
  const { id } = useDocumentInfo()
  const { dispatchFields } = useForm()
  const [items, setItems] = useState<RoleDoc[] | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [orderError, setOrderError] = useState(false)
  const draggedId = useRef<string | null>(null)

  const fetchItems = (signal?: AbortSignal) =>
    fetch(`${config.serverURL}${config.routes.api}/roles?sort=sortOrder&limit=200&depth=0`, {
      credentials: 'include',
      signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setItems(body?.docs ?? []))

  const displayItems = useMemo(() => {
    if (!items) return items
    if (items.some((item) => item.id === id)) return items
    return [{ id: '__unsaved__', roleName: values.roleName }, ...items]
  }, [items, id, values.roleName])

  useEffect(() => {
    const controller = new AbortController()
    fetchItems(controller.signal).catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const patchRoleOrder = (item: RoleDoc, sortOrder: number) =>
    fetch(`${config.serverURL}${config.routes.api}/roles/${item.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sortOrder,
        displayName: `${sortOrder} - ${item.roleName || 'Untitled role'}`,
      }),
    }).then((res) => {
      if (!res.ok) throw new Error(`Failed to update sortOrder for ${item.id}`)
    })

  const handleDragStart = (docId: string) => () => {
    draggedId.current = docId
  }

  const handleDragOver = (docId: string) => (event: React.DragEvent) => {
    event.preventDefault()
    if (!items || !draggedId.current || draggedId.current === docId) return
    const fromIndex = items.findIndex((item) => item.id === draggedId.current)
    const toIndex = items.findIndex((item) => item.id === docId)
    if (fromIndex === -1 || toIndex === -1) return
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setItems(next)
  }

  const handleDragEnd = () => {
    draggedId.current = null
    if (!items) return
    const changed = items.filter((item, index) => item.sortOrder !== index)
    if (changed.length === 0) return
    setSavingOrder(true)
    setOrderError(false)
    Promise.all(
      changed.map((item) => {
        const index = items.indexOf(item)
        if (item.id === id) {
          dispatchFields({ type: 'UPDATE', path: 'sortOrder', value: index })
          dispatchFields({
            type: 'UPDATE',
            path: 'displayName',
            value: `${index} - ${item.roleName || values.roleName || 'Untitled role'}`,
          })
        }
        return patchRoleOrder(item, index)
      }),
    )
      .then(() =>
        setItems((previous) => previous?.map((item, index) => ({ ...item, sortOrder: index })) ?? previous),
      )
      .catch(() => {
        setOrderError(true)
        return fetchItems()
      })
      .finally(() => setSavingOrder(false))
  }

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Display order</span>
      </div>

      {displayItems === null ? (
        <p className="ayo-role-order__empty">Loading...</p>
      ) : (
        <>
          <div className="ayo-role-order">
            {displayItems.map((item) => {
              const isCurrent = item.id === id || item.id === '__unsaved__'
              const isDraggable = item.id !== '__unsaved__'
              return (
                <div
                  key={item.id}
                  className={`ayo-role-order__item${isCurrent ? ' ayo-role-order__item--current' : ''}`}
                  draggable={isDraggable}
                  onDragStart={isDraggable ? handleDragStart(item.id) : undefined}
                  onDragOver={isDraggable ? handleDragOver(item.id) : undefined}
                  onDragEnd={isDraggable ? handleDragEnd : undefined}
                >
                  {isDraggable ? (
                    <span className="ayo-role-order__handle" aria-hidden="true">
                      ⠿
                    </span>
                  ) : null}
                  <span className="ayo-role-order__name">
                    {isCurrent ? values.roleName || 'Untitled role' : item.roleName || 'Untitled role'}
                  </span>
                  {isCurrent ? <span className="ayo-role-order__flag">Editing</span> : null}
                </div>
              )
            })}
          </div>
          <p className={`ayo-role-order__hint${orderError ? ' ayo-role-order__hint--error' : ''}`}>
            {savingOrder
              ? 'Saving order...'
              : orderError
                ? "Couldn't save that order - showing the last saved order instead."
                : 'Drag a role to reorder it.'}
          </p>
        </>
      )}
    </div>
  )
}

export const RolesOrderPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <RolesOrderPreviewInner />
  </PreviewErrorBoundary>
)

export default RolesOrderPreview