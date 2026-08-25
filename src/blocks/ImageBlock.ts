import type { Block } from 'payload'

/**
 * Image block:
 *
 * Used to display an image with optional caption.
 * - image: The image to display
 *
 */

export const ImageBlock: Block = {
  slug: 'image',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
