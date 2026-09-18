'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Dropdown from '../components/Dropdown'
import Hero from '../components/Hero'
import NewsCard from '../components/NewsCard'
import NewsletterSignup from '../components/NewsletterSignup'

gsap.registerPlugin(ScrollTrigger)

const news = [
  {
    id: 1,
    slug: 'ayo-newsletter-july-2026',
    type: 'Newsletter',
    title: 'AYO Newsletter - July, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Mary Lin',
  },
  {
    id: 2,
    slug: 'ayo-newsletter-june-2026',
    type: 'Newsletter',
    title: 'AYO Newsletter - June, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Mary Lin',
  },
  {
    id: 3,
    slug: 'ayo-story-may-2026',
    type: 'Story',
    title: 'AYO Newsletter - May, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Mary Lin',
  },
  {
    id: 4,
    slug: 'ayo-newsletter-may-2026',
    type: 'Newsletter',
    title: 'AYO Newsletter - May, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 5,
    slug: 'ayo-story-june-2025',
    type: 'Story',
    title: 'AYO Story - June, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 6,
    slug: 'ayo-story-july-2025',
    type: 'Story',
    title: 'AYO Story - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 7,
    slug: 'ayo-story-july-2025-scholarship-updates',
    type: 'Scholarship Updates',
    title: 'AYO Story - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 8,
    slug: 'ayo-photo-essay-july-2025',
    type: 'Photo Essays',
    title: 'AYO Photo Essay - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 9,
    slug: 'ayo-alumni-news-july-2025',
    type: 'Alumni News',
    title: 'AYO Alumni News - July, 2025',
    publishLabel: 'Sun. 21 June',
    publishDate: '2025-06-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
  {
    id: 10,
    slug: 'ayo-story-august-2026',
    type: 'Story',
    title: 'AYO Story - August, 2026',
    publishLabel: 'Sun. 21 August',
    publishDate: '2026-08-21T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Howard Lu',
  },
]

const months = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function NewsPage() {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')

  const [showCount, setShowCount] = useState(6)

  const [currentPage, setCurrentPage] = useState(1)

  const [searchInput, setSearchInput] = useState('')

  // dynamically generate available types and years from articles
  const newsTypes = ['All', ...new Set(news.map((news) => news.type))]
  const years = [
    'All',
    ...new Set(news.map((news) => new Date(news.publishDate).getFullYear().toString())),
  ]

  // Filter News
  const filteredNews = news.filter((article) => {
    const date = new Date(article.publishDate)
    const articleYear = date.getFullYear().toString()
    const articleMonth = months[date.getMonth() + 1]

    const typeMatch = selectedType === 'All' || article.type === selectedType
    const yearMatch = selectedYear === 'All' || articleYear === selectedYear
    const monthMatch = selectedMonth === 'All' || articleMonth === selectedMonth

    return typeMatch && yearMatch && monthMatch
  })

  // sort news by publish time
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    )
  }, [filteredNews])

  // Reset page when controls change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedYear, selectedMonth, showCount])

  // searching filtered articles
  const searchedNews = sortedNews.filter(
    (article) =>
      article.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      article.description.toLowerCase().includes(searchInput.toLowerCase()),
  )

  // pagination for what actually shows after filtering and search
  const totalPages = Math.ceil(sortedNews.length / showCount)
  const paginatedNews = searchedNews.slice((currentPage - 1) * showCount, currentPage * showCount)

  const leadRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isFirstGridRender = useRef(true)

  useEffect(() => {
    if (!leadRef.current) return
    const leadEls = leadRef.current.querySelectorAll('.news-lead-fade')
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
    const introEls = introRef.current.querySelectorAll('.news-intro-fade')
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
    const cards = gridRef.current.querySelectorAll('.news-card-item')
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
  }, [paginatedNews])

  return (
    <main>
      <Hero
        title="News"
        subtitle="Catch up to the latest updates about us."
        backgroundImage="/hero-placeholder.jpg"
      />

      <section className="bg-white w-full">
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-16 md:pt-20 pb-8">
          <div ref={leadRef} className="max-w-[1380px]">
            <h2 className="news-lead-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
              Stay close to the music, all year round.
            </h2>

            <div className="news-lead-fade mt-8 text-[18px] leading-6.5 md:text-[20px] md:leading-7 text-[#2E2E2E]">
              <p>
                From newsletters to behind-the-scenes stories, this is where we share what&apos;s
                happening across the Auckland Youth Orchestra &mdash; on stage, in rehearsal, and
                everywhere in between.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pb-8 md:pb-12">
          <div ref={introRef}>
            {/* Filter Controls */}
            <div className="news-intro-fade relative z-30 flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
              <Dropdown
                label="Year"
                value={selectedYear}
                options={years}
                onChange={setSelectedYear}
              />

              <Dropdown
                label="Month"
                value={selectedMonth}
                options={months}
                onChange={setSelectedMonth}
              />

              <Dropdown
                label="Type"
                value={selectedType}
                options={newsTypes}
                onChange={setSelectedType}
              />

              <Dropdown
                label="Show"
                value={String(showCount)}
                options={['6', '12', '18', '24']}
                onChange={(value) => setShowCount(Number(value))}
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
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="outline-none bg-transparent placeholder:text-[#B2B2B2]"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#EBEBEB] mt-6" />

          {/* News Display */}
          <div
            ref={gridRef}
            className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          >
            {paginatedNews.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="news-card-item block group"
              >
                <NewsCard
                  title={article.title}
                  date={article.publishLabel}
                  description={article.description}
                  type={article.type}
                  author={article.author}
                  slug={article.slug}
                />
              </Link>
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
        <NewsletterSignup />
      </section>
    </main>
  )
}
