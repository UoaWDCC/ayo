import React from 'react'
import FAQSection from '../components/FAQSection'
import JoinAyoBlock from '../components/join-ayo/JoinAyoBlock'
import JoinIntroSection from '../components/JoinIntroSection'
import OpportunitySection from '../components/OpportunitySection'
import Hero from '../components/Hero'

import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import { getOpportunities } from '@/lib/getOpportunities'

export default async function JoinAyoPage() {
  const [page, opportunities] = await Promise.all([getPageBySlug('join-ayo'), getOpportunities()])

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  const introText = richTextBlocks[0]?.content ?? []

  const tableBlock = page?.layout?.find((block) => block.blockType === 'table')
  const joinUsRows = tableBlock?.rows ?? []

  // The scroll story; the page simply skips it until the block is added in the CMS.
  const stageBlock = page?.layout?.find((block) => block.blockType === 'join-stage')

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || page?.title || ''}
        subtitle={heroBlock?.subtitle ?? undefined}
        backgroundImage={heroImage}
      />
      <JoinIntroSection introText={introText} introRows={joinUsRows} />
      {stageBlock && <JoinAyoBlock block={stageBlock} />}
      <OpportunitySection opportunities={opportunities} />
      <FAQSection category="join-ayo" />
    </main>
  )
}
