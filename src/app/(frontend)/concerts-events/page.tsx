import React from 'react'
import Hero from '../components/Hero'
import Link from 'next/link'
import PhotoSpotlight from '../components/PhotoSpotlight'
import UpcomingEvents from '../components/UpcomingEvents'
import FAQSection from '../components/FAQSection'
import OpportunityModal from '../components/OpportunityModal'
import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ConcertsEventsPage() {
  const page = await getPageBySlug('concerts-events')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title="Concerts and Events" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <div className="mx-auto w-[80%] mt-15 mb-15">
        <p className="text-[40px]">
          Every single AYO concert is the ultimate payoff of months of rehearsal and practice by our
          players who passionately tackle serious repertoire head-on. Expect full symphonic
          programmes, mesmerizing soloists from within our own ranks and beyond, and that pure,
          absolute magic that sparks when incredible talent is given the space to excel.
          <br /> <br />
          Truly, there is nothing else like it. <br /> <br />
          Sign up to our newsletter for early notice of concert dates and priority booking.
          <br /> <br />
        </p>

        <Link href="/concerts-events" className="font-bold text-[40px]">
          <span className="underline">Sign up to our newsletter</span>&ensp;↗
        </Link>
      </div>
      <PhotoSpotlight
        textSmall="Europe Tour - Friday, 23rd of October, 2025 to Friday 23rd of October, 2026"
        headingSmall="On Now:"
        headingLarge="Europe Tour"
        hoverImgSrc="/hero-placeholder.jpg"
        staticImgSrc="/about-us-quote-poster.jpg"
      />
      
      <UpcomingEvents />
    </main>
  )
}
