import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { validateCalendarURL, validateWebURL } from '@/lib/urls'
import { protectCurrentCalendar } from '@/hooks/protectCurrentCalendar'

export const CalendarLink: CollectionConfig = {
  slug: 'calendar-links',
  admin: {
    group: 'Concerts',
    useAsTitle: 'title',
    description: 'Calendar links for the My AYO page.',
    defaultColumns: ['title', 'publicLink', 'updatedAt'],
  },
  hooks: {
    beforeDelete: [protectCurrentCalendar],
    beforeValidate: [
      ({ data, originalDoc }) => {
        const values = { ...originalDoc, ...data }
        if (
          ![values.embedLink, values.publicLink, values.icalLink].some(
            (value) => typeof value === 'string' && value.trim(),
          )
        ) {
          throw new ValidationError({
            collection: 'calendar-links',
            errors: [{ path: 'publicLink', message: 'Add at least one calendar link.' }],
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'AYO calendar',
      admin: { description: 'An internal name, such as AYO 2027 calendar.' },
    },
    {
      name: 'embedLink',
      type: 'text',
      label: 'Embed Link',
      validate: validateWebURL,
      admin: {
        description:
          'Paste the full calendar embed URL, not the iframe HTML code. Leave blank to hide the embedded calendar.',
      },
    },
    {
      name: 'publicLink',
      type: 'text',
      label: 'Public Link',
      validate: validateWebURL,
      admin: {
        description: 'The full public calendar URL. Leave blank to hide Add to Google Calendar.',
      },
    },
    {
      name: 'icalLink',
      type: 'text',
      label: 'iCal Link',
      validate: validateCalendarURL,
      admin: {
        description:
          'The full https:// or webcal:// subscription URL. Leave blank to hide the subscription and copy actions.',
      },
    },
  ],
}
