import type { CollectionConfig } from 'payload'
import { stablePostSlug } from '@/hooks/stablePostSlug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { maxPerDoc: 20 },

  access: { readVersions: ({ req }) => Boolean(req.user) },

  hooks: {
    beforeValidate: [stablePostSlug],
  },

  admin: {
    group: 'Content',
    useAsTitle: 'title',
    description:
      'News and stories shown on the website. Save updates the live site. Use Versions to restore an earlier edit.',
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
        description:
          'Generated when the story is created. Stays the same when you edit the title so shared links keep working.',
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
