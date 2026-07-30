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
    type: 'Newsletter',
    title: 'AYO Newsletter - May, 2026',
    publishLabel: 'Sun. 21 June',
    publishDate: '2026-05-20T23:59:00+12:00',
    description:
      'A programme shaped by the vivid colour of Georges Bizet, the expressive voice of Antonin Dvorak, and the modern energy of Emmanuel Sejourne, bringing together tradition and contemporary sound in one performance.',
    linkUrl: '#',
    author: 'Mary Lin',
  },
]

export default function newsPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedType, setSelectedType] = useState('All')
  const [showCount, setShowCount] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  // Dynamically generate available types
  const newsTypes = ['All', ...new Set(news.map((news) => news.type))]

  // Filter News
  const filteredNews =
    selectedType === 'All' ? news : news.filter((opp) => opp.type === selectedType)

  // Sort News
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })
  }, [filteredNews, sortOrder])

  // Reset page when controls change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, sortOrder, showCount])

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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4"
            >
              <option>2026</option>
            </select>
          </div>

          {/* Month */}
          <div className="flex items-center gap-2">
            <label className="text-[#B2B2B2]">Month</label>

            <select className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4">
              <option value="asc">June</option>
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

            <select className="font-semibold text-black bg-transparent outline-none appearance-none cursor-pointer pr-4">
              <option>5</option>
            </select>
          </div>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* Table */}
        <div>
          <NewsCard />
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
