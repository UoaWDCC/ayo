import type { Media } from '@/payload-types'

/** Every hero fallback bundled in /public is 2048x1364. */
const FALLBACK_SIZE = { width: 2048, height: 1364 }

export type HeroImage = {
  url: string
  /**
   * Intrinsic size of the file. Only used to reserve space before the image
   * loads — the hero renders with `height: auto` on mobile, so the final
   * layout follows the real file's ratio even if these are a rough guess.
   */
  width: number
  height: number
}

/**
 * Turns a Payload upload field into the props <Hero> needs. The field holds a
 * populated Media doc at depth >= 1 and a bare id at depth 0, and is unset on
 * pages whose hero block hasn't been filled in yet — all three fall back to a
 * bundled image.
 */
export function resolveHeroImage(
  image: Media | string | null | undefined,
  fallbackUrl = '/hero-placeholder.jpg',
): HeroImage {
  if (typeof image === 'object' && image !== null && image.url) {
    return {
      url: image.url,
      width: image.width ?? FALLBACK_SIZE.width,
      height: image.height ?? FALLBACK_SIZE.height,
    }
  }

  return { url: fallbackUrl, ...FALLBACK_SIZE }
}
