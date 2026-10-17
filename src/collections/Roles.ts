import type { CollectionConfig } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'

export const Roles: CollectionConfig = {
  slug: 'roles',
  endpoints: reorderEndpoints('roles'),
  defaultSort: 'sortOrder',

  admin: {
    group: 'People & Supporters',
    useAsTitle: 'roleName',
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
    description: 'Instrument sections used to group players and alumni.',
    defaultColumns: ['roleName', 'updatedAt'],
  },

  fields: [
    {
      name: 'roleName',
      label: 'Role',
      type: 'text',
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { hidden: true },
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
      label: 'Assigned people',
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
      ({ data, originalDoc }) => {
        data.displayName = `${data.sortOrder ?? originalDoc?.sortOrder ?? 0} - ${data.roleName ?? originalDoc?.roleName ?? ''}`
        return data
      },
    ],
  },
}
