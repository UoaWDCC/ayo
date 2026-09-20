import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',

  admin: {
    useAsTitle: 'name',
    description: 'The partners and sponsors shown on the site.',
    defaultColumns: ['name', 'logo', 'partnerType', 'isActive'],
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
        // Placeholder options — pending confirmation with the client.
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
      admin: {
        components: {
          Cell: '@/admin/components/PhotoThumbnailCell#PhotoThumbnailCell',
        },
      },
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
    {
      name: 'partnersPreview',
      type: 'ui',
      label: 'Site preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PartnersPreview#PartnersPreview',
        },
      },
    },
  ],
}
