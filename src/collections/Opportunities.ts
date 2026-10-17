import type { CollectionConfig } from 'payload'
import { validateWebURL } from '@/lib/urls'

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
    description: 'Scholarships, competitions and programmes listed on Join AYO.',
    defaultColumns: ['title', 'type', 'closingDate', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title shown on the website, for example AYO Soloist Competition.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['Scholarship', 'Competition', 'Workshop', 'Residency'],
      admin: {
        description: 'The opportunity category used in the website listing and its filters.',
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
          'The application deadline in New Zealand time. The website hides this opportunity after the deadline.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'The description shown in the listing and when a visitor opens the opportunity.',
      },
    },
    {
      name: 'applyUrl',
      type: 'text',
      validate: validateWebURL,
      admin: {
        description: 'The full http:// or https:// application URL. Leave blank to hide Apply.',
      },
    },
    {
      name: 'value',
      type: 'text',
      admin: {
        description: 'Optional. The amount or benefit offered, for example $3,000.',
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
