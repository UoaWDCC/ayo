import React from 'react'
import FAQSection from '../components/FAQSection'
import OpportunitySection from '../components/OpportunitySection'
import OpportunityModal from '../components/OpportunityModal'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function JoinAyoPage() {
  const page = await getPageBySlug('join-ayo')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main>
      <Hero title="Join AYO" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <OpportunitySection />
      <FAQSection />
    </main>
  )
}
