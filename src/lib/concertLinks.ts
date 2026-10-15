type ResourceFields = {
  pdf?: string | null
  photo_links?: { link?: string | null }[] | null
  video_links?: { link?: string | null }[] | null
}

/** Only render real web destinations or paths on this site, never placeholders. */
export function concertLink(value?: string | null): string | undefined {
  const href = value?.trim()
  if (!href || /[\s\\]/.test(href)) return undefined
  if (href.startsWith('/') && !href.startsWith('//')) return href
  if (!/^https?:\/\//i.test(href)) return undefined
  try {
    const url = new URL(href)
    return url.hostname ? url.href : undefined
  } catch {
    return undefined
  }
}

export function concertResourceLinks(fields: ResourceFields) {
  const programme = concertLink(fields.pdf)
  const group = (items: ResourceFields['photo_links'], label: string) => {
    const urls = (items || [])
      .map((item) => concertLink(item.link))
      .filter((url) => url !== undefined)
    return urls.map((href, i) => ({ label: urls.length > 1 ? `${label} ${i + 1}` : label, href }))
  }
  return [
    ...(programme ? [{ label: 'Programme', href: programme }] : []),
    ...group(fields.photo_links, 'Photos'),
    ...group(fields.video_links, 'Recordings'),
  ]
}
