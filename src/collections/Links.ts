import type { CollectionConfig } from 'payload'
import { validateRequiredDocumentURL } from '@/lib/urls'

export const Links: CollectionConfig = {
  slug: 'link',
  admin: {
    group: 'Assets & Resources',
    useAsTitle: 'name',
    description: 'Documents and website links shown in the Resources and Links sections of My AYO.',
    defaultColumns: ['name', 'category', 'url'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: validateRequiredDocumentURL,
      admin: { description: 'A full web URL or a site path such as /api/media/file/handbook.pdf.' },
    },
    {
      name: 'category',
      type: 'select',
      options: ['resources', 'links'],
      required: true,
    },
    {
      name: 'linksPreview',
      type: 'ui',
      label: 'Site preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/LinksPreview#LinksPreview',
        },
      },
    },
  ],
}
