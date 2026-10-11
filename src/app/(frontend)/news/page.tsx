// Server component: pulls the page's hero/lead copy from Payload and the posts themselves,
// then hands the article list to the client component that filters, searches and paginates.
import { RichText } from '@payloadcms/richtext-lexical/react'
import FAQSection from '../components/FAQSection'
import Hero from '../components/Hero'
import NewsletterSignup from '../components/NewsletterSignup'
import StaggerReveal from '../components/StaggerReveal'
import { createIntroConverters } from '../components/richTextConverters'
import NewsListClient from './NewsListClient'
import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import {
  getPosts,
  categoryLabel,
  formatPublishedDate,
  richTextToPlainText,
  getPhotoUrl,
} from '@/lib/posts'

const introConverters = createIntroConverters('news-intro-fade')

export default async function NewsPage() {
  const page = await getPageBySlug('news')
  const posts = await getPosts()

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  // Read positionally: [0] is the lead copy that sits between the hero and the article list.
  const introText = richTextBlocks[0]?.content

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

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || 'News'}
        subtitle="Catch up to the latest updates about us."
        backgroundImage={heroImage}
      />

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
          <div className="max-w-[1380px]">
            {introText && (
              <StaggerReveal fadeClass="news-intro-fade">
                <RichText data={introText} converters={introConverters} />
              </StaggerReveal>
            )}
          </div>
        </div>
      </section>

      <NewsListClient articles={articles} />

      <NewsletterSignup />

      <FAQSection category="news" />
    </main>
  )
}
