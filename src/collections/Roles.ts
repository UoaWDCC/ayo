import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
    slug: 'roles',
    fields: [
        {
            name: 'role',
            type: 'text',
            required: true,
        },
        {
            name: 'sortOrder',
            type: 'number',
            required: true,
        }
    ]
}