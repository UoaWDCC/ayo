import React from 'react'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function ConcertsEventsPage() {
  const page = await getPageBySlug('concerts-events')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroTitle = heroBlock?.title || 'Concerts & Events'

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <div className="w-full h-[400px] relative">
      <div className="w-full h-[vh] relative">
        <Hero title={heroTitle} backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      </div>
      <main>This is the concerts & events page</main>
    </div>
  )
}
