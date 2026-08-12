import type { Block } from 'payload'

/**
 * Rich Text block:
 *
 * Freeform text section for page content.
 * - content: Lexical rich text field (stores structured JSON, rendered
 *   on the frontend via @payloadcms/richtext-lexical/react)
 */

export const RichText: Block = {
  slug: 'rich-text',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
