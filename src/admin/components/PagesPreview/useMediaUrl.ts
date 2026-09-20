import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type MediaDoc = { alt?: string; url?: string }

// Upload fields hold just the media ID in form state; resolve it to a URL for the preview.
export function useMediaUrl(value: unknown): MediaDoc | null {
  const { config } = useConfig()
  const id = typeof value === 'string' ? value : null
  const [media, setMedia] = useState<MediaDoc | null>(
    typeof value === 'object' && value ? (value as MediaDoc) : null,
  )

  useEffect(() => {
    if (!id) {
      setMedia(null)
      return
    }
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${id}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => setMedia(doc))
      .catch(() => {})
    return () => controller.abort()
  }, [id, config.routes.api, config.serverURL])

  return media
}
