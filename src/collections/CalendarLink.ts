import type { CollectionConfig } from 'payload'

export const CalendarLink: CollectionConfig = {
  slug: 'calendar-links',
  admin: {
    description: 'The calendar embed, public, and iCal links used on the site.',
    defaultColumns: ['embedLink', 'publicLink', 'icalLink', 'updatedAt'],
  },
  fields: [
    {
      name: 'embedLink',
      type: 'text',
      label: 'Embed Link',
    },
    {
      name: 'publicLink',
      type: 'text',
      label: 'Public Link',
    },
    {
      name: 'icalLink',
      type: 'text',
      label: 'iCal Link',
    },
  ],
}
