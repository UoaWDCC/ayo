import type { CollectionConfig } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'

export const TeamRoles: CollectionConfig = {
  slug: 'team-roles',
  endpoints: reorderEndpoints('team-roles'),
  defaultSort: ['roleType', 'sortOrder'],

  admin: {
    group: 'People & Supporters',
    useAsTitle: 'roleName',
    description: 'Committee and administration roles assigned to team members.',
    defaultColumns: ['roleName', 'roleType', 'updatedAt'],
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
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
      name: 'roleType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Executive Committee',
          value: 'executive',
        },
        {
          label: 'Administration',
          value: 'admin',
        },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
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
