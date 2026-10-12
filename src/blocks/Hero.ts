import type { Block } from 'payload'

/**
 * Hero block:
 *
 * Used at the top of a page for a large banner-style section.
 * - slogan: large heading shown over the image; falls back to the page's
 *   own title when left blank
 * - subtitle: short line under the heading; the section renders without one
 *   when left blank
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
          'The large heading shown over the hero image (e.g. "Here Plays The Future"). Leave blank to use the page\'s title.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      admin: {
        description:
          'The short line under the heading (e.g. "Aotearoa\'s first and original youth orchestra, founded 1948."). Leave blank to show no subtitle.',
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
