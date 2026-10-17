import { getPayload } from 'payload'
import config from '@payload-config'
import type { SiteSetting } from '@/payload-types'
import { safeHref } from './urls'

/** The social platforms the `site-settings` global can hold a URL for. */
export const SOCIAL_PLATFORMS = ['instagram', 'youtube', 'facebook', 'linkedin'] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export type SocialLink = {
  platform: SocialPlatform
  /** Capitalised platform name, used as the link's accessible label. */
  name: string
  href: string
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * The social profiles that have a URL set, in a fixed display order.
 * A platform left blank in the CMS is left out rather than rendered dead.
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const settings = await getSiteSettings()

  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const href = safeHref(settings?.social?.[platform])
    if (!href) return []

    return [{ platform, name: platform.charAt(0).toUpperCase() + platform.slice(1), href }]
  })
}

/**
 * The `@handle` for an Instagram profile URL, derived so the account name
 * shown on the site can never drift from the link it sits next to.
 */
export function instagramHandle(url?: string | null): string | null {
  if (!url) return null

  try {
    const [handle] = new URL(url).pathname.split('/').filter(Boolean)
    return handle ? `@${handle}` : null
  } catch {
    return null
  }
}
