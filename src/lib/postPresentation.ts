import { formatNZDateTime } from './concertDates'

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  alumni_story: 'Alumni Story',
  interview: 'Interview',
  scholarships: 'Scholarships',
  newsletters: 'Newsletters',
  education: 'Education',
  audience: 'Audience',
}

export function categoryLabel(category?: string | null): string {
  if (!category) return ''
  return CATEGORY_LABELS[category] ?? category
}

export function formatPublishedDate(date?: string | null): string {
  return formatNZDateTime(date, { weekday: 'short', day: 'numeric', month: 'long' }).replace(
    ',',
    '',
  )
}

export function richTextToPlainText(richText: unknown, maxLength = 220): string {
  if (!richText || typeof richText !== 'object') return ''
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  const collect = (nodes: unknown[]): string =>
    nodes
      .map((node) => {
        const n = node as { type?: string; text?: string; children?: unknown[] }
        if (n.type === 'text') return n.text ?? ''
        if (n.children) return collect(n.children)
        return ''
      })
      .join(' ')

  const text = collect(root.children).replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}
