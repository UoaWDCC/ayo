import type { CollectionConfig } from 'payload'

export const CalendarLink: CollectionConfig = {
  slug: 'calendar-links',
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
