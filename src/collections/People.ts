import type { CollectionConfig } from 'payload'

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
            type: 'text'
        }
    ]
}