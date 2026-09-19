import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faqs',

  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },

  admin: {
    useAsTitle: 'question',
    description: 'Frequently asked questions shown on their respective pages of the site.',
    defaultColumns: ['question', 'category', 'sortOrder'],
  },

  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Page',
      required: true,
      index: true,
      options: [
        { label: 'About Us', value: 'about-us' },
        { label: 'Concerts & Events', value: 'concerts-events' },
        { label: 'Join AYO', value: 'join-ayo' },
        { label: 'Support Us', value: 'support-us' },
      ],
      admin: {
        description: 'Which page this FAQ appears on.',
      },
    },
    {
      // Managed entirely by dragging rows in the "Site preview" panel below, not typed in —
      // hidden from the edit form but still a normal field: it's saved, queried, and sorted on
      // like any other (see the public site's FAQ queries and defaultColumns above).
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'faqPreview',
      type: 'ui',
      label: 'Site preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/FAQPreview#FAQPreview',
        },
      },
    },
  ],
}
