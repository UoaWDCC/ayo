export const reorderCollections = ['faqs', 'people', 'partners', 'roles', 'team-roles'] as const
export type ReorderCollection = (typeof reorderCollections)[number]
export function isReorderCollection(value: string): value is ReorderCollection {
  return reorderCollections.some((slug) => slug === value)
}
export type OrderDocument = {
  id: string
  updatedAt: string
  sortOrder?: number | null
  name?: string
  question?: string
  roleName?: string
  category?: string
  type?: string
  partnerType?: string | null
  roleType?: string
  role?: string | { id: string; roleName?: string } | null
  isActive?: boolean | null
}
export type OrderItem = { id: string; label: string; inactive: boolean }
export type OrderGroup = { id: string; label: string; items: OrderItem[] }
export type OrderSnapshot = { revision: string; groups: OrderGroup[] }
const labels: Record<string, string> = {
  'about-us': 'About Us',
  'concerts-events': 'Concerts & Events',
  'join-ayo': 'Join AYO',
  news: 'News',
  'support-us': 'Support Us',
  player: 'Players',
  alumni: 'Alumni',
  team: 'Team',
  partner: 'Partners',
  sponsor: 'Sponsors',
  supporter: 'Supporters',
  executive: 'Executive Committee',
  admin: 'Administration',
}
export function orderLabel(doc: OrderDocument): string {
  return doc.question ?? doc.name ?? doc.roleName ?? doc.id
}
export function compareOrdered(
  a: Pick<OrderDocument, 'id' | 'sortOrder'> & { name?: string },
  b: Pick<OrderDocument, 'id' | 'sortOrder'> & { name?: string },
): number {
  return (
    (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
    (a.name ?? '').localeCompare(b.name ?? '') ||
    a.id.localeCompare(b.id)
  )
}
export function orderGroup(
  collection: ReorderCollection,
  doc: OrderDocument,
): { id: string; label: string } {
  if (collection === 'people' && doc.type !== 'team') {
    const role = typeof doc.role === 'object' ? doc.role : null
    const roleID = typeof doc.role === 'string' ? doc.role : role?.id
    return {
      id: `${doc.type}:${roleID ?? 'unassigned'}`,
      label: `${labels[doc.type ?? ''] ?? 'People'}: ${role?.roleName ?? (roleID ? 'Instrument section' : 'No instrument role')}`,
    }
  }
  const key =
    collection === 'faqs'
      ? doc.category
      : collection === 'partners'
        ? doc.partnerType
        : collection === 'people'
          ? doc.type
          : collection === 'team-roles'
            ? doc.roleType
            : 'all'
  return {
    id: key ?? 'unassigned',
    label: key === 'all' ? 'Instrument roles' : (labels[key ?? ''] ?? 'Unassigned'),
  }
}
export function orderGroups(collection: ReorderCollection, docs: OrderDocument[]): OrderGroup[] {
  const groups = new Map<string, OrderGroup>()
  for (const doc of [...docs].sort(compareOrdered)) {
    const group = orderGroup(collection, doc)
    if (!groups.has(group.id)) groups.set(group.id, { ...group, items: [] })
    groups
      .get(group.id)!
      .items.push({ id: doc.id, label: orderLabel(doc), inactive: doc.isActive === false })
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label))
}
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items
  const result = [...items]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}
