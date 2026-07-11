import type { CollectionConfig } from 'payload'

export const Concerts: CollectionConfig = {
    slug: 'concerts',
    fields: [
        {
            name: 'title',
            type: 'text'
        }
    ]
}
