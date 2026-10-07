//fetches recent media from the Instagram Graph API using INSTAGRAM_TOKEN.

const GRAPH_URL = 'https://graph.instagram.com/v23.0/me/media'
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

export type InstagramPost = {
  id: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  // Image to display. For videos this is the thumbnail.
  imageUrl: string
  permalink: string
  timestamp: string
}

export type InstagramFeedResult =
  | { ok: true; posts: InstagramPost[] }
  | { ok: false; reason: 'missing_token' | 'token_expired' | 'fetch_failed'; posts: [] }

type RawPost = {
  id: string
  caption?: string
  media_type: InstagramPost['mediaType']
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

type GraphError = { error?: { message?: string; code?: number; type?: string } }

export function mapPost(raw: RawPost): InstagramPost | null {
  // Videos expose thumbnail_url; images and carousels expose media_url.
  const imageUrl = raw.media_type === 'VIDEO' ? raw.thumbnail_url : raw.media_url
  if (!imageUrl || !raw.permalink) return null

  return {
    id: raw.id,
    caption: raw.caption ?? '',
    mediaType: raw.media_type,
    imageUrl,
    permalink: raw.permalink,
    timestamp: raw.timestamp,
  }
}

export async function getInstagramFeed(
  opts: { limit?: number; token?: string; revalidateSeconds?: number } = {},
): Promise<InstagramFeedResult> {
  const { limit = 8, token = process.env.INSTAGRAM_TOKEN, revalidateSeconds = 3600 } = opts

  if (!token) {
    console.warn('[instagram] INSTAGRAM_TOKEN is not set; skipping feed fetch.')
    return { ok: false, reason: 'missing_token', posts: [] }
  }

  // Do not log this URL: it contains the access token.
  const url = `${GRAPH_URL}?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`

  try {
    // next.revalidate caches the response so we don't hit Meta on every page view.
    const res = await fetch(url, { next: { revalidate: revalidateSeconds } } as RequestInit)

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as GraphError
      // Code 190 = invalid or expired access token.
      const expired = body.error?.code === 190
      console.warn(
        `[instagram] Fetch failed (${res.status}): ${body.error?.message ?? 'unknown error'}` +
          (expired ? ' -- token likely expired, refresh it.' : ''),
      )
      return { ok: false, reason: expired ? 'token_expired' : 'fetch_failed', posts: [] }
    }

    const json = (await res.json()) as { data?: RawPost[] }
    const posts = (json.data ?? []).map(mapPost).filter((p): p is InstagramPost => p !== null)
    return { ok: true, posts }
  } catch (err) {
    console.warn('[instagram] Network error while fetching feed:', (err as Error).message)
    return { ok: false, reason: 'fetch_failed', posts: [] }
  }
}
