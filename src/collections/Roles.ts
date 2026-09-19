import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',

  admin: {
    useAsTitle: 'displayName',
    description: 'The instrument sections and roles used to group People.',
    defaultColumns: ['displayName', 'roleName', 'sortOrder'],
  },

  fields: [
    {
      name: 'roleName',
      type: 'text',
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'rolePreview',
      type: 'ui',
      label: 'Current holders',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/RolesPreview#RolesPreview',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        data.displayName = `${data.sortOrder} - ${data.roleName}`
        return data
      },
    ],
  },
}
