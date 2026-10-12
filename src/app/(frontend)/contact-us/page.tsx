import React from 'react'
import {
  PiHandHeartLight,
  PiHandshakeLight,
  PiMusicNotesLight,
  PiScrollLight,
  PiUserPlusLight,
} from 'react-icons/pi'
import ContactFormSection from '../components/ContactFormSection'
import Hero from '../components/Hero'
import { RichText } from '../components/RichText'
import SquareLinkGrid from '../components/SquareLinkGrid'

import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import { getProcessingOfDataAgreement } from '@/lib/getProcessingOfDataAgreement'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'Contact Us | Auckland Youth Orchestra',
  description: 'Contact Auckland Youth Orchestra.',
}

// Rendered per request so agreement text edited in Payload shows up without a redeploy.
export const dynamic = 'force-dynamic'

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact-us')
  const agreement = await getProcessingOfDataAgreement()

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = heroBlock?.slogan || page?.title || ''

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroTitle}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <SquareLinkGrid
        title="Hey there! What can we help you with?"
        description="Answers to some of our frequently asked questions."
        items={[
          {
            id: 'get-involved',
            title: 'Get Involved\nwith AYO',
            icon: PiHandshakeLight,
            href: '/join-ayo',
          },
          {
            id: 'supporting',
            title: 'Supporting\nAYO',
            icon: PiHandHeartLight,
            href: '/support-us',
          },
          {
            id: 'join',
            title: 'Join\nAYO',
            icon: PiUserPlusLight,
            href: '/join-ayo',
          },
          {
            id: 'concerts-events',
            title: 'Concerts\n& Events',
            icon: PiMusicNotesLight,
            href: '/concerts-events',
          },
          {
            id: 'policies',
            title: 'Policies',
            icon: PiScrollLight,
            href: '/policies',
          },
        ]}
      />
      <ContactFormSection
        agreementContent={agreement?.content ? <RichText data={agreement.content} /> : undefined}
      />
    </main>
  )
}
