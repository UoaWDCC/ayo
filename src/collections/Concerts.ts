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
        },
        {
            name: 'repertoire',
            type: 'array',
            fields: [
                {name: 'composer', type: 'text', required: true},
                {name: 'workTitle', type: 'text', required: true},
                {name: 'soloist', type: 'text'},
                {name: 'movements', type: 'text'}
            ]
        },
        {
            name: 'performances',
            type: 'array',
            fields: [
                {name: 'dateTime', type: 'date', required: true},
                {name: 'venue', type: 'text'},
                {name: 'venueAddress', type: 'text'},
                {name: 'bookingUrl', type: 'text'},
                {name: 'price', type: 'text'}
            ]
        },
        {
            name: 'photo_links',
            type: 'array',
            fields: [{name: 'link', type: 'text'}]
        },
        {
            name: 'video_links',
            type: 'array',
            fields: [{name: 'link', type: 'text'}]
        }
    ]
}
