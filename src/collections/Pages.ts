import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'
import { Spacer } from '@/blocks/Spacer'
import { CTA } from '@/blocks/CTA'
import { Gallery } from '@/blocks/Gallery'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, RichText, Gallery, Spacer, CTA],
    },
  ],
}
