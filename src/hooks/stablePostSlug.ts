import { ValidationError, type CollectionBeforeValidateHook } from 'payload'
import type { Post } from '@/payload-types'

export const stablePostSlug: CollectionBeforeValidateHook<Post> = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data
  if (originalDoc?.slug) {
    if (data.slug !== undefined && data.slug !== originalDoc.slug) {
      throw new ValidationError({
        collection: 'posts',
        req,
        errors: [
          {
            path: 'slug',
            message: 'The story URL is fixed after creation so existing links keep working.',
          },
        ],
      })
    }
    return { ...data, slug: originalDoc.slug }
  }

  const title = data.title ?? originalDoc?.title
  if (!title) return data
  const base =
    title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'story'
  let slug = base
  let suffix = 2
  // Check all stories, including those hidden from editors, to reserve a unique URL.
  while (
    (
      await req.payload.find({
        collection: 'posts',
        where: { slug: { equals: slug } },
        depth: 0,
        limit: 1,
        select: { slug: true },
        overrideAccess: true,
        req,
      })
    ).docs.length > 0
  ) {
    slug = `${base}-${suffix++}`
  }
  return { ...data, slug }
}
