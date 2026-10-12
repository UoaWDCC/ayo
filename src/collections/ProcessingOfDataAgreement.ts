import type { CollectionConfig } from 'payload'

/**
 * Processing of Data Agreement collection:
 *
 * - title: internal name for the entry, not shown on the site
 * - content: the agreement text shown in the pop-up on the Contact Us form
 *
 * Only the most recently updated entry is shown on the site.
 */

export const ProcessingOfDataAgreement: CollectionConfig = {
  slug: 'processing-of-data-agreement',

  labels: {
    singular: 'Processing of Data Agreement',
    plural: 'Processing of Data Agreements',
  },

  admin: {
    useAsTitle: 'title',
    description:
      'The text shown when someone clicks "processing of personal data" on the Contact Us form. Only the most recently updated entry is shown.',
    defaultColumns: ['title', 'updatedAt'],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'For your reference only. This is not shown on the site.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'The agreement text visitors can read before agreeing.',
      },
    },
  ],
}
