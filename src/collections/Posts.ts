import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
