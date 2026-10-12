import React from 'react'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'

export const metadata = {
  title: 'Policies | Auckland Youth Orchestra',
  description: 'Policies of Auckland Youth Orchestra.',
}

export default async function PoliciesPage() {
  const page = await getPageBySlug('policies')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-25 pb-12.5">
        <p className="text-lg text-gray-700">Policy content coming soon.</p>
      </div>
    </main>
  )
}
