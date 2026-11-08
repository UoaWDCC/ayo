import type { CollectionConfig } from 'payload'
import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'
import { VideoBlock } from '@/blocks/VideoBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { TableBlock } from '@/blocks/TableBlock'
import { FAQBlock } from '@/blocks/FAQBlock'
import { MemberSection } from '@/blocks/MemberSection'
import { JoinStage } from '@/blocks/JoinStage'
import { pageSlugs, protectPageSlug } from '@/hooks/protectPageSlug'

const layoutBlocks = [
  Hero,
  RichText,
  VideoBlock,
  QuoteBlock,
  ImageBlock,
  TableBlock,
  FAQBlock,
  MemberSection,
  JoinStage,
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { maxPerDoc: 20 },
  // These documents belong to fixed Next.js routes. New routes require code changes.
  access: {
    create: () => false,
    delete: () => false,
    readVersions: ({ req }) => Boolean(req.user),
  },
  hooks: { beforeValidate: [protectPageSlug] },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    description: 'Headings, images and content for the website pages.',
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
      blocks: layoutBlocks,
      // The scroll story is built for one page; keep it out of every other page's block menu.
      filterOptions: ({ data }) =>
        data?.slug === 'join-ayo'
          ? true
          : layoutBlocks.filter((block) => block !== JoinStage).map((block) => block.slug),
    },
    {
      name: 'pagePreview',
      type: 'ui',
      label: 'Block guide',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/PagesPreview#PagesPreview',
        },
      },
    },
  ],
}
