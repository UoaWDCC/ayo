import type { Block } from 'payload'

/**
 * Hero block:
 *
 * Used at the top of a page for a large banner-style section.
 * - backgroundImage: image from the Media collection
 *
 * Note: ticket calls for image/video + CTA button support; current
 * version covers image only, no button. Deferred for future iteration.
 */

export const Hero: Block = {
  slug: 'hero',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
