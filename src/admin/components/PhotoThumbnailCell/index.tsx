'use client'

import { useConfig } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }
type CellProps = {
  cellData?: MediaDoc | string
  rowData?: { photo?: MediaDoc | string }
}

export const PhotoThumbnailCell: React.FC<CellProps> = ({ cellData, rowData }) => {
  const { config } = useConfig()
  const raw = cellData ?? rowData?.photo
  const [media, setMedia] = useState<MediaDoc | null>(typeof raw === 'object' && raw ? raw : null)

  const photoId = typeof raw === 'string' ? raw : null

  useEffect(() => {
    if (!photoId) return
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${photoId}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setMedia(doc))
      .catch(() => {})
    return () => controller.abort()
  }, [photoId, config.routes.api, config.serverURL])

  return (
    <div className="ayo-thumb">
      {media?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ayo-thumb__image" src={media.url} alt={media.alt || ''} />
      ) : (
        <div className="ayo-thumb__image ayo-thumb__image--empty" />
      )}
    </div>
  )
}

export default PhotoThumbnailCell
