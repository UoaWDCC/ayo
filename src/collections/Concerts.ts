import type { CollectionConfig } from 'payload'
import { NZ_TIME_ZONE } from '@/lib/concertDates'
import { validateDocumentURL } from '@/lib/urls'

export const Concerts: CollectionConfig = {
  slug: 'concerts',
  admin: {
    group: 'Concerts',
    useAsTitle: 'title',
    description: 'Every concert series, with its repertoire and performance dates.',
    // 'title' must lead: Payload only wraps the first defaultColumns entry in a row link,
    // and an upload/thumbnail column (photo) can't carry that link.
    defaultColumns: ['title', 'photo', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'How the concert appears on the site.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
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
      label: 'Programme URL',
      type: 'text',
      validate: validateDocumentURL,
      admin: {
        description:
          'Optional. Paste the full programme link or an uploaded PDF path such as /api/media/file/programme.pdf. Leave blank to hide the link.',
      },
    },
    {
      name: 'repertoire',
      type: 'array',
      fields: [
        { name: 'composer', type: 'text', required: true },
        { name: 'workTitle', type: 'text', required: true },
        { name: 'soloist', type: 'text' },
        { name: 'movements', type: 'text' },
      ],
      // minimum of one array item
      required: true,
      admin: {
        description: 'The works performed, shown on the site in this order.',
      },
    },
    {
      name: 'performances',
      type: 'array',
      fields: [
        {
          name: 'dateTime',
          label: 'Performance date and time',
          type: 'date',
          required: true,
          timezone: {
            defaultTimezone: NZ_TIME_ZONE,
            supportedTimezones: [{ label: 'New Zealand (Pacific/Auckland)', value: NZ_TIME_ZONE }],
          },
          admin: {
            description:
              'Enter the start time in New Zealand time. Daylight saving is handled automatically.',
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'd MMM yyyy, h:mm aa',
              timeIntervals: 15,
            },
          },
        },
        {
          name: 'venue',
          type: 'text',
          admin: {
            description: 'Optional in the schema. The site shows this line when it is set.',
          },
        },
        { name: 'venueAddress', type: 'text', required: true },
        {
          name: 'bookingUrl',
          label: 'Booking URL',
          type: 'text',
          validate: validateDocumentURL,
          admin: {
            description: 'The booking link for this performance. Leave blank until bookings open.',
          },
        },
        { name: 'price', type: 'text', required: true },
      ],
      // minimum of one array item
      required: true,
      admin: {
        description: 'Each one appears as a separate date on the site.',
      },
    },
    {
      name: 'photo_links',
      label: 'Photo links',
      labels: { singular: 'Photo link', plural: 'Photo links' },
      type: 'array',
      fields: [
        { name: 'link', label: 'Photo gallery URL', type: 'text', validate: validateDocumentURL },
      ],
      admin: {
        description:
          'Optional. Paste a full gallery link in each row. Every valid link appears on the site.',
      },
    },
    {
      name: 'video_links',
      label: 'Recording links',
      labels: { singular: 'Recording link', plural: 'Recording links' },
      type: 'array',
      fields: [
        { name: 'link', label: 'Recording URL', type: 'text', validate: validateDocumentURL },
      ],
      admin: {
        description:
          'Optional. Paste a full recording link in each row. Every valid link appears on the site.',
      },
    },
    {
      name: 'publicSitePreview',
      type: 'ui',
      label: 'Site preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PublicSitePreview#PublicSitePreview',
        },
      },
    },
  ],
}
