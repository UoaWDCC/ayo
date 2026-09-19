//server component
import { notFound } from 'next/navigation'
import {
  getPostBySlug,
  getRelatedPosts,
  categoryLabel,
  formatPublishedDate,
  getPhotoUrl,
} from '@/lib/posts'
import NewsArticleContent from './NewsArticleContent'

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

  const relatedPostsRaw = post.slug ? await getRelatedPosts(post.slug, 3) : []

  const heroPhoto = post.photos?.[0]?.photo
  const heroImageUrl = getPhotoUrl(heroPhoto)

  const remainingPhotos = (post.photos?.slice(1) ?? [])
    .map((entry, i) => {
      const src = getPhotoUrl(entry.photo)
      const alt = typeof entry.photo === 'object' && entry.photo !== null ? entry.photo.alt : ''
      return src ? { id: entry.id ?? String(i), src, alt: alt ?? '' } : null
    })
    .filter((p): p is { id: string; src: string; alt: string } => p !== null)

  const relatedPosts = relatedPostsRaw.map((related) => ({
    id: related.id,
    slug: related.slug ?? '',
    title: related.title,
    date: formatPublishedDate(related.publishedDate),
    image: getPhotoUrl(related.photos?.[0]?.photo),
  }))

  return (
    <NewsArticleContent
      title={post.title}
      author={post.author ?? ''}
      date={formatPublishedDate(post.publishedDate)}
      category={post.category ? categoryLabel(post.category) : null}
      heroImageUrl={heroImageUrl}
      description={post.description}
      remainingPhotos={remainingPhotos}
      relatedPosts={relatedPosts}
    />
  )
}
