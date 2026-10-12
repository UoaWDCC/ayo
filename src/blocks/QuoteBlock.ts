import type { Block } from 'payload'

/**
 * Quote block:
 *
 * Used to display a quote with optional attribution.
 * - image: The image associated with the quote
 * - text: The text of the quote
 * - caption: Optional small label (e.g. event name/date) shown above the quote
 * - videoUrl: Optional YouTube URL the block links out to when clicked
 *
 */

export const QuoteBlock: Block = {
  slug: 'quote',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: false,
      admin: {
        description:
          'YouTube URL opened when the block is clicked. Leave blank to render the block without a link.',
      },
    },
  ],
}
