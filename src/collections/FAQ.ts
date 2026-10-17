import type { CollectionConfig } from 'payload'
import { reorderEndpoints } from '@/endpoints/reorder'

export const FAQ: CollectionConfig = {
  slug: 'faqs',
  endpoints: reorderEndpoints('faqs'),
  defaultSort: ['category', 'sortOrder', 'id'],

  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },

  admin: {
    group: 'Content',
    useAsTitle: 'question',
    components: { beforeListTable: ['@/admin/components/CollectionReorder#CollectionReorder'] },
    description: 'Questions and answers shown on the selected website page.',
    defaultColumns: ['question', 'category', 'updatedAt'],
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
        { label: 'News', value: 'news' },
        { label: 'Support Us', value: 'support-us' },
      ],
      admin: {
        description: 'Choose the website page where this question and answer appear.',
      },
    },
    {
      // Managed by the collection's Reorder controls, separately from editing an answer.
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
