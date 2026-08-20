import React from 'react'
import AboutUsSection from '../components/AboutUsSection'
import Grid from '../components/Grid'
import Hero from '../components/Hero'
import OurTeam from '../components/OurTeam'
import NewsletterSignupDemo from '../components/Newsletter'

import { getPageBySlug } from '@/lib/getPageBySlug'
import type { Media } from '@/payload-types'

export default async function AboutUsPage() {
  const page = await getPageBySlug('about-us')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')

  const heroImage = heroBlock?.backgroundImage

  const heroImageUrl =
    typeof heroImage === 'object' && heroImage !== null
      ? (heroImage as Media).url
      : '/about-us-hero.jpg'
  const playerItems = [
    {
      id: 1,
      name: 'Frances Liu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Frances Liu.jpg',
    },
    {
      id: 2,
      name: 'Damon Herlihy-O’Brien',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Damon Herlihy-O_Brien.jpg',
    },
    {
      id: 3,
      name: 'Ashley Ling',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Ashley Ling.jpg',
    },
    {
      id: 4,
      name: 'Joy Shi',
      subtitle: 'Bassoonist',
      imageUrl: 'players/Bassoon_Joy Shi.jpg',
    },
    {
      id: 5,
      name: 'Harper Zhang',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Harper Zhang.jpg',
    },
    {
      id: 6,
      name: 'Harry Kim',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Harry Kim.jpg',
    },
    {
      id: 7,
      name: 'Howard Lu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Howard Lu.jpg',
    },
    {
      id: 8,
      name: 'Elvies Hu',
      subtitle: 'Cellist',
      imageUrl: 'players/Cello_Elvies Hu.jpg',
    },
  ]
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
        <Grid title="Players" placeholderSubtitle="Name" items={playerItems} />
        <OurTeam></OurTeam>
        <Grid title="Alumni" placeholderSubtitle="Role" items={playerItems} />
        <Grid title="Partners" placeholderSubtitle="Company" items={playerItems} />
      </main>
    </div>
  )
}
