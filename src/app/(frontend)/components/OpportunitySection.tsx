'use client'

import { useMemo, useState } from 'react'
import OpportunityTable from './OpportunityTable'

const opportunities = [
  {
    id: 1,
    type: 'Scholarship',
    title: 'Lodge of the Liberal Arts: Howard Wyatt Memorial Scholarship',
    deadlineLabel: '20th of May, 11:59pm NZST',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    description:
      'The Freemasons of Lodge No.500 have established a trust for charitable purposes, to assist young musicians in their education. Scholarships totalling $3,000 are granted each year to members of AYO who have shown outstanding...',
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
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
    readMoreUrl: '#',
    applyUrl: '#',
  },
]

export default function OpportunitySection() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedType, setSelectedType] = useState('All')
  const [showCount, setShowCount] = useState(5)

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

  return (
    <section className="font-semibold text-[48px] leading-[56px] text-black mx-8 md:mx-24 lg:mx-40 xl:mx-64 pt-[116px] pb-[34px]">
      <h1>Opportunities</h1>

      <p className="mt-[16px] text-[24px] text-gray-400 italic">
        There are a range of opportunities we offer, exclusively to AYO players.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400">Type</label>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="font-semibold text-black bg-transparent outline-none"
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
          <label className="text-gray-400">Sort by</label>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="font-semibold text-black bg-transparent outline-none"
          >
            <option value="asc">Closing Date (Soonest)</option>
            <option value="desc">Closing Date (Latest)</option>
          </select>
        </div>

        {/* Show */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400">Show</label>

          <select
            value={showCount}
            onChange={(e) => setShowCount(Number(e.target.value))}
            className="font-semibold text-black bg-transparent outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Count */}
        <span className="ml-auto italic text-gray-400">
          Showing {Math.min(showCount, sortedOpportunities.length)} of {sortedOpportunities.length}{' '}
          opportunities
        </span>
      </div>

      <hr className="border-gray-200 mt-6" />

      <OpportunityTable opportunities={sortedOpportunities.slice(0, showCount)} />
    </section>
  )
}
