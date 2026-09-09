'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import Dropdown from './Dropdown'
import EventCard, { type EventCardData } from './EventCard'

gsap.registerPlugin(ScrollTrigger)

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
  const [searchInput, setSearchInput] = useState('')
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
  }, [selectedYear, selectedMonth, selectedType, selectedLocation, searchInput])

  // Search filtered events
  const searchedevents = sortedevents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      event.description.toLowerCase().includes(searchInput.toLowerCase()),
  )

  const totalPages = Math.ceil(searchedevents.length / showCount)
  const paginatedevents = searchedevents.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  )

  const leadRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isFirstGridRender = useRef(true)

  useEffect(() => {
    if (!leadRef.current) return
    const leadEls = leadRef.current.querySelectorAll('.previous-lead-fade')
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
    const introEls = introRef.current.querySelectorAll('.previous-intro-fade')
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

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.previous-card-item')
    const firstCard = cards[0]
    if (!firstCard) return

    if (isFirstGridRender.current) {
      isFirstGridRender.current = false
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: firstCard,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
      return
    }

    gsap.killTweensOf(cards)
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', overwrite: true },
    )
  }, [paginatedevents])

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-14">
        <div ref={leadRef}>
          <h2 className="previous-lead-fade font-semibold text-[40px] leading-[48px] text-black">
            Previous Events
          </h2>
          <p className="previous-lead-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
            A collection of past performances that reflect the growth, dedication, and achievements
            of our musicians on stage.
          </p>
        </div>

        <div ref={introRef}>
          {/* Controls */}
          <div className="previous-intro-fade relative z-30 flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
            <Dropdown
              label="Year"
              value={String(selectedYear)}
              options={(years as (string | number)[]).map(String)}
              onChange={(value) => setSelectedYear(value === 'All' ? 'All' : Number(value))}
            />

            <Dropdown
              label="Month"
              value={selectedMonth}
              options={months}
              onChange={setSelectedMonth}
            />

            <Dropdown
              label="Event Type"
              value={selectedType}
              options={types}
              onChange={setSelectedType}
            />

            <Dropdown
              label="Location"
              value={selectedLocation}
              options={locations}
              onChange={setSelectedLocation}
            />

            {/* search bar */}
            <div className="ml-auto flex items-center gap-2 border border-[#EBEBEB] px-3 py-1">
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

        {/* Event Cards Grid */}
        <div
          ref={gridRef}
          className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
        >
          {paginatedevents.map((event) => (
            <div key={event.id} className="previous-card-item">
              <EventCard
                event={{
                  ...event,
                  footerLabel: `${event.type.toUpperCase()} · ${event.location.toUpperCase()}`,
                }}
              />
            </div>
          ))}
        </div>

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
