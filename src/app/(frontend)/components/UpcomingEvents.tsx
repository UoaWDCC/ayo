'use client'

import { useEffect, useMemo, useState } from 'react'
import EventCard from './EventCard'

// TODO: replace with real data from API
const opportunities = [
  {
    id: 1,
    type: 'Concert',
    title: 'Séjourné, Bizet & Dvorak',
    deadlineLabel: '20th of May, 11:59pm NZST',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'May',
    location: 'Auckland, New Zealand',
    date: 'Sun, 21 June',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 2,
    type: 'Concert',
    title: 'Séjourné, Bizet & Dvorak',
    deadlineLabel: '20th of May, 11:59pm NZST',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'May',
    location: 'Auckland, New Zealand',
    date: 'Sun, 21 June',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 3,
    type: 'Concert',
    title: 'Séjourné, Bizet & Dvorak',
    deadlineLabel: '15th of August, 11:59pm NZST',
    deadlineDate: '2026-08-15T23:59:00+12:00',
    year: 2026,
    month: 'August',
    location: 'Auckland, New Zealand',
    date: 'Sun, 21 June',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 4,
    type: 'Workshop',
    title: 'Conducting Masterclass',
    deadlineLabel: '1st of June, 11:59pm NZST',
    deadlineDate: '2026-06-01T23:59:00+12:00',
    year: 2026,
    month: 'June',
    location: 'Auckland, New Zealand',
    date: 'Sat, 15 June',
    description:
      'A practical workshop series led by professional conductors focusing on rehearsal technique, score preparation, and ensemble leadership.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 5,
    type: 'Competition',
    title: 'AYO Soloist Competition',
    deadlineLabel: '10th of July, 11:59pm NZST',
    deadlineDate: '2026-07-10T23:59:00+12:00',
    year: 2026,
    month: 'July',
    location: 'Auckland, New Zealand',
    date: 'Fri, 14 August',
    description:
      'Young musicians compete for performance opportunities and monetary prizes. The orchestra showcases exceptional talent open to the public.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 6,
    type: 'Scholarship',
    title: 'Howard Wyatt Memorial Scholarship',
    deadlineLabel: '5th of June, 11:59pm NZST',
    deadlineDate: '2026-06-05T23:59:00+12:00',
    year: 2026,
    month: 'June',
    location: 'Auckland, New Zealand',
    date: 'Applications Open',
    description:
      'Scholarships totalling $3,000 are granted each year to members of AYO who have shown outstanding musical achievement.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 7,
    type: 'Concert',
    title: 'Summer Showcase Series',
    deadlineLabel: '25th of May, 11:59pm NZST',
    deadlineDate: '2026-05-25T23:59:00+12:00',
    year: 2026,
    month: 'May',
    location: 'Auckland, New Zealand',
    date: 'Sun, 28 June',
    description:
      'Financial assistance for students from regional communities pursuing advanced orchestral studies and musical excellence.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 8,
    type: 'Workshop',
    title: 'Audition Preparation Intensive',
    deadlineLabel: '30th of September, 11:59pm NZST',
    deadlineDate: '2026-09-30T23:59:00+12:00',
    year: 2026,
    month: 'September',
    location: 'Auckland, New Zealand',
    date: 'Sat, 19 September',
    description:
      'An intensive coaching programme helping musicians prepare orchestral excerpts, solo repertoire, and audition strategies.',
    image: '/about-us-quote-poster.jpg',
  },
  {
    id: 9,
    type: 'Residency',
    title: 'Composer-in-Residence Programme',
    deadlineLabel: '18th of August, 11:59pm NZST',
    deadlineDate: '2026-08-18T23:59:00+12:00',
    year: 2026,
    month: 'August',
    location: 'Auckland, New Zealand',
    date: 'Applications Open',
    description:
      'Selected applicants will collaborate directly with the orchestra over a six-month residency period developing new compositions.',
    image: '/about-us-quote-poster.jpg',
  },
]

export default function UpcomingEvents() {
  const [selectedYear, setSelectedYear] = useState<number | 'All'>(2026)
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const showCount = 3

  // Dynamically generate available filters
  const years = ['All', ...new Set(opportunities.map((opp) => opp.year))]
  const months = ['All', ...new Set(opportunities.map((opp) => opp.month))]
  const types = ['All', ...new Set(opportunities.map((opp) => opp.type))]
  const locations = ['All', ...new Set(opportunities.map((opp) => opp.location))]

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const yearMatch = selectedYear === 'All' || opp.year === selectedYear
    const monthMatch = selectedMonth === 'All' || opp.month === selectedMonth
    const typeMatch = selectedType === 'All' || opp.type === selectedType
    const locationMatch = selectedLocation === 'All' || opp.location === selectedLocation

    return yearMatch && monthMatch && typeMatch && locationMatch
  })

  // Sort opportunities by deadline
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime()
    })
  }, [filteredOpportunities])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, selectedMonth, selectedType, selectedLocation])

  // Pagination
  const totalPages = Math.ceil(sortedOpportunities.length / showCount)
  const paginatedOpportunities = sortedOpportunities.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  )

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-[116px] pb-[64px]">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">Upcoming Events</h2>
        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
          A season of performances showcasing bold works and the energy of young musicians growing
          through music.
        </p>
        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2]">
          Alongside our concert seasons we run a growing programme of tours, workshops,
          masterclasses, and educational events, built to develop young musicians, open doors for
          new members, and give our supporters even more ways to get involved. Whether you're a
          player looking to grow, a family exploring what we offer, or a sponsor following our
          impact, this is where you'll find the full picture of what we do beyond the stage.
        </p>
        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] font-semibold">What's on:</p>

        <ul className="mt-4 ml-6 text-[18px] leading-[22px] text-[#B2B2B2] list-disc">
          <li>
            <span className="font-semibold">International Tours</span> — performing and learning
            across borders [occasional event]
          </li>
          <li>
            <span className="font-semibold">Education & Outreach</span> — masterclasses, workshops,
            and pathways for new and aspiring members [wishlist project]
          </li>
          <li>
            <span className="font-semibold">Soloist Competition Finals</span> — showcasing our most
            exceptional young talent, open to the public [annual event]
          </li>
          <li>
            <span className="font-semibold">Community & Sponsor Events</span> — celebrating the
            people behind the music [wishlist project]
          </li>
        </ul>

        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2]">
          New opportunities are added throughout the season — check back often, or get in touch to
          find out what's next.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px] px-4">
          {/* Year */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Year</label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))
              }
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {(years as (string | number)[]).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Month</label>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Event Type</label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Location</label>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {paginatedOpportunities.map((event) => (
            <EventCard
              key={event.id}
              image={event.image}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              eventType={event.type.toUpperCase() + ' · ' + event.location.toUpperCase()}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-12 text-[15px] leading-[18px]">
          <div className="flex gap-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="underline disabled:no-underline disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="underline disabled:no-underline disabled:opacity-40"
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
