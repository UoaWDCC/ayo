import type { PayloadRequest } from 'payload'

const RECENT_COUNT = 6
const collections = [
  { slug: 'pages', label: 'Pages', title: 'title' },
  { slug: 'posts', label: 'Posts', title: 'title' },
  { slug: 'concerts', label: 'Concerts', title: 'title' },
  { slug: 'faqs', label: 'FAQs', title: 'question' },
  { slug: 'opportunities', label: 'Opportunities', title: 'title' },
  { slug: 'people', label: 'People', title: 'name' },
  { slug: 'roles', label: 'Roles', title: 'roleName' },
  { slug: 'team-roles', label: 'Team Roles', title: 'roleName' },
  { slug: 'partners', label: 'Partners', title: 'name' },
  { slug: 'media', label: 'Media', title: 'filename' },
  { slug: 'link', label: 'Links', title: 'name' },
  { slug: 'calendar-links', label: 'Calendar', title: 'title' },
] as const

type Activity = { collection: string; title: string; href: string; updatedAt: string }
type ContentDocument = {
  id: string
  updatedAt: string
  title?: string
  question?: string
  name?: string
  roleName?: string
  filename?: string | null
}

export async function getRecentContent(req: PayloadRequest): Promise<Activity[]> {
  const { payload } = req
  const admin = payload.config.routes.admin
  const [results, settings] = await Promise.all([
    Promise.all(
      collections.map(({ slug, title }) =>
        payload.find({
          collection: slug,
          depth: 0,
          limit: RECENT_COUNT,
          sort: '-updatedAt',
          select: { [title]: true, updatedAt: true },
          req,
          overrideAccess: false,
        }),
      ),
    ),
    payload.findGlobal({
      slug: 'site-settings',
      select: { updatedAt: true },
      depth: 0,
      req,
      overrideAccess: false,
    }),
  ])
  const recent: Activity[] = results.flatMap((result, index) => {
    const source = collections[index]
    return result.docs.map((doc: ContentDocument) => ({
      collection: source.label,
      title: doc[source.title] || 'Untitled',
      href: `${admin}/collections/${source.slug}/${doc.id}`,
      updatedAt: doc.updatedAt,
    }))
  })
  if (settings.updatedAt)
    recent.push({
      collection: 'Settings',
      title: 'Site Settings',
      href: `${admin}/globals/site-settings`,
      updatedAt: settings.updatedAt,
    })
  return recent
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, RECENT_COUNT)
}
