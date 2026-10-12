'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Dropdown from './Dropdown'
import OpportunityTable from './OpportunityTable'
import type { OpportunityListing } from '@/lib/getOpportunities'

gsap.registerPlugin(ScrollTrigger)

const SORT_LABELS = {
  asc: 'Closing Date (Soonest)',
  desc: 'Closing Date (Latest)',
} as const

const SHOW_OPTIONS = [3, 5, 10]

type OpportunitySectionProps = {
  /** Open opportunities from Payload, soonest deadline first. */
  opportunities: OpportunityListing[]
}

export default function OpportunitySection({ opportunities }: OpportunitySectionProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedType, setSelectedType] = useState('All')
  const [showCount, setShowCount] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  // The Type filter offers exactly the types currently on offer.
  const opportunityTypes = useMemo(
    () => ['All', ...new Set(opportunities.map((opp) => opp.type))],
    [opportunities],
  )

  // Filter opportunities
  const filteredOpportunities = useMemo(
    () =>
      selectedType === 'All'
        ? opportunities
        : opportunities.filter((opp) => opp.type === selectedType),
    [opportunities, selectedType],
  )

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
  const totalPages = Math.max(1, Math.ceil(searchedOpportunities.length / showCount))

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
              onChange={(value) => setSortOrder(value === SORT_LABELS.asc ? 'asc' : 'desc')}
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

        {searchedOpportunities.length === 0 ? (
          <p className="mt-8 text-[18px] leading-[22px] italic text-[#B2B2B2]">
            {opportunities.length === 0
              ? 'There are no opportunities open at the moment. Check back soon.'
              : 'No opportunities match your search.'}
          </p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  )
}
