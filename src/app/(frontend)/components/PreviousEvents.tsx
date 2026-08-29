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
    month: 'June',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [
      { label: 'Recordings', href: '#' },
      { label: 'Photos', href: '#' },
    ],
    footerNote: 'Photos available.',
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
  {
    id: 2,
    type: 'Concert',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'June',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [
      { label: 'Recordings', href: '#' },
      { label: 'Photos', href: '#' },
    ],
    footerNote: 'Photos available.',
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
  {
    id: 3,
    type: 'Concert',
    deadlineDate: '2026-05-20T23:59:00+12:00',
    year: 2026,
    month: 'June',
    location: 'Auckland, New Zealand',
    title: 'Séjourné, Bizet & Dvorak',
    subtitle: 'Sun, 21 June · Auckland Town Hall',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Séjourné, bringing together tradition and contemporary sound in one performance.',
    image: '/about-us-quote-poster.jpg',
    performances: [{ time: '19:30', date: 'Sunday, 21 June', venue: 'Auckland Town Hall' }],
    links: [
      { label: 'Recordings', href: '#' },
      { label: 'Photos', href: '#' },
    ],
    footerNote: 'Photos available.',
    ctaLabel: 'See Now',
    ctaHref: '#',
  },
]

export default function PreviousEvents() {
  const [selectedYear, setSelectedYear] = useState<number | 'All'>(2026)
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const showCount = 3

  const years = ['All', ...new Set(events.map((opp) => opp.year))]
  const months = ['All', ...new Set(events.map((opp) => opp.month))]
  const types = ['All', ...new Set(events.map((opp) => opp.type))]
  const locations = ['All', ...new Set(events.map((opp) => opp.location))]

  const filteredevents = events.filter((opp) => {
    const yearMatch = selectedYear === 'All' || opp.year === selectedYear
    const monthMatch = selectedMonth === 'All' || opp.month === selectedMonth
    const typeMatch = selectedType === 'All' || opp.type === selectedType
    const locationMatch = selectedLocation === 'All' || opp.location === selectedLocation

    return yearMatch && monthMatch && typeMatch && locationMatch
  })

  const sortedevents = useMemo(() => {
    return [...filteredevents].sort((a, b) => {
      return new Date(b.deadlineDate).getTime() - new Date(a.deadlineDate).getTime()
    })
  }, [filteredevents])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, selectedMonth, selectedType, selectedLocation])

  const totalPages = Math.ceil(sortedevents.length / showCount)
  const paginatedevents = sortedevents.slice((currentPage - 1) * showCount, currentPage * showCount)

  return (
    <section className="bg-white w-full">
      <div className="px-4 sm:px-8 md:px-24 py-14">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">Previous Events</h2>
        <p className="mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
          A collection of past performances that reflect the growth, dedication, and achievements
          of our musicians on stage.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px] px-4">
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
