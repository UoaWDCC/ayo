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
      // manage by the "Site preview" panel
      // based on implementation in FAQ section
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      required: true,
      admin: {
        hidden: true,
      },
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
      name: 'roleOrderPreview',
      type: 'ui',
      label: 'Display order',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/RolesOrderPreview#RolesOrderPreview',
        },
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
