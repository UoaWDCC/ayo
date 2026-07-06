import type { Block } from 'payload'

/**
 * Gallery block:
 *
 * Displays a set of images in a page layout.
 * - title: optional section heading
 * - images: repeatable array of image + caption pairs
 *   - image: upload from Media collection
 *   - caption: optional text shown alongside/under the image
 */

export const Gallery: Block = {
  slug: 'gallery',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
