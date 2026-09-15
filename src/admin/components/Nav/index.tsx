import type { CollectionSlug, ServerProps } from 'payload'

import { NavClient } from './NavClient'

type NavItem = { slug: CollectionSlug; label: string }
type NavGroup = { label: string; items: NavItem[] }

// Content / Concerts / People & Supporters / Assets & Resources / Administration — the frozen
// A2 grouping. Passwords is deliberately absent (unreviewed access model).
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content',
    items: [
      { slug: 'pages', label: 'Pages' },
      { slug: 'posts', label: 'Posts' },
      { slug: 'faqs', label: 'FAQs' },
    ],
  },
  {
    label: 'Concerts',
    items: [
      { slug: 'concerts', label: 'Concerts' },
      { slug: 'calendar-links', label: 'Calendar Links' },
    ],
  },
  {
    label: 'People & Supporters',
    items: [
      { slug: 'people', label: 'People' },
      { slug: 'roles', label: 'Roles' },
      { slug: 'partners', label: 'Partners' },
    ],
  },
  {
    label: 'Assets & Resources',
    items: [
      { slug: 'media', label: 'Media' },
      { slug: 'link', label: 'Links' },
    ],
  },
  {
    label: 'Administration',
    items: [{ slug: 'users', label: 'Users' }],
  },
]

export default async function Nav({ payload, visibleEntities }: ServerProps) {
  const visible = new Set(visibleEntities?.collections || [])

  const groups = await Promise.all(
    NAV_GROUPS.map(async (group) => {
      const items = await Promise.all(
        group.items
          .filter((item) => visible.has(item.slug))
          .map(async (item) => {
            const { totalDocs } = await payload.count({ collection: item.slug, overrideAccess: true })
            return { ...item, count: totalDocs }
          }),
      )
      return { label: group.label, items }
    }),
  )

  return <NavClient groups={groups.filter((g) => g.items.length > 0)} />
}
