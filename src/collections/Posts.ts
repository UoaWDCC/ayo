import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',

  hooks: {
    beforeChange: [
      // before user presses save, this will run

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
    defaultColumns: ['title', 'slug', 'category', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: { readOnly: true }, //cant edit
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Photos',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          // not required for now, but we can make it required later if we want to
        },
      ],
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
      //required: true,
      admin: {
        date: {
          //theres a +1 day bug when selecting on calendar, caused by timezone offsets appaerntly
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd yyyy', // show year, month, day in the admin panel
        },
      },
    },
  ],
}
