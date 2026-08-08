'use client'

import { useEffect, useMemo, useState } from 'react'
import NewsCard from '../components/NewsCard'

const news = [
  {
    id: 1,
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

export default function newsPage() {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [showCount, setShowCount] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)

  // Dynamically generate available types
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

  // Sort News
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    )
  }, [filteredNews])

  // Reset page when controls change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedYear, selectedMonth, showCount])

  // Pagination
  const totalPages = Math.ceil(sortedNews.length / showCount)

  const paginatedNews = sortedNews.slice((currentPage - 1) * showCount, currentPage * showCount)

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-[116px] pb-[64px]">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">News</h2>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
          {/* Year */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Year</label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {years.map((year) => (
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

          {/* Type */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Type</label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              {newsTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Showing */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Show</label>

            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              <option>6</option>
              <option>12</option>
              <option>18</option>
              <option>24</option>
            </select>
          </div>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Table */}
        <div>
          <div className="w-full flex flex-wrap">
            {paginatedNews.map((article, index) => (
              <div key={article.id}>
                <NewsCard
                  title={article.title}
                  date={article.publishLabel}
                  description={article.description}
                  type={article.type}
                  author={article.author}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-[15px] leading-[18px]">
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
