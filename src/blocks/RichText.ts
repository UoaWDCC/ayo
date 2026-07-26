import type { Block } from 'payload'

/**
 * Rich Text block:
 *
 * Freeform text section for page content.
 * - title: optional heading above the text content
 * - content: Lexical rich text field (stores structured JSON, rendered
 *   on the frontend via @payloadcms/richtext-lexical/react)
 */

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
