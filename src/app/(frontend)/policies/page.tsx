import React from 'react'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'Policies | Auckland Youth Orchestra',
  description: 'Policies of Auckland Youth Orchestra.',
}

export default async function PoliciesPage() {
  const page = await getPageBySlug('policies')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title="Policies" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <p className="text-lg text-gray-700">Policy content coming soon.</p>
      </div>
    </main>
  )
}
