import type { CollectionConfig } from 'payload'

import { Roles } from './Roles'

export const People: CollectionConfig = {
    slug: 'people',
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'role',
            type: 'relationship',
            relationTo: 'roles',
            hasMany: false,
            admin: {
                sortOptions: 'sortOrder',
            }
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Player',
                    value: 'player'
                },
                {
                    label: 'Team',
                    value: 'team'
                },
                {
                    label: 'Alumni',
                    value: 'alumni'
                }
            ]
        },
        {
            name: 'description',
            type: 'text'
        },
        {
            name: 'years',
            type: 'text',
            required: true
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name: 'isActive',
            type: 'checkbox',
            required: true
        }
    ]
}