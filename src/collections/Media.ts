import type { CollectionConfig } from 'payload'
import { protectUsedMedia } from '@/hooks/protectUsedMedia'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: { beforeDelete: [protectUsedMedia] },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets & Resources',
    useAsTitle: 'filename',
    description: 'Images and documents uploaded to the website.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for someone who cannot see it. For a document, give a short description of its contents.',
      },
    },
  ],
  upload: {
    /**
     * Resized variants are generated once, at upload time. Without them the
     * full-resolution original is the only file that exists, so every request
     * — the admin list, a card thumbnail, the Next image optimizer fetching a
     * source to resize — pulls several megabytes.
     *
     * `withoutEnlargement` keeps a small upload at its own size rather than
     * upscaling it, so a 900px photo simply has no `tablet` or `desktop`.
     */
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, withoutEnlargement: true },
      { name: 'tablet', width: 1280, withoutEnlargement: true },
      { name: 'desktop', width: 2048, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
