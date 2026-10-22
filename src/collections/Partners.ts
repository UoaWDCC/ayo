import type { CollectionConfig, UploadFieldValidation } from 'payload'
import { upload } from 'payload/shared'
import { reorderEndpoints } from '@/endpoints/reorder'
import { validateWebURL } from '@/lib/urls'

export const validatePartnerLogo: UploadFieldValidation = (value, options) => {
  const inactive = (options.siblingData as { isActive?: boolean })?.isActive === false
  if (!inactive && !value) return 'Add a logo before making this partner active.'
  return upload(value, options)
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  endpoints: reorderEndpoints('partners'),
  defaultSort: ['partnerType', 'sortOrder', 'name'],

  admin: {
    group: 'People & Supporters',
    useAsTitle: 'name',
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
    description: 'Partners, sponsors and supporters shown on the website.',
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
      validate: validatePartnerLogo,
      admin: {
        description: 'Add the logo before making this partner active.',
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
