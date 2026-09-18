import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'
import { VideoBlock } from '@/blocks/VideoBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { TableBlock } from '@/blocks/TableBlock'
import { FAQBlock } from '@/blocks/FAQBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    description: 'The static, page-builder pages of the public site.',
    defaultColumns: ['title', 'slug', 'layout', 'updatedAt'],
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
      blocks: [Hero, RichText, VideoBlock, QuoteBlock, ImageBlock, TableBlock, FAQBlock],
    },
    {
      name: 'pagePreview',
      type: 'ui',
      label: 'Preview',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PagesPreview#PagesPreview',
        },
      },
    },
  ],
}
