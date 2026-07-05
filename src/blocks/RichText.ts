import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'rich-text',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
