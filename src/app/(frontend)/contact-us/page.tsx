import React from 'react'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'Contact Us | Auckland Youth Orchestra',
  description: 'Contact Auckland Youth Orchestra.',
}

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = heroBlock?.title || 'Contact Us'

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title={heroTitle} backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
    </main>
  )
}
