import React from 'react'
import Link from 'next/link'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import DonationBlock from '../components/DonationBlock'
import Hero from '../components/Hero'
import AYOSection from '../components/AYOWallSection'
import FAQSection from '../components/FAQSection'
import SponsorsSection from '../components/SponsorsSection'
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

export default async function SupportUsPage() {
  const page = await getPageBySlug('support-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []

  const introductionContent = richTextBlocks[0]?.content
  const supportSummaryContent = richTextBlocks[1]?.content
  // TODO: The Givealittle CMS link currently points to /givealittlelink; replace it when confirmed.
  const waysToGiveContent = richTextBlocks[2]?.content

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

  const tierArray = [
    {
      tierName: 'Subscriber',
      descriptionContent: (
        <p>
          Subscribers pay an annual subscription of $25.00 as a donation towards our ongoing work
          and their names are listed in our printed concert programmes. They automatically become
          Members of the incorporated society and, as such, are entitled to attend General Meetings
          and vote.
        </p>
      ),
      linkText: 'Register',
      linkUrl: '',
    },
    {
      tierName: 'Supporter',
      descriptionContent: (
        <>
          <p>
            Supporters donate a minimum of <strong>$75.00</strong> and, to show our appreciation for
            their support:{' '}
          </p>

          <ul className="list-disc pl-6 py-4">
            <li>
              Their names are listed in the printed programmes (unless anonymity is requested); and,
            </li>
            <li>
              Some of the best seats are cordoned off exclusively for them at the free Auckland Town
              Hall concerts. 
            </li>
          </ul>

          <div className="max-w">
            <div className="flex justify-between">
              <span className="font-semibold">General Supporter</span>
              <span>$75.00+</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Special Supporter</span>
              <span>$500.00+</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">General Supporter</span>
              <span>$5,000.00+</span>
            </div>
          </div>
        </>
      ),
      linkText: 'Register',
      linkUrl: '',
    },
    {
      tierName: 'KORA Cards',
      descriptionContent: (
        <p>
          Sign up for Kora fuel cards and a few cents per litre will be donated to AYO every time
          you fill up at either a Mobil or Waitomo station.  Kora offers cardholders a discount of
          10c/litre and you can have some (or all!) of that saving donated to AYO automatically!
        </p>
      ),
      linkText: 'Read More',
      linkUrl: '',
    },
    {
      tierName: 'Leave a Legacy',
      descriptionContent: (
        <>
          <p>
            A bequest is a gift written into your will (a sum of money, an asset, or a share of your
            estate) left to AYO to help shape the orchestra's future long after your own
            contribution is made.{' '}
          </p>
          <ul className="list-disc pl-6 py-4">
            <li>
              If you already have a will, a simple codicil can add this gift without rewriting the
              whole document.
            </li>
            <li>
              If you don't yet have a will, your solicitor can include AYO directly when it's drawn
              up.
            </li>
          </ul>
          You're free to place any conditions you like on a bequest, though since it may be many
          years before it reaches us, we'd gently suggest keeping the terms general so it can be put
          to the greatest need at the time. As with any bequest, it will only be valid if it's
          properly included, signed, and witnessed in your will or codicil, so it's worth confirming
          the details with your solicitor. We'd love the chance to thank you personally — if you're
          considering remembering AYO in your will, or have already done so, please get in touch.
        </>
      ),
      linkText: 'Download a codicil form',
      linkUrl: '',
    },
    {
      tierName: 'Sponsor Us',
      descriptionContent: (
        <p>
          Our running costs are significant, and some needs are very specific — from secure, dry
          storage for instruments and equipment, to professional recording and production support.
          If your business can help meet a particular need like this, we'd love to talk about what a
          partnership could look like.
        </p>
      ),
      linkText: 'Contact Us',
      linkUrl: '',
    },
    {
      tierName: 'Other Ways to Help',
      descriptionContent: (
        <ul className="list-disc pl-6 py-4">
          <li>Come to a concert — a full house means everything to our players.</li>
          <li>Sign up to our newsletter — stay close to what's coming next.</li>
          <li>
            Give practical or administrative support — as a volunteer-run charity, time and energy
            is our most precious resource, and we always welcome a hand.
          </li>
        </ul>
      ),
      linkText: 'Read More',
      linkUrl: '',
    },
  ]
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="w-full h-[vh] relative">
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
        <p className="text-center font-bold text-sm mt-10">Get in Touch </p>
        <p className="text-center text-body text-sm mt-10">
          Email our treasurer at treasurer@ayo.org.nz, or write to us at Auckland Youth Orchestra
          Incorporated, PO Box 99830, Newmarket, Auckland 1149.
        </p>
      </div>

      <div className="grid col-span-1 col-start-6 content-center justify-items-center font-semibold mr-10 text-3xl py-3">
        <p>{'Want to support us?'}</p>
      </div>
      <div className="grid col-span-1 col-start-6 content-center justify-items-center font-semibold underline mr-10">
        <Link href={''}>{'Click here for more details'}</Link>
      </div>
      <SponsorList
        sponsors={partners.map((p) => ({
          id: p.id,
          name: p.name,
          imageUrl: typeof p.logo === 'object' && p.logo?.url ? p.logo.url : undefined,
        }))}
      />
      <div className="text-center">
        <p className="font-bold">Want to support us?</p>
        <a href="/contact" className="underline">
          Click here for more details ↗
        </a>
      </div>
      <AYOSection></AYOSection>
      <FAQSection category="support-us" />
    </main>
  )
}
