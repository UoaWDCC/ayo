import type { Block } from 'payload'

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
