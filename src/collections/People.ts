import type { CollectionConfig } from 'payload'

export const People: CollectionConfig = {
  slug: 'people',

  admin: {
    useAsTitle: 'name',
    description: 'Everyone in AYO, players, team, and alumni, shown on the site.',
    defaultColumns: ['name', 'photo', 'type', 'role', 'isActive'],
  },

  fields: [
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
      admin: {
        components: {
          Cell: '@/admin/components/PhotoThumbnailCell#PhotoThumbnailCell',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'peoplePreview',
      type: 'ui',
      label: 'Site preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PeoplePreview#PeoplePreview',
        },
      },
    },
  ],
}
