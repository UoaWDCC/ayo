'use client'

import { useState } from 'react'

type Resource = {
  name: string
  date: string
  href: string
}

const RESOURCES: Resource[] = [
  { name: 'AYO_Player_Handbook.pdf', date: '27/06/2026', href: '/sample.pdf' },
  { name: 'AYO_Rehearsal_Schedule.pdf', date: '07/06/2026', href: '/sample.pdf' },
  { name: 'AYO_Concert_Calendar.pdf', date: '18/04/2026', href: '/sample.pdf' },
  { name: 'AYO_Rehearsal_Etiquette.pdf', date: '28/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Attendance_Policy.pdf', date: '17/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Health_and_Safety_Guide.pdf', date: '05/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Audition_Information.pdf', date: '05/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Contact_Directory.pdf', date: '28/02/2026', href: '/sample.pdf' },
]

const PAGE_SIZE = 5

export default function ResourcesSection() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filtered = RESOURCES.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="px-6 sm:px-12 lg:px-24 py-12">
      <h2 className="font-semibold text-3xl sm:text-4xl text-black mb-8">Resources</h2>

      <div className="flex flex-col w-full sm:max-w-sm mb-6">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
          className="w-full border-0 border-b border-black bg-transparent text-sm text-black placeholder-black pb-1 focus:outline-none"
        />
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
            <span className="flex items-center gap-2 text-sm text-black underline">
              {resource.name}
              <svg
                width="10"
                height="10"
                viewBox="0 0 13 13"
                fill="none"
                className="rotate-180 transition-transform group-hover:rotate-0"
              >
                <path
                  d="M2 2L11 11M11 11V3M11 11H3"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xs text-[#858585]">{resource.date}</span>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-sm text-[#B2B2B2]">No documents match your search.</p>
      )}

      <div className="flex items-center justify-between pt-4 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="underline text-[#B2B2B2] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-black">
          {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="underline text-[#B2B2B2] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  )
}
