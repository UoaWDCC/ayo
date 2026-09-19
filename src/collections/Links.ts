import type { CollectionConfig } from 'payload'

export const Links: CollectionConfig = {
  slug: 'link',
  admin: {
    useAsTitle: 'name',
    description: 'Document links shown in the Resources and Links sections in /join-ayo.',
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
