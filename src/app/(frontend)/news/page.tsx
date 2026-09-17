// This the server component, fetches real posts from Payload and hands them to the client component that does filtering/search/pagination.
import { getPosts, categoryLabel, formatPublishedDate, richTextToPlainText } from '@/lib/posts'
import { getPhotoUrl } from '@/lib/posts'
import NewsListClient from './NewsListClient'

export default async function NewsPage() {
  const posts = await getPosts()

  const articles = posts.map((post) => ({
    id: post.id,
    slug: post.slug ?? '',
    type: categoryLabel(post.category),
    title: post.title,
    publishLabel: formatPublishedDate(post.publishedDate),
    publishDate: post.publishedDate ?? '',
    description: richTextToPlainText(post.description),
    author: post.author ?? '',
    image: getPhotoUrl(post.photos?.[0]?.photo),
  }))

  return <NewsListClient articles={articles} />
}
