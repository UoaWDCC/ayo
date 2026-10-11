'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown'
import NewsCard from '../components/NewsCard'
import StaggerReveal from '../components/StaggerReveal'

gsap.registerPlugin(ScrollTrigger)

export type NewsListArticle = {
  id: string | number
  slug: string
  type: string
  title: string
  publishLabel: string
  publishDate: string
  description: string
  author: string
  image?: string | null
}

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

export default function NewsListClient({ articles }: { articles: NewsListArticle[] }) {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [showCount, setShowCount] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const newsTypes = ['All', ...new Set(articles.map((a) => a.type))]
  const years = [
    'All',
    ...new Set(
      articles
        .map((a) => new Date(a.publishDate).getFullYear().toString())
        .filter((y) => y !== 'NaN'),
    ),
  ]

  const filteredNews = articles.filter((article) => {
    const date = new Date(article.publishDate)
    const articleYear = date.getFullYear().toString()
    const articleMonth = months[date.getMonth() + 1]
    const typeMatch = selectedType === 'All' || article.type === selectedType
    const yearMatch = selectedYear === 'All' || articleYear === selectedYear
    const monthMatch = selectedMonth === 'All' || articleMonth === selectedMonth
    return typeMatch && yearMatch && monthMatch
  })

  const sortedNews = useMemo(() => {
    return [...filteredNews].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    )
  }, [filteredNews])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedYear, selectedMonth, showCount, searchInput])

  const searchedNews = sortedNews.filter(
    (article) =>
      article.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      article.description.toLowerCase().includes(searchInput.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(searchedNews.length / showCount))
  const paginatedNews = searchedNews.slice((currentPage - 1) * showCount, currentPage * showCount)

  const gridRef = useRef<HTMLDivElement>(null)
  const isFirstGridRender = useRef(true)

  useEffect(() => {
    if (!gridRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

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

    // Re-entry after a filter/search change is shorter than the first reveal.
    gsap.killTweensOf(cards)
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', overwrite: true },
    )
  }, [paginatedNews])

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
        <StaggerReveal fadeClass="news-list-fade">
          <h2 className="news-list-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] text-black">
            Latest News
          </h2>
          <p className="news-list-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
            Newsletters, interviews and behind-the-scenes stories from across the orchestra.
          </p>

          {/* Controls */}
          <div className="news-list-fade relative z-30 flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
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
        </StaggerReveal>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Article Cards Grid */}
        <div
          ref={gridRef}
          className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
        >
          {paginatedNews.map((article) => (
            <div key={article.id} className="news-card-item">
              <NewsCard
                title={article.title}
                date={article.publishLabel}
                description={article.description}
                type={article.type}
                author={article.author}
                slug={article.slug}
                image={article.image}
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
