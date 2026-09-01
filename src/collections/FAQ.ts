import type { CollectionConfig } from 'payload'

/**
 * FAQ collection:
 *
 * - question: the FAQ question text
 * - answer: the FAQ answer text
 * - category: which page this FAQ appears on (About Us, Concerts & Events, Join AYO, Support Us)
 * - sortOrder: controls display order within a category, ascending, lower first
 */

export const FAQ: CollectionConfig = {
  slug: 'faqs',

  admin: {
    useAsTitle: 'question',
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
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first within the page.',
      },
    },
  ],
}
