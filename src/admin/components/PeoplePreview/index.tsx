'use client'

import { PreviewErrorBoundary } from '../shared/PreviewErrorBoundary'
import React from 'react'

import './index.scss'

// Left intentionally empty. The previous version showed a strip of neighbouring People sorted
// by name, but real ordering on the site depends on role/team sort order that isn't settled yet
// (see the unmerged TeamRoles work on main) — a preview built on `sort=name` would just show the
// wrong order. Revisit this once that lands.
const PeoplePreviewInner: React.FC = () => {
  return (
    <div className="ayo-preview">
      <div className="ayo-preview__head">
        <span className="ayo-preview__label">Preview</span>
      </div>
      <p className="ayo-preview__empty">Preview coming soon.</p>
    </div>
  )
}

export const PeoplePreview: React.FC = () => (
  <PreviewErrorBoundary>
    <PeoplePreviewInner />
  </PreviewErrorBoundary>
)

export default PeoplePreview
