import React from 'react'
import Hero from '../components/Hero'
import UpcomingEvents from '../components/UpcomingEvents'
import FAQSection from '../components/FAQSection'
import OpportunityModal from '../components/OpportunityModal'
import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function ConcertsEventsPage() {
  const page = await getPageBySlug('concerts-events')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main>
      <Hero title="Concerts & Events" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <UpcomingEvents />
      <FAQSection />
    </main>
  )
}
