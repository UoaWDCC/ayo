import React from 'react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'
import AboutUsQuoteVid from './components/AboutUsQuoteVid'

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
    </main>
  )
}
