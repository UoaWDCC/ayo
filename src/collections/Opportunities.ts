import type { CollectionConfig } from 'payload'

/**
 * The scholarships, competitions and programmes listed on /join-ayo.
 *
 * `closingDate` is the single source of truth for the deadline: the site
 * formats the "Apply by …" line from it in New Zealand time, sorts on it, and
 * stops listing an opportunity once it has passed. Entries stay here after
 * they close so they can be reused the following year.
 */
export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    description: 'Scholarships, competitions and programmes shown in the Opportunities table.',
    defaultColumns: ['title', 'type', 'closingDate', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'How the opportunity appears in the listing, e.g. "AYO Soloist Competition".',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['Scholarship', 'Competition', 'Workshop', 'Residency'],
      admin: {
        description: 'Fills the listing\'s Type filter and the detail panel\'s "Awarded" line.',
      },
    },
    {
      name: 'closingDate',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description:
          'When applications close, in New Zealand time. The listing hides the opportunity once this has passed.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Shown in full in the detail panel, and alongside the row in the listing.',
      },
    },
    {
      name: 'applyUrl',
      type: 'text',
      admin: {
        description: 'Where the Apply link goes. Leave blank and no Apply link is rendered.',
      },
    },
    {
      name: 'value',
      type: 'text',
      admin: {
        description:
          'Optional. What the opportunity is worth, e.g. "$3,000" — shown as the detail panel\'s "Value" line.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional photo shown at the top of the detail panel.',
      },
    },
  ],
}
