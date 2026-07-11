import type { CollectionConfig } from 'payload'

export const Concerts: CollectionConfig = {
    slug: 'concerts',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true
        },
        {
            name: 'description',
            type: 'richText',
            required: true
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
            required: true
        },
        {
            name: 'pdf',
            type: 'upload',
            relationTo: 'media'
        }
    ]
}
