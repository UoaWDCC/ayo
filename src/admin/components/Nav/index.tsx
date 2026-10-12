import type {
  CollectionSlug,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  ServerProps,
} from 'payload'

import { NavClient } from './NavClient'

/**
 * The order the sidebar groups appear in — Content / Concerts / People & Supporters /
 * Assets & Resources / Administration, the frozen A2 grouping.
 *
 * Which group an entity belongs to is not listed here: it comes from that
 * collection's or global's own `admin.group`, the same value Payload's dashboard
 * cards read. So the two views can never disagree, and a new collection shows up in
 * both the moment it's registered. A group that isn't named below still renders,
 * appended after these — nothing in the config can be invisible.
 */
const GROUP_ORDER = [
  'Content',
  'Concerts',
  'People & Supporters',
  'Assets & Resources',
  'Administration',
]

type I18n = ServerProps['i18n']

/** A label as Payload stores it: plain text, one string per locale, or a function. */
type EntityLabel = SanitizedCollectionConfig['labels']['plural'] | SanitizedGlobalConfig['label']

function resolveLabel(label: EntityLabel, i18n: I18n): string {
  if (typeof label === 'function') {
    // A label function is typed against the client translation keys, a narrower set
    // than the `t` on the server-side i18n we are handed; the call itself is the same.
    return label({ i18n, t: i18n.t } as Parameters<typeof label>[0])
  }
  if (typeof label === 'string') {
    return label
  }
  return label[i18n.language] ?? Object.values(label)[0] ?? ''
}

type NavEntry = {
  /** Document count, for collections only — globals are a single document. */
  count?: number
  group: string
  href: string
  label: string
  slug: string
}

export default async function Nav({ i18n, payload, permissions, visibleEntities }: ServerProps) {
  const adminRoute = payload.config.routes.admin

  // `admin.group: false` is Payload's own opt-out from the sidebar and the dashboard;
  // `admin.hidden` is already applied for us in visibleEntities.
  const collections = payload.config.collections.filter(
    ({ slug, admin }) =>
      admin?.group !== false &&
      visibleEntities?.collections.includes(slug) &&
      permissions?.collections?.[slug]?.read,
  )

  const globals = payload.config.globals.filter(
    ({ slug, admin }) =>
      admin?.group !== false &&
      visibleEntities?.globals.includes(slug) &&
      permissions?.globals?.[slug]?.read,
  )

  const collectionEntries: NavEntry[] = await Promise.all(
    collections.map(async ({ slug, admin, labels }) => {
      const { totalDocs } = await payload.count({
        collection: slug as CollectionSlug,
        overrideAccess: true,
      })

      return {
        count: totalDocs,
        group: admin.group ? resolveLabel(admin.group, i18n) : i18n.t('general:collections'),
        href: `${adminRoute}/collections/${slug}`,
        label: resolveLabel(labels.plural, i18n),
        slug,
      }
    }),
  )

  const globalEntries: NavEntry[] = globals.map(({ slug, admin, label }) => ({
    group: admin.group ? resolveLabel(admin.group, i18n) : i18n.t('general:globals'),
    href: `${adminRoute}/globals/${slug}`,
    label: resolveLabel(label, i18n),
    slug,
  }))

  const entries = [...collectionEntries, ...globalEntries]

  // Listed groups first, in order, then any group the list doesn't name.
  const groupLabels = [...new Set([...GROUP_ORDER, ...entries.map((entry) => entry.group)])]

  const groups = groupLabels
    .map((label) => ({ label, items: entries.filter((entry) => entry.group === label) }))
    .filter((group) => group.items.length > 0)

  return <NavClient groups={groups} />
}
