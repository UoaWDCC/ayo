'use client'

import { reduceFieldsToValues } from 'payload/shared'
import { useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react'

import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }
type RoleDoc = { id: string; roleName?: string }
type PersonListDoc = { id: string; name?: string; photo?: MediaDoc | string | null }

type PersonPreviewData = {
  name?: string
  role?: string | RoleDoc | null
  type?: string
  years?: string
  photo?: string | MediaDoc | null
}

const TYPE_LABELS: Record<string, string> = {
  player: 'Player',
  team: 'Team',
  alumni: 'Alumni',
}

function photoUrl(v?: MediaDoc | string | null): string | undefined {
  return typeof v === 'object' && v ? v.url : undefined
}

// Reproduces the A2 People-edit preview: the person's roster tile (matching the public site's
// square Grid/Card treatment) shown dominant in the middle of a three-up strip, with the real
// previous/next people of the same `type` (by name order) either side, dimmed — so the tile
// reads as "this person, in context" rather than a diagnostic card plus a separate fact row.
// Neighbours are derived live from real People records, never hard-coded; first/last people in
// a type simply have no tile on that side, matching A2's `!p ? <div/> : ...` fallback.
const PeoplePreviewInner: React.FC = () => {
  const rawFields = useFormFields(([fieldState]) => fieldState)
  const fields = useDeferredValue(rawFields)
  const { config } = useConfig()
  const { id } = useDocumentInfo()

  const [photo, setPhoto] = useState<MediaDoc | null>(null)
  const [role, setRole] = useState<RoleDoc | null>(null)
  const [neighbours, setNeighbours] = useState<{
    prev: PersonListDoc | null
    next: PersonListDoc | null
  } | null>(null)

  const values = useMemo(() => reduceFieldsToValues(fields, true) as PersonPreviewData, [fields])
  const photoValue = values.photo
  const photoId = typeof photoValue === 'string' ? photoValue : null
  const roleValue = values.role
  const roleId = typeof roleValue === 'string' ? roleValue : null
  const type = values.type

  useEffect(() => {
    if (typeof photoValue === 'object' && photoValue) {
      setPhoto(photoValue)
      return
    }
    if (!photoId) {
      setPhoto(null)
      return
    }
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${photoId}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setPhoto(doc))
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId])

  useEffect(() => {
    if (typeof roleValue === 'object' && roleValue) {
      setRole(roleValue)
      return
    }
    if (!roleId) {
      setRole(null)
      return
    }
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/roles/${roleId}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setRole(doc))
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId])

  useEffect(() => {
    if (!id || !type) {
      setNeighbours(null)
      return
    }
    const controller = new AbortController()
    // depth=1 so each neighbour's photo relationship resolves to a usable url directly.
    const query = `where[type][equals]=${encodeURIComponent(type)}&sort=name&limit=200&depth=1`
    fetch(`${config.serverURL}${config.routes.api}/people?${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const docs: PersonListDoc[] = body?.docs ?? []
        const index = docs.findIndex((d) => d.id === id)
        if (index === -1) {
          setNeighbours(null)
          return
        }
        setNeighbours({
          prev: index > 0 ? docs[index - 1] : null,
          next: index < docs.length - 1 ? docs[index + 1] : null,
        })
      })
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type])

  const subtitle = `${role?.roleName || (type ? TYPE_LABELS[type] || type : 'No role set')}${values.years ? ` · ${values.years}` : ''}`

  const tiles: { key: string; name: string; subtitle: string; url?: string; current: boolean }[] = [
    neighbours?.prev
      ? {
          key: 'prev',
          name: neighbours.prev.name || 'Untitled',
          subtitle: '',
          url: photoUrl(neighbours.prev.photo),
          current: false,
        }
      : { key: 'prev-empty', name: '', subtitle: '', current: false },
    { key: 'current', name: values.name || 'Untitled', subtitle, url: photo?.url, current: true },
    neighbours?.next
      ? {
          key: 'next',
          name: neighbours.next.name || 'Untitled',
          subtitle: '',
          url: photoUrl(neighbours.next.photo),
          current: false,
        }
      : { key: 'next-empty', name: '', subtitle: '', current: false },
  ]

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
      </div>

      <div className="ayo-people-strip">
        {tiles.map((t) =>
          t.name ? (
            <div
              key={t.key}
              className={`ayo-people-strip__tile${t.current ? ' ayo-people-strip__tile--current' : ''}`}
            >
              {t.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="ayo-people-strip__image" src={t.url} alt="" />
              ) : (
                <div className="ayo-people-strip__image ayo-people-strip__image--empty">
                  {t.current ? <span>No photo selected</span> : null}
                </div>
              )}
              <p className="ayo-people-strip__name">{t.name}</p>
              {t.subtitle ? <p className="ayo-people-strip__subtitle">{t.subtitle}</p> : null}
            </div>
          ) : (
            <div
              key={t.key}
              className="ayo-people-strip__tile ayo-people-strip__tile--placeholder"
              aria-hidden="true"
            />
          ),
        )}
      </div>
      {type ? (
        <p className="ayo-people-strip__caption">
          Position among {TYPE_LABELS[type] || type}, by name.
        </p>
      ) : null}
    </div>
  )
}

export const PeoplePreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PeoplePreviewInner />
  </PreviewErrorBoundary>
)

export default PeoplePreview
