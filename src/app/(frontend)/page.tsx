import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Button from './components/Button'
import Hero from './components/Hero'
import EventCard from './components/EventCard'
import NewsCard from './components/NewsCard'
import AboutUsQuoteVid from './components/AboutUsQuoteVid'
import ScrollReveal from './components/ScrollReveal'
import SocialMediaBlock from './components/SocialMediaBlock'
import StaggerReveal from './components/StaggerReveal'
import { createIntroConverters } from './components/richTextConverters'

import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import { getConcertEvents } from '@/lib/concertEvents'
import {
  getPosts,
  categoryLabel,
  formatPublishedDate,
  richTextToPlainText,
  getPhotoUrl,
} from '@/lib/posts'
import type { Media } from '@/payload-types'

// How many upcoming events / latest articles the home page previews before linking out.
const PREVIEW_COUNT = 3

const introConverters = createIntroConverters('home-intro-fade')

export default async function LandingPage() {
  const page = await getPageBySlug('home')
  const { upcoming } = await getConcertEvents()
  const posts = await getPosts(PREVIEW_COUNT)

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  // Read positionally: [0] is the introduction under the hero.
  const introContent = richTextBlocks[0]?.content

  const quoteBlock = page?.layout?.find((block) => block.blockType === 'quote')

  const quoteImage = quoteBlock?.image

  const quoteImageUrl =
    typeof quoteImage === 'object' && quoteImage !== null ? (quoteImage as Media).url : undefined

  const upcomingPreview = [...upcoming]
    .sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime())
    .slice(0, PREVIEW_COUNT)

  // getPosts already sorts newest first.
  const latestPosts = posts.slice(0, PREVIEW_COUNT)

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
          <div className="max-w-[1380px]">
            {introContent && (
              <StaggerReveal fadeClass="home-intro-fade">
                <RichText data={introContent} converters={introConverters} />
              </StaggerReveal>
            )}
          </div>
        </div>
      </section>

      {/* Quote, poster and video link all come from the page's quote block, so
          the section is only rendered once that block exists in Payload. */}
      {quoteBlock && (
        <ScrollReveal className="w-full my-12.5">
          <AboutUsQuoteVid
            quote={quoteBlock.text}
            posterImage={quoteImageUrl ?? undefined}
            caption={quoteBlock.caption ?? undefined}
            youtubeUrl={quoteBlock.videoUrl ?? undefined}
            aspectClassName="aspect-[4/3] sm:aspect-[2/1] md:aspect-[16/6]"
          />
        </ScrollReveal>
      )}

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <StaggerReveal fadeClass="home-events-fade">
            <h2 className="home-events-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
              Upcoming Events
            </h2>
            <p className="home-events-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
              A season of performances showcasing bold works and the energy of young musicians
              growing through music.
            </p>

            <hr className="border-[#EBEBEB] mt-6" />

            {upcomingPreview.length > 0 ? (
              <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {upcomingPreview.map((event) => (
                  <div key={event.id} className="home-events-fade">
                    <EventCard
                      event={{
                        ...event,
                        footerLabel: `${event.type.toUpperCase()} · ${event.location.toUpperCase()}`,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="home-events-fade mt-8 text-[18px] leading-[22px] text-[#B2B2B2] italic">
                New events are added throughout the season — check back soon.
              </p>
            )}

            <Button href="/concerts-events" className="home-events-fade mt-12">
              See all Concerts &amp; Events
            </Button>
          </StaggerReveal>
        </div>
      </section>

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <StaggerReveal fadeClass="home-news-fade">
            <h2 className="home-news-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
              Latest News
            </h2>
            <p className="home-news-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
              Newsletters, interviews and behind-the-scenes stories from across the orchestra.
            </p>

            <hr className="border-[#EBEBEB] mt-6" />

            {latestPosts.length > 0 && (
              <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {latestPosts.map((post) => (
                  <div key={post.id} className="home-news-fade">
                    <NewsCard
                      title={post.title}
                      date={formatPublishedDate(post.publishedDate)}
                      description={richTextToPlainText(post.description)}
                      type={categoryLabel(post.category)}
                      author={post.author ?? ''}
                      slug={post.slug ?? ''}
                      image={getPhotoUrl(post.photos?.[0]?.photo)}
                    />
                  </div>
                ))}
              </div>
            )}

            <Button href="/news" className="home-news-fade mt-12">
              See all News
            </Button>
          </StaggerReveal>
        </div>
      </section>

      <SocialMediaBlock />
    </main>
  )
}
