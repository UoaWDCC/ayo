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
      label: 'Banner heading',
      type: 'text',
      required: false,
      admin: {
        description: 'The heading shown over the page banner. Leave blank to use the page title.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      admin: {
        description: 'A short line below the banner heading. Leave blank to hide it.',
      },
    },
    {
      name: 'backgroundImage',
      label: 'Banner image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
