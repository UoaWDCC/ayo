import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Button from '../components/Button'
import Hero from '../components/Hero'
import FAQSection from '../components/FAQSection'
import AboutUsQuoteStatic from '../components/AboutUsQuoteStatic'
import InfoRowList from '../components/InfoRowList'
import StaggerReveal from '../components/StaggerReveal'
import { createIntroConverters } from '../components/richTextConverters'
import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'

import { getPartners } from '@/lib/getPartners'
import SponsorList from '../components/SponsorList'

const introConverters = createIntroConverters('support-intro-fade')
const summaryConverters = createIntroConverters('support-summary-fade')
const waysToGiveConverters = createIntroConverters('support-ways-fade')
const getInTouchConverters = createIntroConverters('support-touch-fade')

export default async function SupportUsPage() {
  const page = await getPageBySlug('support-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  const introductionContent = richTextBlocks[0]?.content
  const supportSummaryContent = richTextBlocks[1]?.content
  // TODO: The Givealittle CMS link currently points to /givealittlelink; replace it when confirmed.
  const waysToGiveContent = richTextBlocks[2]?.content
  const getInTouchContent = richTextBlocks[3]?.content

  const tableBlock = page?.layout?.find((block) => block.blockType === 'table')
  // TODO: Table row links currently point to /support-us; replace them when destinations are confirmed.
  const donationRows = tableBlock?.rows ?? []

  const quoteBlock = page?.layout?.find((block) => block.blockType === 'quote')

  const quoteImage = quoteBlock?.image

  const quoteImageUrl =
    typeof quoteImage === 'object' && quoteImage !== null ? quoteImage.url : undefined

  const partners = await getPartners()

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero
        title={heroBlock?.slogan || 'Support Us'}
        subtitle="Help us keep music thriving for the next generation."
        backgroundImage={heroImage}
      />

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
          <div className="max-w-[1380px]">
            {introductionContent && (
              <StaggerReveal fadeClass="support-intro-fade">
                <RichText data={introductionContent} converters={introConverters} />
              </StaggerReveal>
            )}
          </div>
        </div>
      </section>

      <div className="w-full my-12.5">
        <AboutUsQuoteStatic
          quote={quoteBlock?.text}
          image={quoteImageUrl ?? undefined}
          caption={quoteBlock?.caption ?? undefined}
        />
      </div>

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <div className="max-w-[1380px]">
            {supportSummaryContent && (
              <StaggerReveal fadeClass="support-summary-fade">
                <RichText data={supportSummaryContent} converters={summaryConverters} />
              </StaggerReveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <div className="max-w-[1380px] [&_a]:underline">
            {waysToGiveContent && (
              <StaggerReveal fadeClass="support-ways-fade">
                <RichText data={waysToGiveContent} converters={waysToGiveConverters} />
              </StaggerReveal>
            )}

            <InfoRowList rows={donationRows} className="mt-14" />

            {getInTouchContent && (
              <StaggerReveal fadeClass="support-touch-fade" className="mt-8">
                <RichText data={getInTouchContent} converters={getInTouchConverters} />
              </StaggerReveal>
            )}
          </div>
        </div>
      </section>

      <SponsorList
        sponsors={partners.map((p) => ({
          id: p.id,
          name: p.name,
          imageUrl: typeof p.logo === 'object' && p.logo?.url ? p.logo.url : undefined,
        }))}
      />

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
          <StaggerReveal
            fadeClass="support-cta-fade"
            className="max-w-[1380px] flex flex-col items-center text-center"
          >
            <h2 className="support-cta-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
              Want to support us?
            </h2>

            <Button href="/contact-us" className="support-cta-fade mt-6">
              Click Here
            </Button>
          </StaggerReveal>
        </div>
      </section>

      <FAQSection category="support-us" />
    </main>
  )
}
