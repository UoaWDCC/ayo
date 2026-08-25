'use client'

import { useEffect, useMemo, useState } from 'react'
import EventCard, { type EventCardData } from './EventCard'

// TODO: replace with real data from API (Concerts collection)
const events: (EventCardData & {
  type: string
  deadlineDate: string
  year: number
  month: string
  location: string
})[] = [
  {
    id: 1,
    type: 'Concert',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'May',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [],
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
  {
    id: 2,
    type: 'Concert',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'May',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [],
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
  {
    id: 3,
    type: 'Concert',
    deadlineDate: '2026-08-15T23:59:00+12:00',
    year: 2026,
    month: 'August',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [],
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
  {
    id: 4,
    type: 'Concert',
    deadlineDate: '2026-08-15T23:59:00+12:00',
    year: 2026,
    month: 'August',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [],
    ctaLabel: 'See Now',
    ctaHref: '#',
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
  const years = ['All', ...new Set(events.map((opp) => opp.year))]
  const months = ['All', ...new Set(events.map((opp) => opp.month))]
  const types = ['All', ...new Set(events.map((opp) => opp.type))]
  const locations = ['All', ...new Set(events.map((opp) => opp.location))]

  // Filter events
  const filteredevents = events.filter((opp) => {
    const yearMatch = selectedYear === 'All' || opp.year === selectedYear
    const monthMatch = selectedMonth === 'All' || opp.month === selectedMonth
    const typeMatch = selectedType === 'All' || opp.type === selectedType
    const locationMatch = selectedLocation === 'All' || opp.location === selectedLocation

    return yearMatch && monthMatch && typeMatch && locationMatch
  })

  // Sort events by deadline
  const sortedevents = useMemo(() => {
    return [...filteredevents].sort((a, b) => {
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime()
    })
  }, [filteredevents])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, selectedMonth, selectedType, selectedLocation])

  // Pagination
  const totalPages = Math.ceil(sortedevents.length / showCount)
  const paginatedevents = sortedevents.slice((currentPage - 1) * showCount, currentPage * showCount)

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
          new members, and give our supporters even more ways to get involved. Whether you&apos;re a
          player looking to grow, a family exploring what we offer, or a sponsor following our
          impact, this is where you&apos;ll find the full picture of what we do beyond the stage.
        </p>

        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] font-semibold">
          What&apos;s on:
        </p>

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
          New events are added throughout the season — check back often, or get in touch to find out
          what&apos;s next.
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
          {paginatedevents.map((event) => (
            <EventCard
              key={event.id}
              event={{
                ...event,
                footerLabel: `${event.type.toUpperCase()} · ${event.location.toUpperCase()}`,
              }}
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
