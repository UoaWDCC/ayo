import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    description: 'The images used across the site.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describes the image for screen readers and search engines.',
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
