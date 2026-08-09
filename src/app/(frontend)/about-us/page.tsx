import React from 'react'
import AboutIntro from '../components/AboutIntro'
import Grid from '../components/Grid'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function AboutUsPage() {
  const page = await getPageBySlug('about-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <div>
      <Hero title="About Us" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <main className="min-h-screen bg-white text-black">
        <AboutIntro />
        <Grid title="People" placeholderSubtitle="Name" />
        <Grid title="Alumni" placeholderSubtitle="Role" />
        <Grid title="Partners" placeholderSubtitle="Company" />
      </main>
    </div>
  )
}
