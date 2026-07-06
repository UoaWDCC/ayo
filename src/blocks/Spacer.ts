import type { Block } from 'payload'

/**
 * Spacer block:
 *
 * Adds vertical whitespace between other blocks in a layout.
 * - height: preset spacing size (small/medium/large) rather than a
 *   free-form value, to keep spacing consistent across pages
 */

export const Spacer: Block = {
  slug: 'spacer',
  fields: [
    {
      name: 'height',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
  ],
}
