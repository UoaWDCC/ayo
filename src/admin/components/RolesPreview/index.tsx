'use client'

import { useConfig, useDocumentInfo } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useEffect, useState } from 'react'

import './index.scss'

type PersonDoc = { id: string; name?: string; type?: string; isActive?: boolean }

// Shows the People currently assigned to this role, derived live from the People collection
// (never hard-coded) — People.role is a relationship to Roles, so we query the other side.
const RolesPreviewInner: React.FC = () => {
  const { id } = useDocumentInfo()
  const { config } = useConfig()
  const [people, setPeople] = useState<PersonDoc[] | null>(null)

  useEffect(() => {
    if (!id) {
      setPeople(null)
      return
    }
    const controller = new AbortController()
    const query = `where[role][equals]=${encodeURIComponent(String(id))}&sort=name&limit=100&depth=0`
    fetch(`${config.serverURL}${config.routes.api}/people?${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setPeople(body?.docs ?? []))
      .catch(() => {})
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Current holders</span>
      </div>

      {!id ? (
        <p className="ayo-preview__empty">Save the role to see who currently holds it.</p>
      ) : people === null ? (
        <p className="ayo-preview__empty">Loading…</p>
      ) : people.length === 0 ? (
        <p className="ayo-preview__empty">No one currently holds this role.</p>
      ) : (
        <ul className="ayo-holders">
          {people.map((person) => (
            <li key={person.id} className="ayo-holders__row">
              <span className="ayo-holders__name">{person.name || 'Untitled'}</span>
              {person.isActive === false ? (
                <span className="ayo-holders__flag">Inactive</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const RolesPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <RolesPreviewInner />
  </PreviewErrorBoundary>
)

export default RolesPreview
