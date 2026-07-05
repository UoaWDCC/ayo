import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'rich-text',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
