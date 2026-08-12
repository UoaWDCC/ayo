import type { Block } from 'payload'

/**
 * Call to Action (CTA) block:
 *
 * Standalone prompt section with a heading, optional description,
 * and a single button.
 * - title: heading text
 * - description: optional rich text supporting content
 * - buttonText / buttonLink: label and destination for the CTA button
 */

export const CTA: Block = {
  slug: 'cta',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
    },
  ],
}
