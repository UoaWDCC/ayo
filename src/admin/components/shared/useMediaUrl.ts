import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type MediaDoc = { alt?: string; url?: string }

// Upload fields hold just the media ID in form state; resolve it to a URL for the preview.
export function useMediaUrl(value: unknown): MediaDoc | null {
  const { config } = useConfig()
  const id = typeof value === 'string' ? value : null
  const [resolved, setResolved] = useState<{ id: string; media: MediaDoc | null } | null>(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    fetch(`${config.serverURL}${config.routes.api}/media/${encodeURIComponent(id)}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!controller.signal.aborted) setResolved({ id, media: doc })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResolved({ id, media: null })
      })
    return () => controller.abort()
  }, [id, config.routes.api, config.serverURL])

  if (typeof value === 'object' && value) return value as MediaDoc
  return id && resolved?.id === id ? resolved.media : null
}
