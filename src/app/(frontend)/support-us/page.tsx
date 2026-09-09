import React from 'react'
import Link from 'next/link'
import DonationBlock from '../components/DonationBlock'
import Hero from '../components/Hero'
import AYOSection from '../components/AYOWallSection'
import FAQSection from '../components/FAQSection'
import SponsorsSection from '../components/SponsorsSection'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'
import { Partners } from '@/collections/Partners'
import AboutUsQuoteVideo from '../components/AboutUsQuoteVid'

export default async function SupportUsPage() {
  const page = await getPageBySlug('support-us')
  const sponsorList = ['Benjamin N.', 'E. Musk', 'J.E.E', 'William Gates', 'D.J Trump', 'Tyla Yung']

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

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
    <main>
      <div className="w-full h-[vh] relative">
        <Hero title="Support Us" backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 text-2xl leading-body">
        <div className="mb-6">
          Behind every AYO player who walks on stage lies years of dedication. The concerts we're so
          proud of require months of collaborative preparation most audiences never see. That work
          doesn't fund itself. Venue hire, professional coaching, sheet music, instrument upkeep: it
          all adds up, long before the lights go up on a single performance.{' '}
        </div>

        <div className="mb-6">
          {' '}
          As a charitable organisation, we're non-profit, volunteer-run, and we keep costs as lean
          as we can. But to keep offering Aotearoa New Zealand's best young musicians a genuine
          professional-standard training ground — the kind of opportunity that shapes careers, not
          just resumes — we rely on people who believe in what we're building just as much as we
          do.{' '}
        </div>

        <div className="mb-6">
          Your support fuels our youth, getting a full orchestra onto a stage in front of an
          audience that might otherwise never hear what young New Zealanders are capable of. It
          keeps an institution with impressive longevity doing what it's always done: turning
          talented young people into serious musicians, and serious musicians into lifelong artists,
          colleagues and friends.{' '}
        </div>
        <div className="mb-6">
          Sponsors and supporters sit close to that story all year. As a mark of thanks, we're glad
          to acknowledge their generosity — in our concert programmes, with seating set aside at our
          Auckland Town Hall concerts, and in the knowledge that their name is attached to something
          with a track record stretching back to 1948.{' '}
        </div>
      </div>
      <div>
        <AboutUsQuoteVideo
          quote="Watching Auckland Youth Orchestra perform, it was hard to believe this was youth talent. The passion, precision, and professionalism on stage were genuinely extraordinary."
          posterImage="/about-us-quote-poster.jpg"
          // videoSrc="/about-us-quote-preview.mp4"   //
          youtubeUrl="https://youtu.be/8HixIOtXEN4?si=N13_yW1Zjo5zVaH-" // changeable
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 text-2xl leading-body">
        <p className="mb-6">
          AYO is a registered charity (CC45382) and an IRD-registered donee organisation — see Ways
          to Give for details on tax credits.{' '}
        </p>

        <p className="mb-6">
          Whether you're a business looking for a meaningful community partnership, a trust
          considering a grant, or an individual who simply loves what live music can do for young
          people — there's a place for you in AYO's next chapter. Come and talk to us to find out
          more.
        </p>
      </div>
      <div className="text-black w-full">
        <div className="flex justify-center">
          <div className="text-body my-10 w-[90%]">
            <h1 className="text-heading font-semibold">Ways to Give</h1>
            <p className="mt-2 leading-9">
              We are grateful for the donations and grants from our major supporters and for the
              generosity of others. Every donation is appreciated and helpful. Auckland Youth
              Orchestra Incorporated is a registered charity, CC45382, and is an IRD-registered
              Donee Organisation for tax credits on donations.
            </p>
            <p className="mt-5 mb-10"> For one off donations:</p>
            <ul className="list-disc pl-6 py-4">
              <li>
                <span className="font-bold">Direct to our bank account:</span>
                Auckland Youth Orchestra Incorporated, 12-3030-0505986-00. This is our preferred
                method for larger donations, as it comes to us in full.
              </li>
              <li>
                <span className="font-bold">
                  <Link href="givealittlelink">
                    <span className="underline">Givealittle: </span>
                  </Link>
                </span>
                instant tax receipt, credit card or internet banking. Note: Givealittle takes a 5%
                platform fee before funds reach us.
              </li>
            </ul>
            <p className="mt-5 mb-10">
              All donations over $5.00 NZD are eligible for a New Zealand charitable giving tax
              credit, and a receipt will be issued on request.
            </p>

            <div>
              {tierArray.map((tier, index) => (
                <div key={index}>
                  <DonationBlock
                    tierName={tier.tierName}
                    descriptionContent={tier.descriptionContent}
                    linkText={tier.linkText}
                    linkUrl={tier.linkUrl}
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
      <SponsorsSection sponsors={sponsorList}></SponsorsSection>

      <div className="grid col-span-1 col-start-6 content-center justify-items-center font-semibold mr-10 text-3xl py-3">
        <p>{'Want to support us?'}</p>
      </div>
      <div className="grid col-span-1 col-start-6 content-center justify-items-center font-semibold underline mr-10">
        <Link href={''}>{'Click here for more details'}</Link>
      </div>
      <FAQSection></FAQSection>
    </main>
  )
}
