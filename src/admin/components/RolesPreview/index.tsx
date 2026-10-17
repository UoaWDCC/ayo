'use client'

import { useConfig, useDocumentInfo } from '@payloadcms/ui'
import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React, { useEffect, useState } from 'react'

import { PreviewPanel } from '../shared/PreviewPanel'
import { SavedPageLink } from '../shared/SavedPageLink'
import './index.scss'

type PersonDoc = { id: string; name?: string; type?: string; isActive?: boolean }

// Shows the People currently assigned to this role, derived live from the People collection
// (never hard-coded) — People.role is a relationship to Roles, so we query the other side.
const RolesPreviewInner: React.FC = () => {
  const { id } = useDocumentInfo()
  const { config } = useConfig()
  const [people, setPeople] = useState<PersonDoc[] | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!id) {
      setPeople(null)
      return
    }
    const controller = new AbortController()
    setPeople(null)
    setError(false)
    const query = `where[role][equals]=${encodeURIComponent(String(id))}&sort=name&limit=100&depth=0`
    fetch(`${config.serverURL}${config.routes.api}/people?${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load role holders')
        return res.json()
      })
      .then((body) => {
        if (!controller.signal.aborted) setPeople(body?.docs ?? [])
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [id, config.serverURL, config.routes.api, attempt])

  return (
    <PreviewPanel
      savedPage={<SavedPageLink href="/about-us" />}
      header={
        <div className="ayo-preview__head">
          <span className="ayo-preview__label">Assigned people</span>
        </div>
      }
    >
      {!id ? (
        <p className="ayo-preview__empty">Save this role to see the people assigned to it.</p>
      ) : error ? (
        <div role="status">
          <p>Could not load the people assigned to this role.</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            Retry
          </button>
        </div>
      ) : people === null ? (
        <p className="ayo-preview__empty">Loading…</p>
      ) : people.length === 0 ? (
        <p className="ayo-preview__empty">No people are assigned to this role.</p>
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
    </PreviewPanel>
  )
}

export const RolesPreview: React.FC = () => (
  <PreviewErrorBoundary>
    <RolesPreviewInner />
  </PreviewErrorBoundary>
)

export default RolesPreview
