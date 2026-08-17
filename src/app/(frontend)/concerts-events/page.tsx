import React from 'react'
import Hero from '../components/Hero'
import Link from 'next/link'
import PhotoSpotlight from '../components/PhotoSpotlight'
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

  const payload = await getPayload({ config })

  const linkResult = await payload.find({
    collection: 'spotlights',
    limit: 1,
  })
  const doc = linkResult.docs[0]
  const textAbove = doc?.text ?? ''

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero title="Concerts and Events" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />

      <PhotoSpotlight
        textAbove={textAbove}
        textSmall="Europe Tour - Friday, 23rd of October, 2025 to Friday 23rd of October, 2026"
        headingSmall="On Now:"
        headingLarge="Europe Tour"
        hoverImgSrc="/hero-placeholder.jpg"
        staticImgSrc="/about-us-quote-poster.jpg"
      />
    </main>
  )
}
