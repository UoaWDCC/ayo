import React from 'react'
import AboutUsSection from '../components/AboutUsSection'
import Grid from '../components/Grid'
import Hero from '../components/Hero'
import OurTeam from '../components/OurTeam'
import NewsletterSignupDemo from '../components/Newsletter'

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
        <AboutUsSection />
        <Grid title="People" placeholderSubtitle="Name" />
        <Grid title="Alumni" placeholderSubtitle="Role" />
        <Grid title="Partners" placeholderSubtitle="Company" />
        <OurTeam></OurTeam>
        <NewsletterSignupDemo></NewsletterSignupDemo>
      </main>
    </div>
  )
}
