import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'
import { VideoBlock } from '@/blocks/VideoBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { TableBlock } from '@/blocks/TableBlock'
import { FAQBlock } from '@/blocks/FAQBlock'
import { MemberSection } from '@/blocks/MemberSection'
import { pageSlugs, protectPageSlug } from '@/hooks/protectPageSlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  // These documents belong to fixed Next.js routes. New routes require code changes.
  access: { create: () => false, delete: () => false },
  hooks: { beforeValidate: [protectPageSlug] },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    description:
      'Edit the content of the existing website pages. Page URLs are fixed; adding or removing a website page requires a developer.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      unique: true,
      validate: (value: string | null | undefined) =>
        pageSlugs.some((slug) => slug === value) || 'Choose an existing website page URL.',
      admin: {
        readOnly: true,
        description: 'Fixed website route. Changing the title does not change this URL.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Hero,
        RichText,
        VideoBlock,
        QuoteBlock,
        ImageBlock,
        TableBlock,
        FAQBlock,
        MemberSection,
      ],
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
