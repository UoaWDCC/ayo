import type { CollectionConfig } from 'payload'

export const Spotlights: CollectionConfig = {
  slug: 'spotlights',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
  ],
}
