// app/(frontend)/news/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  getPostBySlug,
  getRelatedPosts,
  categoryLabel,
  formatPublishedDate,
  getPhotoUrl,
} from '@/lib/posts'

export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/posts')
  const posts = await getPosts()
  return posts.filter((post) => post.slug).map((post) => ({ slug: post.slug as string }))
}

export default async function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = post.slug ? await getRelatedPosts(post.slug, 3) : []

  const heroPhoto = post.photos?.[0]?.photo
  const heroImageUrl = getPhotoUrl(heroPhoto)
  const remainingPhotos = post.photos?.slice(1) ?? []

  return (
    <article>
      {/* Hero */}
      <div className="relative h-105 w-full bg-black">
        {heroImageUrl && (
          <Image src={heroImageUrl} alt={post.title} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
          <div className="max-w-175 mx-auto w-full text-white">
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {categoryLabel(post.category)}
              </span>
            )}
            <h1 className="mt-3 text-6xl font-bold leading-tight">{post.title}</h1>
            <p className="mt-6 text-lg">
              {formatPublishedDate(post.publishedDate)}
              {post.author ? ` · By ${post.author}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-175 mx-auto px-6 py-14">
        <Link
          href="/news"
          className="inline-block mb-10 underline underline-offset-4 hover:text-muted transition-colors"
        >
          ← Back to Listing Page
        </Link>

        {/* Body — Payload's Lexical richText field. Headings, paragraphs
            and blockquotes (pull quotes) render via Payload's default
            converters as long as those features are enabled on the root
            lexicalEditor config — worth a quick check if a block type
            doesn't show up the way you expect. */}
        <div className="prose max-w-none text-base leading-relaxed">
          {post.description && <RichText data={post.description} />}
        </div>

        {/* Any photos beyond the hero image */}
        {remainingPhotos.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3">
            {remainingPhotos.map((entry, i) => {
              const src = getPhotoUrl(entry.photo)
              if (!src) return null
              const alt =
                typeof entry.photo === 'object' && entry.photo !== null ? entry.photo.alt : ''
              return (
                <div key={entry.id ?? i} className="relative aspect-4/3 w-full">
                  <Image src={src} alt={alt ?? ''} fill className="object-cover" />
                </div>
              )
            })}
          </div>
        )}

        {/* Related posts — pulled from the same Payload collection,
            excluding this post */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 border-t border-[#EBEBEB] pt-10">
            <h2 className="text-2xl font-semibold mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedPosts.map((related) => {
                const relatedSrc = getPhotoUrl(related.photos?.[0]?.photo)
                return (
                  <Link key={related.id} href={`/news/${related.slug}`} className="group">
                    <div className="relative aspect-4/3 w-full mb-3 overflow-hidden bg-[#EBEBEB]">
                      {relatedSrc && (
                        <Image
                          src={relatedSrc}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold group-hover:text-muted transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm mt-1">{formatPublishedDate(related.publishedDate)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
