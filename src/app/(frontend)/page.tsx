import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'
import AboutUsQuoteVid from './components/AboutUsQuoteVid'
import ScrollReveal from './components/ScrollReveal'
import SocialMediaBlock from './components/SocialMediaBlock'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

// Same quote and poster as the About Us page, used until the Payload quote block is filled in.
const DEFAULT_QUOTE =
  'Watching Auckland Youth Orchestra perform, it was hard to believe this was youth talent. The passion, precision, and professionalism on stage were genuinely extraordinary.'
const DEFAULT_QUOTE_POSTER = '/about-us-quote-poster.jpg'

const introConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <p className="mt-6 md:mt-[37px] font-sans font-light text-2xl sm:text-3xl md:text-[40px] lg:text-[50px] leading-[1.22] text-text">
        {children}
      </p>
    )
  },
})

export default async function LandingPage() {
  const page = await getPageBySlug('home')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const richTextBlock = page?.layout?.find((block) => block.blockType === 'rich-text')

  const introContent = richTextBlock?.content

  const quoteBlock = page?.layout?.find((block) => block.blockType === 'quote')

  const quoteImage = quoteBlock?.image

  const quoteImageUrl =
    typeof quoteImage === 'object' && quoteImage !== null ? (quoteImage as Media).url : undefined

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title="Here Plays The Future"
        subtitle="Aotearoa's first and original youth orchestra, founded 1948."
        backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'}
      />
      {/* <AboutIntro /> */}

      {/* Temporary placeholder for introduction */}
      <ScrollReveal>
        <div className="w-full max-w-[1380px] px-8 md:px-20 lg:px-24 xl:px-32 py-12 md:py-24">
          <p className="font-sans font-semibold text-xl sm:text-2xl md:text-[30px] leading-[1.2] text-text">
            AN INTRODUCTION
          </p>
          {introContent && <RichText data={introContent} converters={introConverters} />}
        </div>
      </ScrollReveal>

      <ScrollReveal className="w-full mt-10">
        <AboutUsQuoteVid
          quote={quoteBlock?.text ?? DEFAULT_QUOTE}
          posterImage={quoteImageUrl ?? DEFAULT_QUOTE_POSTER}
          caption={quoteBlock?.caption ?? undefined}
          // TODO: same link as About Us. Move to Payload once the quote block has a URL field.
          youtubeUrl="https://youtu.be/8HixIOtXEN4?si=N13_yW1Zjo5zVaH-"
          aspectClassName="aspect-[4/3] sm:aspect-[2/1] md:aspect-[16/6]"
        />
      </ScrollReveal>

      <ScrollReveal>
        <EventsBlock />
      </ScrollReveal>
      <ScrollReveal>
        <BlogsBlock />
      </ScrollReveal>
      <ScrollReveal>
        <SocialMediaBlock />
      </ScrollReveal>
    </main>
  )
}
