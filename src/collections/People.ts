import type { CollectionConfig } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'

export const People: CollectionConfig = {
  slug: 'people',
  endpoints: reorderEndpoints('people'),
  defaultSort: ['type', 'sortOrder', 'name'],

  admin: {
    group: 'People & Supporters',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isActive', 'years'],
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
  },

  fields: [
    { name: 'sortOrder', type: 'number', defaultValue: 0, index: true, admin: { hidden: true } },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: false,
      admin: {
        sortOptions: 'sortOrder',
        condition: (_, siblingData) =>
          siblingData.type === 'player' || siblingData.type === 'alumni',
      },
    },
    {
      name: 'teamRoles',
      type: 'relationship',
      relationTo: 'team-roles',
      hasMany: true,
      admin: {
        sortOptions: 'sortOrder',
        condition: (_, siblingData) => siblingData.type === 'team',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Player',
          value: 'player',
        },
        {
          label: 'Team',
          value: 'team',
        },
        {
          label: 'Alumni',
          value: 'alumni',
        },
      ],
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'years',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { components: { Cell: '@/admin/components/PhotoThumbnailCell#PhotoThumbnailCell' } },
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'checkbox',
      required: true,
      admin: { components: { Cell: '@/admin/components/StatusCell#StatusCell' } },
    },
  ],
}
