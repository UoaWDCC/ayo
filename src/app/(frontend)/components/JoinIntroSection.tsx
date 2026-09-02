'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

type InfoRow = {
  title: string
  content: ReactNode
  linkText: string
  linkUrl: string
}

const infoRows: InfoRow[] = [
  {
    title: 'What it takes',
    content: (
      <ul className="list-disc pl-5">
        <li>
          An audition: set orchestral excerpts (we&apos;ll send these ahead) plus a short piece of
          your choice.
        </li>
        <li>Weekly rehearsals &mdash; [current rehearsal time, location]</li>
        <li>Availability for concerts, our annual weekend camp, and weekend tours</li>
        <li>Commitment to your peers. You giving your best for the whole ensemble</li>
      </ul>
    ),
    linkText: 'Register',
    linkUrl: '#',
  },
  {
    title: 'What you get',
    content: (
      <ul className="list-disc pl-5">
        <li>High-level orchestral training &amp; performance opportunities</li>
        <li>Professional coaching</li>
        <li>Multiple performances a year, on real stages, for real audiences</li>
        <li>
          The opportunity to audition for our Soloist Competition (LINK), and eligibility for our
          Scholarships (LINKS)
        </li>
        <li>A community that, for many of our alumni, lasts a lifetime</li>
      </ul>
    ),
    linkText: 'Register',
    linkUrl: '#',
  },
  {
    title: 'The cost',
    content: (
      <p>
        As a Registered Charity we can keep costs low. An annual Player Subscription fee is due
        before audition &mdash; see [current fees] for this year&apos;s amount. If we can&apos;t
        offer you a place, it&apos;s fully refunded.
      </p>
    ),
    linkText: 'Read More',
    linkUrl: '#',
  },
]

const JoinIntroSection = () => {
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rowsRef.current) return
    const rows = rowsRef.current.querySelectorAll('.info-row')
    const firstRow = rows[0]
    if (!firstRow) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstRow,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-4">
        <div className="max-w-[1380px]">
          <h2 className="font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
            So, you&apos;re looking for that something extra?
          </h2>

          <div className="mt-8 space-y-8 text-[22px] leading-[29px] md:text-[26px] md:leading-[34px] text-[#2E2E2E]">
            <p>
              The next big challenge, or a chance to really hone your skills while performing
              incredible repertoire with like-minded peers?
            </p>

            <p>
              AYO is for musicians aged 16 to 26 who&apos;ve put in the years and are ready for
              more: the incomparable thrill of performing with a full symphony orchestra,
              exceptional training from our experienced conductor &amp; mentors, and some of the
              most driven young players in the country as colleagues.
            </p>

            <p>We rehearse hard, perform often, and expect a lot &mdash; and we give a lot back.</p>

            <p>
              AYO teaches you what it takes to perform at your best. But more than that, AYO helps
              you find your people &mdash; musicians who get it, who encourage and inspire you, who
              show up week after week chasing the same thing you are. Camps, tours, long rehearsals,
              the nerves before a big concert: shared experiences like these build friendships that
              outlast the music, and memories that stay with our players for life.
            </p>
          </div>

          <div ref={rowsRef} className="mt-14 border-t border-[#EBEBEB]">
            {infoRows.map((row) => (
              <div
                key={row.title}
                className="info-row grid grid-cols-1 gap-5 border-b border-[#EBEBEB] py-7 md:grid-cols-[1.4fr_2fr_0.8fr] md:gap-10 md:py-8"
              >
                <h3 className="font-semibold text-[24px] leading-[31px] md:text-[26px] md:leading-[34px]">
                  {row.title}
                </h3>

                <div className="text-[18px] leading-[25px] md:text-[20px] md:leading-[28px] text-[#2E2E2E]">
                  {row.content}
                </div>

                <div className="md:justify-self-end">
                  <Link
                    href={row.linkUrl}
                    className="inline-flex items-center gap-1 text-[18px] leading-[22px] font-semibold underline"
                  >
                    {row.linkText}
                    <img src="/arrow-up-right.svg" alt="" className="h-[15px] w-[15px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinIntroSection
