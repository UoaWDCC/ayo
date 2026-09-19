'use client'

import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

// Isolates a sidebar preview panel from the rest of the document form: if the preview throws
// (e.g. Payload's own form-context effects tripping React's update-depth guard under a
// pathologically fast synthetic input burst), the form itself stays editable and saveable.
export class PreviewErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <p style={{ fontSize: 13, color: 'var(--ayo-text-meta)', fontStyle: 'italic' }}>
          Preview unavailable.
        </p>
      )
    }
    return this.props.children
  }
}

export default PreviewErrorBoundary
