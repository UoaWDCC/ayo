import type { Block } from 'payload'

/**
 * FAQ block:
 *
 * Used to display a frequently asked question with an answer.
 * - question: The question text
 * - answer: The answer text

*/

export const FAQBlock: Block = {
  slug: 'faq',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}
