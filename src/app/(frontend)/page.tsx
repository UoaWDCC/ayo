import React from 'react'
import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import EventsBlock from './components/events/EventsBlock'
import BlogsBlock from './components/blogs/BlogsBlock'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function LandingPage() {
  const page = await getPageBySlug('home')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = heroBlock?.title || 'Here Plays The Future'

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title={heroTitle} backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <AboutIntro />
      <EventsBlock />
      <BlogsBlock />
    </main>
  )
}
