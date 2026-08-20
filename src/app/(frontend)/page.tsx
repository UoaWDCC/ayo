import React from 'react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'
import AboutUsQuoteVid from './components/AboutUsQuoteVid'
import SocialMediaBlock from './components/SocialMediaBlock'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function LandingPage() {
  const page = await getPageBySlug('home')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title="Here Plays The Future"
        backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'}
      />
      {/* <AboutIntro /> */}

      {/* Temporary placeholder for introduction */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-24">
        <p className="font-sans font-semibold text-xl sm:text-2xl md:text-[30px] leading-[1.2] text-text">
          AN INTRODUCTION
        </p>
        <p className="mt-6 md:mt-[37px] font-sans font-light text-2xl sm:text-3xl md:text-[50px] leading-[1.22] text-text">
          Aotearoa's first and original youth orchestra, founded 1948.
        </p>
        <p className="mt-6 md:mt-[37px] font-sans font-light text-2xl sm:text-3xl md:text-[50px] leading-[1.22] text-text">
          Real repertoire. Real stages. Real standards.
        </p>
      </div>

      <div className="w-full mt-10">
        <AboutUsQuoteVid
          quote="Watching Auckland Youth Orchestra perform, it was hard to believe this was youth talent. The passion, precision, and professionalism on stage were genuinely extraordinary."
          posterImage="/about-us-quote-poster.jpg"
          // videoSrc="/about-us-quote-preview.mp4"   //
          youtubeUrl="https://youtu.be/8HixIOtXEN4?si=N13_yW1Zjo5zVaH-" // changeable
        />
      </div>

      <EventsBlock />
      <BlogsBlock />
      <SocialMediaBlock />
    </main>
  )
}
