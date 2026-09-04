'use client'

import { useEffect, useMemo, useState } from 'react'
import OpportunityTable from './OpportunityTable'

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

export default function OpportunitySection() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedType, setSelectedType] = useState('All')
  const [showCount, setShowCount] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

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

  // Reset page when controls change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, sortOrder, showCount])

  // Pagination
  const totalPages = Math.ceil(sortedOpportunities.length / showCount)

  const paginatedOpportunities = sortedOpportunities.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  )

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-[116px] pb-[64px]">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">Opportunities</h2>

        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
          There are a range of opportunities we offer, exclusively to AYO players.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
          {/* Type */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Type</label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4 transition-opacity hover:opacity-70"
            >
              {opportunityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Sort by</label>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4 transition-opacity hover:opacity-70"
            >
              <option value="asc">Closing Date (Soonest)</option>
              <option value="desc">Closing Date (Latest)</option>
            </select>
          </div>

          {/* Show */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Show</label>

            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4 transition-opacity hover:opacity-70"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          {/* Count */}
          <span className="ml-auto italic font-normal text-[#B7B7B7]">
            Showing {paginatedOpportunities.length}{' '}
            {paginatedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </span>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Table */}
        <OpportunityTable opportunities={paginatedOpportunities} />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-[15px] leading-[18px]">
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
