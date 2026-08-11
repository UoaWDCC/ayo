import React from 'react'
import FAQSection from '../components/FAQSection'
import JoinIntroSection from '../components/JoinIntroSection'
import OpportunitySection from '../components/OpportunitySection'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function JoinAyoPage() {
  const page = await getPageBySlug('join-ayo')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = heroBlock?.title || 'Join AYO'

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main>
      <Hero title={heroTitle} backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <JoinIntroSection />
      <OpportunitySection />
      <FAQSection />
    </main>
  )
}
