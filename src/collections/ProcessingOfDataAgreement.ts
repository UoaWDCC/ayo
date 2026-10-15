import type { CollectionConfig } from 'payload'
import { protectCurrentSettingsRecord } from '@/hooks/protectCurrentSettingsRecord'

/**
 * Processing of Data Agreement collection:
 *
 * - title: internal name for the entry, not shown on the site
 * - content: the agreement text shown in the pop-up on the Contact Us form
 *
 * Site Settings selects the current agreement. Older records can be retained.
 */

export const ProcessingOfDataAgreement: CollectionConfig = {
  slug: 'processing-of-data-agreement',
  hooks: { beforeDelete: [protectCurrentSettingsRecord('processing-of-data-agreement')] },

  labels: {
    singular: 'Processing of Data Agreement',
    plural: 'Processing of Data Agreements',
  },

  admin: {
    group: 'Administration',
    useAsTitle: 'title',
    description:
      'Agreement text for the Contact Us form. Choose the current agreement in Site Settings. Editing an older record does not select it.',
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
