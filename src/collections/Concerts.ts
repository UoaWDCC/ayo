import type { CollectionConfig } from 'payload'

export const Concerts: CollectionConfig = {
    slug: 'concerts',
    admin: {
        useAsTitle: 'title',
        description: 'Every concert series, with its repertoire and performance dates.',
        defaultColumns: ['photo', 'title', 'updatedAt'],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            admin: {
                description: 'How the concert appears on the public site.',
            },
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
            required: true,
            admin: {
                description: 'The feature photo shown on the public listing and card.',
                components: {
                    Cell: '@/admin/components/PhotoThumbnailCell#PhotoThumbnailCell',
                },
            },
        },
        {
            name: 'pdf',
            type: 'text',
            admin: {
                description: 'Optional. The filename of the programme, if one is published.',
            },
        },
        {
            name: 'repertoire',
            type: 'array',
            fields: [
                {name: 'composer', type: 'text', required: true},
                {name: 'workTitle', type: 'text', required: true},
                {name: 'soloist', type: 'text'},
                {name: 'movements', type: 'text'}
            ],
            // minimum of one array item
            required: true,
            admin: {
                description: 'The works performed, shown on the public site in this order.',
            },
        },
        {
            name: 'performances',
            type: 'array',
            fields: [
                {name: 'dateTime', type: 'date', required: true},
                {name: 'venue', type: 'text', admin: { description: 'Optional in the schema — the public site shows this line when it is set.' }},
                {name: 'venueAddress', type: 'text', required: true},
                {name: 'bookingUrl', type: 'text', required: true},
                {name: 'price', type: 'text', required: true}
            ],
            // minimum of one array item
            required: true,
            admin: {
                description: 'Each one appears as a separate date on the public site.',
            },
        },
        {
            name: 'photo_links',
            type: 'array',
            fields: [{name: 'link', type: 'text'}],
            admin: {
                description: 'Added once the concert has been performed.',
            },
        },
        {
            name: 'video_links',
            type: 'array',
            fields: [{name: 'link', type: 'text'}]
        },
        {
            name: 'publicSitePreview',
            type: 'ui',
            label: 'Public site preview',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/admin/components/PublicSitePreview#PublicSitePreview',
                },
            },
        },
    ]
}
