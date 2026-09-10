import type { CollectionConfig } from 'payload'

export const Links: CollectionConfig = {
  slug: 'link',
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
  ],
}
