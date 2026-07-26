import type { CollectionConfig } from 'payload'

export const Passwords: CollectionConfig = {
  slug: 'passwords',
  fields: [
    {
      name: 'password',
      type: 'text',
    },
  ],
}
