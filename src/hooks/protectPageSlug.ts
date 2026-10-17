import { ValidationError, type CollectionBeforeValidateHook } from 'payload'
import type { Page } from '@/payload-types'

export const pageSlugs = [
  'home',
  'about-us',
  'concerts-events',
  'join-ayo',
  'support-us',
  'contact-us',
  'news',
  'my-ayo',
  'policies',
] as const

export const protectPageSlug: CollectionBeforeValidateHook<Page> = ({ data, originalDoc, req }) => {
  if (!data) return data
  if (originalDoc && data.slug !== undefined && data.slug !== originalDoc.slug) {
    throw new ValidationError({
      collection: 'pages',
      req,
      errors: [
        {
          path: 'slug',
          message: 'This page URL is fixed. Edit the page content without changing its URL.',
        },
      ],
    })
  }
  return data
}
