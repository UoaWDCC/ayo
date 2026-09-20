// Flattens a Lexical richText JSON value to plain text. Shared by every preview component
// that needs to show a clamped text excerpt of a richText field.
export function richTextToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value : ''
  const nodes = (value as { root?: { children?: unknown[] } }).root?.children
  if (!Array.isArray(nodes)) return ''
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join('')
    return ''
  }
  return nodes.map(walk).join(' ').trim()
}

export default richTextToPlainText
