'use client'
// client component
import { useEffect, useMemo, useState } from 'react'
import NewsCard from '../components/NewsCard'

export type NewsListArticle = {
  id: string | number
  slug: string
  type: string
  title: string
  publishLabel: string
  publishDate: string
  description: string
  author: string
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

  // dynamically generate available types and years from articles
  const newsTypes = ['All', ...new Set(articles.map((a) => a.type))]
  const years = [
    'All',
    ...new Set(
      articles
        .map((a) => new Date(a.publishDate).getFullYear().toString())
        .filter((y) => y !== 'NaN'),
    ),
  ]

  // Filter News
  const filteredNews = articles.filter((article) => {
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
  const totalPages = Math.max(1, Math.ceil(sortedNews.length / showCount))
  const paginatedNews = searchedNews.slice((currentPage - 1) * showCount, currentPage * showCount)

  return (
    <section className="bg-white w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-[116px] pb-[64px]">
        <h2 className="font-semibold text-[40px] leading-[48px] text-black">News</h2>

        {/* Filter Controls */}
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

          {/* Show */}
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

          {/* search bar */}
          <div className="flex items-center gap-2 border">
            <input
              type="text"
              placeholder="search..."
              onChange={(e) => setSearchInput(e.target.value)}
            ></input>
          </div>
        </div>

        <hr className="border-[#EBEBEB] mt-6" />

        {/* News Display */}
        <div>
          <div className="w-full flex flex-wrap">
            {paginatedNews.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                date={article.publishLabel}
                description={article.description}
                type={article.type}
                author={article.author}
                slug={article.slug}
              />
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
