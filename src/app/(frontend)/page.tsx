import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'
import AboutUsQuoteStatic from './components/AboutUsQuoteStatic'
import SocialMediaBlock from './components/SocialMediaBlock'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

const introConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <p className="mt-6 md:mt-[37px] font-sans font-light text-2xl sm:text-3xl md:text-[50px] leading-[1.22] text-text">
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
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-24">
        <p className="font-sans font-semibold text-xl sm:text-2xl md:text-[30px] leading-[1.2] text-text">
          AN INTRODUCTION
        </p>
        {introContent && <RichText data={introContent} converters={introConverters} />}
      </div>

      <div className="w-full mt-10">
        <AboutUsQuoteStatic
          quote={quoteBlock?.text}
          image={quoteImageUrl}
          caption={quoteBlock?.caption}
        />
      </div>

      <EventsBlock />
      <BlogsBlock />
      <SocialMediaBlock />
    </main>
  )
}
