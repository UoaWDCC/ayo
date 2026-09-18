import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'photos', 'category', 'publishedDate'],
  },
  fields: [
    // Story — writing comes first, before any metadata.
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },

    {
      name: 'photosSection',
      type: 'ui',
      label: 'Photos',
      admin: {
        custom: { note: 'The first photo is used as the card image on the News page.' },
        components: {
          Field: '@/admin/components/SectionDivider#SectionDivider',
        },
      },
    },
    {
      name: 'photos',
      type: 'array',
      // The SectionDivider row above already introduces "Photos" as the section heading —
      // Payload would otherwise render a second, redundant "Photos" label directly beneath it.
      label: false,
      admin: {
        components: {
          Cell: '@/admin/components/PhotoThumbnailCell#PhotoThumbnailCell',
        },
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      name: 'metadataSection',
      type: 'ui',
      label: 'Metadata',
      admin: {
        custom: { note: 'Category, author, date and the generated slug.' },
        components: {
          Field: '@/admin/components/SectionDivider#SectionDivider',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'Alumni Story', value: 'alumni_story' },
        { label: 'Interview', value: 'interview' },
        { label: 'Scholarships', value: 'scholarships' },
        { label: 'Newsletters', value: 'newsletters' },
        { label: 'Education', value: 'education' },
        { label: 'Audience', value: 'audience' },
      ],
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author',
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        // dayOnly avoids a timezone-offset bug where picking a date could save as the day before.
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd yyyy',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: {
        readOnly: true,
        description: 'Generated from the title.',
      },
    },

    {
      name: 'postsPreview',
      type: 'ui',
      label: 'Preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PostsPreview#PostsPreview',
        },
      },
    },
  ],
}
