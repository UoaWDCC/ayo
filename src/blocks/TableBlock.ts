import type { Block } from 'payload'

/**
 * Table block:
 *
 * Used to display a table with rows and cells.
 * - rows: The data for the table
 *   - label: The label/heading for the row
 *   - content: Rich text content for the row
 *   - linkLabel: Optional label for an associated link
 *   - linkUrl: Optional URL for an associated link
 *
 */

export const TableBlock: Block = {
  slug: 'table',
  fields: [
    {
      name: 'rows',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'linkLabel',
          type: 'text',
          required: false,
        },
        {
          name: 'linkUrl',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}
