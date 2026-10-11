import type { Block } from 'payload'

/**
 * Hero block:
 *
 * Used at the top of a page for a large banner-style section.
 * - slogan: large heading shown over the image; falls back to the page's
 *   built-in heading when left blank
 * - backgroundImage: image from the Media collection
 *
 * Note: ticket calls for image/video + CTA button support; current
 * version covers image only, no button. Deferred for future iteration.
 */

export const Hero: Block = {
  slug: 'hero',
  fields: [
    {
      name: 'slogan',
      type: 'text',
      required: false,
      admin: {
        description:
          "The large heading shown over the hero image (e.g. \"Here Plays The Future\"). Leave blank to use the page's default heading.",
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
