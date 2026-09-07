import { getPayload } from 'payload'
import config from '@payload-config'
import AboutUsSection from '../components/AboutUsSection'
import Grid from '../components/Grid'
import Hero from '../components/Hero'
import OurTeam from '../components/OurTeam'
import NewsletterSignupDemo from '../components/Newsletter'
import AboutUsFilter from '../components/AboutUsFilter'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function AboutUsPage() {
  const payload = await getPayload({ config })
  const page = await getPageBySlug('about-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/about-us-hero.jpg'

  const { docs: people } = await payload.find({
    collection: 'people',
  })

  return (
    <div>
      <Hero title="About Us" backgroundImage="/about-us-hero.jpg" />
      <main className="min-h-screen bg-white text-black">
        <AboutUsSection />
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 text-2xl leading-body">
          <p className="">
            Like any good symphony, AYO is made up of multiple moving parts. Some sit in the
            background; others take centre stage. Every one of them helps in making the magic
            happen.
          </p>
          <ul className="text-2xl ml-10 list-disc">
            <li>
              <span className="font-bold">Our Players: </span>some of Aotearoa&apos;s most driven
              young musicians.
            </li>
            <li>
              <span className="font-bold">Our Team: </span>the practical, logistical, and artistic
              direction behind every rehearsal and performance.{' '}
            </li>
            <li>
              <span className="font-bold">Our Alumni:</span> once AYO, always AYO. See where the
              music has taken our players.
            </li>
          </ul>
        </div>

        <AboutUsFilter people={people}/>
      </main>
    </div>
  )
}
