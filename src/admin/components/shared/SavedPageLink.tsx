'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import './savedPageLink.scss'

export function SavedPageLink({ href }: { href: string | null }) {
  const { id } = useDocumentInfo()
  return (
    <div className="ayo-saved-page">
      {id && href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          View saved page ↗
        </a>
      ) : (
        <p>Save this record first to view it on the website.</p>
      )}
    </div>
  )
}
