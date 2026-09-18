'use client'

import { useConfig } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import './index.scss'

type MediaDoc = { alt?: string; filename?: string; url?: string }
type UploadValue = MediaDoc | string
type CellProps = {
  cellData?: UploadValue | Array<{ photo?: UploadValue }>
  rowData?: { photo?: UploadValue }
}

// A row's cellData is either a single upload value (most collections) or, for an array field
// like Posts.photos, a list of { photo } rows — in which case the first photo represents the row.
function firstUploadValue(
  cellData: CellProps['cellData'],
  fallback?: UploadValue,
): UploadValue | undefined {
  if (Array.isArray(cellData)) return cellData[0]?.photo
  return cellData ?? fallback
}

export const PhotoThumbnailCell: React.FC<CellProps> = ({ cellData, rowData }) => {
  const { config } = useConfig()
  const raw = firstUploadValue(cellData, rowData?.photo)
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
