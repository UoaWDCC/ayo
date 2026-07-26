import type { CollectionConfig } from 'payload'

export const CalendarLink: CollectionConfig = {
  slug: 'links',
  fields: [
    {
      name: 'embedLink',
      type: 'text',
    },
    {
      name: 'publicLink',
      type: 'text',
    },
    {
      name: 'icalLink',
      type: 'text',
    },
  ],
}
