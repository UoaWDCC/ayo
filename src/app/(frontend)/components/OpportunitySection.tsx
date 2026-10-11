'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Dropdown from './Dropdown'
import OpportunityTable from './OpportunityTable'

gsap.registerPlugin(ScrollTrigger)

// TODO: replace with real data from API

const opportunities = [
  {
    id: 1,
    type: 'Scholarship',
    title: 'Lodge of the Liberal Arts: Howard Wyatt Memorial Scholarship',
    deadlineLabel: '20th of May, 11:59pm NZST',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    description:
      'The Freemasons of Lodge No.500 have established a trust for charitable purposes, to assist young musicians in their education. Scholarships totalling $3,000 are granted each year to members of AYO who have shown outstanding...',
    applyUrl: '#',
  },
  {
    id: 2,
    type: 'Scholarship',
    title: 'Chip and Muriel Stevens Award',
    deadlineLabel: '20th of May, 11:59pm NZST',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    description:
      'This $1,500 award is dedicated to the memory of a former Chairman of AYO, N.W. (Chip) Stevens, who spent his lifetime encouraging young people to love music and young musicians to reach their full potential.',
    applyUrl: '#',
  },
  {
    id: 3,
    type: 'Competition',
    title: 'AYO Soloist Competition',
    deadlineLabel: '15th of August, 11:59pm NZST',
    deadlineDate: '2026-08-15T23:59:00+12:00',
    description:
      'The AYO Soloist Competition offers existing orchestra members the chance to compete for monetary prizes and a concerto appearance with the orchestra. The orchestra showcases young soloists and composers; it...',
    applyUrl: '#',
  },
  {
    id: 4,
    type: 'Scholarship',
    title: 'AYO International Performance Grant',
    deadlineLabel: '1st of June, 11:59pm NZST',
    deadlineDate: '2026-06-01T23:59:00+12:00',
    description:
      'Supports orchestra members travelling internationally for advanced musical training and performance opportunities.',
    applyUrl: '#',
  },
  {
    id: 5,
    type: 'Competition',
    title: 'Emerging Composer Competition',
    deadlineLabel: '10th of July, 11:59pm NZST',
    deadlineDate: '2026-07-10T23:59:00+12:00',
    description:
      'Young composers are invited to submit original orchestral works for adjudication and potential live performance.',
    applyUrl: '#',
  },
  {
    id: 6,
    type: 'Workshop',
    title: 'Conducting Masterclass Programme',
    deadlineLabel: '5th of June, 11:59pm NZST',
    deadlineDate: '2026-06-05T23:59:00+12:00',
    description:
      'A practical workshop series led by professional conductors focusing on rehearsal technique, score preparation, and ensemble leadership.',
    applyUrl: '#',
  },
  {
    id: 7,
    type: 'Scholarship',
    title: 'Regional Music Development Scholarship',
    deadlineLabel: '25th of May, 11:59pm NZST',
    deadlineDate: '2026-05-25T23:59:00+12:00',
    description:
      'Financial assistance for students from regional communities pursuing advanced orchestral studies.',
    applyUrl: '#',
  },
  {
    id: 8,
    type: 'Competition',
    title: 'Chamber Ensemble Showcase',
    deadlineLabel: '30th of September, 11:59pm NZST',
    deadlineDate: '2026-09-30T23:59:00+12:00',
    description:
      'Small ensembles compete for performance opportunities during the annual AYO concert season.',
    applyUrl: '#',
  },
  {
    id: 9,
    type: 'Residency',
    title: 'Composer-in-Residence Programme',
    deadlineLabel: '18th of August, 11:59pm NZST',
    deadlineDate: '2026-08-18T23:59:00+12:00',
    description:
      'Selected applicants will collaborate directly with the orchestra over a six-month residency period developing new compositions.',
    applyUrl: '#',
  },
  {
    id: 10,
    type: 'Workshop',
    title: 'Advanced Audition Preparation Intensive',
    deadlineLabel: '12th of June, 11:59pm NZST',
    deadlineDate: '2026-06-12T23:59:00+12:00',
    description:
      'An intensive coaching programme helping musicians prepare orchestral excerpts, solo repertoire, and audition strategies.',
    applyUrl: '#',
  },
]

const SORT_LABELS = {
  asc: 'Closing Date (Soonest)',
  desc: 'Closing Date (Latest)',
} as const

const SHOW_OPTIONS = [3, 5, 10]

export default function OpportunitySection() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedType, setSelectedType] = useState('All')
  const [showCount, setShowCount] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  // Dynamically generate available types
  const opportunityTypes = ['All', ...new Set(opportunities.map((opp) => opp.type))]

  // Filter opportunities
  const filteredOpportunities =
    selectedType === 'All'
      ? opportunities
      : opportunities.filter((opp) => opp.type === selectedType)

  // Sort opportunities
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime()
        : new Date(b.deadlineDate).getTime() - new Date(a.deadlineDate).getTime()
    })
  }, [filteredOpportunities, sortOrder])

  // Search filtered opportunities
  const searchedOpportunities = sortedOpportunities.filter(
    (opp) =>
      opp.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchInput.toLowerCase()),
  )

  // Reset page when controls change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, sortOrder, showCount, searchInput])

  // Pagination for what actually shows after filtering and search
  const totalPages = Math.ceil(searchedOpportunities.length / showCount)

  const paginatedOpportunities = searchedOpportunities.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  )

  const leadRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leadRef.current) return
    const leadEls = leadRef.current.querySelectorAll('.opportunities-lead-fade')
    const firstLeadEl = leadEls[0]
    if (!firstLeadEl) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leadEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstLeadEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!introRef.current) return
    const introEls = introRef.current.querySelectorAll('.opportunities-intro-fade')
    const firstIntroEl = introEls[0]
    if (!firstIntroEl) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        introEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstIntroEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <div ref={leadRef}>
          <h2 className="opportunities-lead-fade font-semibold text-[40px] leading-[48px] text-black">
            Opportunities
          </h2>

          <p className="opportunities-lead-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
            There are a range of opportunities we offer, exclusively to AYO players.
          </p>
        </div>

        <div ref={introRef}>
          {/* Controls */}
          <div className="opportunities-intro-fade relative z-30 flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
            <Dropdown
              label="Type"
              value={selectedType}
              options={opportunityTypes}
              onChange={setSelectedType}
            />

            <Dropdown
              label="Sort by"
              value={SORT_LABELS[sortOrder]}
              options={Object.values(SORT_LABELS)}
              onChange={(value) =>
                setSortOrder(value === SORT_LABELS.asc ? 'asc' : 'desc')
              }
            />

            <Dropdown
              label="Show"
              value={String(showCount)}
              options={SHOW_OPTIONS.map(String)}
              onChange={(value) => setShowCount(Number(value))}
            />

            {/* search bar */}
            <div className="lg:ml-auto flex items-center gap-2.5 border border-[#EBEBEB] px-4 py-2.5">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="shrink-0 text-[#B2B2B2]"
              >
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M10.5 10.5L14 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="outline-none bg-transparent placeholder:text-[#B2B2B2]"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Table */}
        <OpportunityTable opportunities={paginatedOpportunities} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-12 text-[15px] leading-[18px]">
          <div className="flex gap-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="underline disabled:no-underline disabled:opacity-40 disabled:cursor-default cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="underline disabled:no-underline disabled:opacity-40 disabled:cursor-default cursor-pointer"
            >
              Next
            </button>
          </div>

          <span className="font-normal">
            {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </section>
  )
}
