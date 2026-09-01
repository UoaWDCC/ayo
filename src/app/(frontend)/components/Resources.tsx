'use client'

import { useState, useEffect } from 'react'
import type { Link } from '@/payload-types'
import { getResources } from '@/app/actions/resources'

const PAGE_SIZE = 5

export default function ResourcesSection() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const [RESOURCES, setResources] = useState<Link[]>([])

  // fetch resources using local api
  useEffect(() => {
    async function fetchData() {
      const response = await getResources()
      setResources(response.docs)
    }
    fetchData()
  })
  const totalPages = Math.max(1, Math.ceil(RESOURCES.length / PAGE_SIZE))
  const pageItems = RESOURCES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-12 pb-[64px]">
      <h2 className="font-semibold text-[40px] leading-[48px] text-black mb-[22px]">Resources</h2>

      <div className="flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
        <div className="flex flex-col w-full sm:w-auto sm:flex-1 sm:max-w-sm">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            className="w-full border-0 border-b border-black bg-transparent text-[15px] leading-[18px] text-black placeholder-black pb-2 focus:outline-none"
          />
        </div>
        <span className="text-[15px] leading-[18px] text-[#B7B7B7] italic sm:ml-auto">
          Showing {RESOURCES.length} document{RESOURCES.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="border-t border-[#EBEBEB]">
        {pageItems.map((resource) => (
          <a
            key={resource.name}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border-b border-[#EBEBEB] py-4 group"
          >
            <span className="flex items-center gap-2 text-[15px] leading-[18px] text-black underline">
              {resource.name}
            </span>
            <span className="text-[13px] leading-[16px] text-[#858585]">{resource.date}</span>
          </a>
        ))}
      </div>

      {RESOURCES.length === 0 && (
        <p className="py-6 text-sm text-[#B2B2B2]">No documents match your search.</p>
      )}

      <div className="flex items-center justify-between pt-8 text-[15px] leading-[18px]">
        <div className="flex gap-12">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`underline ${page === 0 ? 'text-[#B2B2B2] cursor-not-allowed' : 'text-black'}`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={`underline ${page >= totalPages - 1 ? 'text-[#B2B2B2] cursor-not-allowed' : 'text-black'}`}
          >
            Next
          </button>
        </div>
        <span className="text-black">
          {page + 1} of {totalPages}
        </span>
      </div>
    </section>
  )
}
