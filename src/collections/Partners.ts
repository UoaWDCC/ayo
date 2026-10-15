import type { CollectionConfig } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'
import { validateWebURL } from '@/lib/urls'

export const Partners: CollectionConfig = {
  slug: 'partners',
  endpoints: reorderEndpoints('partners'),
  defaultSort: ['partnerType', 'sortOrder', 'name'],

  admin: {
    group: 'People & Supporters',
    useAsTitle: 'name',
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
    description: 'The partners and sponsors shown on the site.',
    defaultColumns: ['name', 'logo', 'partnerType', 'isActive'],
  },

  fields: [
    { name: 'sortOrder', type: 'number', defaultValue: 0, index: true, admin: { hidden: true } },
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
      validate: validateWebURL,
      admin: { description: 'Optional. Use a full http:// or https:// website URL.' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Status',
      defaultValue: true,
      admin: { components: { Cell: '@/admin/components/StatusCell#StatusCell' } },
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
