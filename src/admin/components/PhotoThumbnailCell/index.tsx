'use client'

import { useConfig } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import type { Media } from '@/payload-types'

import './index.scss'

type MediaDoc = Pick<Media, 'id' | 'alt' | 'filename' | 'url' | 'sizes'>
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
  const resolvedMedia = typeof raw === 'object' && raw ? raw : photoId === media?.id ? media : null
  const url =
    resolvedMedia?.sizes?.thumbnail?.url || resolvedMedia?.sizes?.card?.url || resolvedMedia?.url

  useEffect(() => {
    if (!photoId) return
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${encodeURIComponent(photoId)}?depth=0`, {
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
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ayo-thumb__image" src={url} alt={resolvedMedia?.alt || ''} loading="lazy" />
      ) : (
        <div className="ayo-thumb__image ayo-thumb__image--empty" />
      )}
    </div>
  )
}

export default PhotoThumbnailCell
