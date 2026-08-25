import React from 'react'
import ContactFormSection from '../components/ContactFormSection'
import Hero from '../components/Hero'
import SquareLinkGrid from '../components/SquareLinkGrid'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'Contact Us | Auckland Youth Orchestra',
  description: 'Contact Auckland Youth Orchestra.',
}

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = 'Contact Us'

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title={heroTitle} backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <SquareLinkGrid
        title="Hey there! What can we help you with?"
        description="Answers to some of our frequently asked questions."
        items={[
          {
            id: 'get-involved',
            title: 'Get Involved\nwith AYO',
            href: '/join-ayo',
          },
          {
            id: 'supporting',
            title: 'Supporting\nAYO',
            href: '/support-us',
          },
          {
            id: 'join',
            title: 'Join\nAYO',
            href: '/join-ayo',
          },
          {
            id: 'concerts-events',
            title: 'Concerts\n& Events',
            href: '/concerts-events',
          },
        ]}
      />
      <ContactFormSection />
    </main>
  )
}
