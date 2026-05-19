import type { CollectionConfig } from 'payload'

/**
 * Partners collection:
 *
 * - name: partner name
 * - partnerType: category of partner, using placeholder options until confirmed
 * - logo: uploaded partner logo from the Media collection
 * - websiteUrl: optional partner website link
 * - isActive: controls whether this partner should be shown on the frontend
 */

export const Partners: CollectionConfig = {
  slug: 'partners',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'partnerType', 'websiteUrl', 'isActive'],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'partnerType',
      type: 'select',
      label: 'Partner Type',
      defaultValue: 'partner',
      options: [
        // PLACEHOLDERS: Need to confirm with client about options
        { label: 'Partner', value: 'partner' },
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Supporter', value: 'supporter' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
  ],
}
