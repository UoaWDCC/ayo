type LinkOptions = { allowSitePath?: boolean; allowWebcal?: boolean }

/** A usable destination, shared by field validation and public rendering. */
export function safeHref(value: unknown, options: LinkOptions = {}): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  if (!href || /[\s\\\u0000-\u001f\u007f]/.test(href)) return undefined
  if (options.allowSitePath && href.startsWith('/') && !href.startsWith('//')) return href
  const protocols = options.allowWebcal ? ['http:', 'https:', 'webcal:'] : ['http:', 'https:']
  if (!/^[a-z]+:\/\//i.test(href)) return undefined
  try {
    const url = new URL(href)
    return protocols.includes(url.protocol) && url.hostname && !url.username && !url.password
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

function validateURL(value: unknown, options: LinkOptions, required = false): true | string {
  if (value == null || (typeof value === 'string' && !value.trim()))
    return required ? 'Enter a destination for this link.' : true
  if (safeHref(value, options)) return true
  return options.allowSitePath
    ? 'Enter a full http:// or https:// URL, or a site path such as /api/media/file/document.pdf.'
    : options.allowWebcal
      ? 'Enter a full http://, https:// or webcal:// calendar URL.'
      : 'Enter a full http:// or https:// URL.'
}

export const validateWebURL = (value: unknown) => validateURL(value, {})
export const validateDocumentURL = (value: unknown) => validateURL(value, { allowSitePath: true })
export const validateRequiredDocumentURL = (value: unknown) =>
  validateURL(value, { allowSitePath: true }, true)
export const validateCalendarURL = (value: unknown) => validateURL(value, { allowWebcal: true })
