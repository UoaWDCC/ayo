import React from 'react'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import DonationBlock from '../components/DonationBlock'
import Hero from '../components/Hero'
import FAQSection from '../components/FAQSection'
import AboutUsQuoteStatic from '../components/AboutUsQuoteStatic'
import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

import { getPartners } from '@/lib/getPartners'
import SponsorList from '../components/SponsorList'

const supportTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mb-6">{nodesToJSX({ nodes: node.children })}</p>
  ),
})

const waysToGiveConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const HeadingTag = node.tag

    return (
      <HeadingTag className="text-heading font-semibold">
        {nodesToJSX({ nodes: node.children })}
      </HeadingTag>
    )
  },
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mt-2 mb-5 leading-9">{nodesToJSX({ nodes: node.children })}</p>
  ),
  list: ({ node, nodesToJSX }) => {
    const ListTag = node.tag

    return <ListTag className="list-disc pl-6 py-4">{nodesToJSX({ nodes: node.children })}</ListTag>
  },
})

const tableContentConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mb-4 last:mb-0">{nodesToJSX({ nodes: node.children })}</p>
  ),
  list: ({ node, nodesToJSX }) => {
    const ListTag = node.tag

    return <ListTag className="list-disc pl-6 py-4">{nodesToJSX({ nodes: node.children })}</ListTag>
  },
})

const getInTouchConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="text-body text-sm">{nodesToJSX({ nodes: node.children })}</p>
  ),
})

export default async function SupportUsPage() {
  const page = await getPageBySlug('support-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

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

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/hero-placeholder.jpg'

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="w-full relative">
        <Hero
          title="Support Us"
          subtitle="Help us keep music thriving for the next generation."
          backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'}
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 text-2xl leading-body">
        {introductionContent && (
          <RichText data={introductionContent} converters={supportTextConverters} />
        )}
      </div>
      <div>
        <AboutUsQuoteStatic
          quote={quoteBlock?.text}
          image={quoteImageUrl ?? undefined}
          caption={quoteBlock?.caption ?? undefined}
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 text-2xl leading-body">
        {supportSummaryContent && (
          <RichText data={supportSummaryContent} converters={supportTextConverters} />
        )}
      </div>
      <div className="text-black w-full">
        <div className="flex justify-center">
          <div className="text-body my-10 w-[90%] [&_a]:underline">
            {waysToGiveContent && (
              <RichText data={waysToGiveContent} converters={waysToGiveConverters} />
            )}

            <div>
              {donationRows.map((row, index) => (
                <div key={row.id ?? index}>
                  <DonationBlock
                    tierName={row.label}
                    descriptionContent={
                      <RichText data={row.content} converters={tableContentConverters} />
                    }
                    linkText={row.linkLabel ?? ''}
                    linkUrl={row.linkUrl ?? ''}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {getInTouchContent && (
          <RichText
            className="mx-auto mt-6 mb-8 w-[90%]"
            data={getInTouchContent}
            converters={getInTouchConverters}
          />
        )}
      </div>

      <SponsorList
        sponsors={partners.map((p) => ({
          id: p.id,
          name: p.name,
          imageUrl: typeof p.logo === 'object' && p.logo?.url ? p.logo.url : undefined,
        }))}
      />
      <div className="text-center">
        <p className="font-semibold text-2xl">Want to support us?</p>
        <a href="/contact-us" className="underline">
          Click here for more details ↗
        </a>
      </div>
      <FAQSection category="support-us" emptyClassName="h-12" />
    </main>
  )
}
