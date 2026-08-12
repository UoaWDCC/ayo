import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'

/**
 * Pages collection:
 *
 * Block-based page builder for static/public-facing pages
 * (Home, About, Get Involved, Support Us, Contact, etc).
 *
 * - title: internal admin-facing page name
 * - slug: URL identifier used by the frontend to resolve which page
 *   to render (e.g. "home", "about", "support-us")
 * - layout: ordered array of content blocks (Hero, RichText) that the
 *   admin composes per page without needing a developer to hardcode
 *   frontend content
 */

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, RichText],
    },
  ],
}
