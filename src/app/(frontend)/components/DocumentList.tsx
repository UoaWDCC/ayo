'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Link } from '@/payload-types'
import StaggerReveal from './StaggerReveal'
import { safeHref } from '@/lib/urls'

const PAGE_SIZE = 5

type DocumentListProps = {
  /** Section heading, from the page's member-section block. Omitted when unset. */
  title?: string
  /** Italic line under the heading, from the same block. Omitted when unset. */
  subtitle?: string
  documents: Link[]
  /** Class the section reveal animates — each section uses its own. */
  fadeClass: string
  /** Adds the search box, the document count and pagination. */
  searchable?: boolean
  /** Shows each document's last-updated date at the right of its row. */
  showDate?: boolean
  className?: string
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-NZ').format(new Date(dateString))
}

/**
 * A bordered list of external document links from the Payload `link` collection,
 * used by My AYO's Resources and Links sections.
 */
export default function DocumentList({
  title,
  subtitle,
  documents,
  fadeClass,
  searchable = false,
  showDate = false,
  className = 'py-12.5',
}: DocumentListProps) {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const filtered = documents.filter(
    (doc) =>
      safeHref(doc.url, { allowSitePath: true }) &&
      doc.name.toLowerCase().includes(query.toLowerCase()),
  )
  const totalPages = searchable ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)) : 1
  const pageItems = searchable
    ? filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : filtered

  return (
    <section className="bg-white w-full">
      <div className={`mx-8 md:mx-20 lg:mx-24 xl:mx-32 ${className}`}>
        <StaggerReveal fadeClass={fadeClass}>
          {title && (
            <h2
              className={`${fadeClass} font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]`}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`${fadeClass} mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic`}>
              {subtitle}
            </p>
          )}

          {searchable && (
            <div
              className={`${fadeClass} flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]`}
            >
              <span className="text-[#B2B2B2]">
                Showing <span className="font-semibold text-black">{filtered.length}</span> document
                {filtered.length === 1 ? '' : 's'}
              </span>
              <div className="lg:ml-auto flex items-center gap-2.5 border border-[#EBEBEB] px-4 py-2.5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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
                  type="search"
                  placeholder="Search..."
                  aria-label={title ? `Search ${title.toLowerCase()}` : 'Search documents'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="outline-none bg-transparent placeholder:text-[#B2B2B2]"
                />
              </div>
            </div>
          )}

          <ul className={`${fadeClass} border-t border-[#EBEBEB] mt-6`}>
            {pageItems.map((doc) => (
              <li key={doc.id} className="border-b border-[#EBEBEB]">
                <a
                  href={safeHref(doc.url, { allowSitePath: true })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-6 px-4 py-5 md:px-6 transition-colors hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-[16px] leading-5.5 md:text-[18px] md:leading-6.5 transition-opacity hover:opacity-70">
                    <span className="underline">{doc.name}</span>
                    <Image
                      src="/arrow-up-right.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden="true"
                      className="h-[1em] w-[1em] shrink-0"
                    />
                  </span>
                  {showDate && (
                    <span className="shrink-0 text-[15px] leading-[18px] text-[#B2B2B2]">
                      {formatDate(doc.updatedAt)}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </StaggerReveal>

        {pageItems.length === 0 && (
          <p className="py-6 text-[15px] leading-[18px] text-[#B2B2B2] italic">
            {query ? 'No documents match your search.' : 'No documents yet.'}
          </p>
        )}

        {searchable && (
          <div className="flex items-center justify-between mt-12 text-[15px] leading-[18px]">
            <div className="flex gap-12">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="underline disabled:no-underline disabled:opacity-40 disabled:cursor-default cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="underline disabled:no-underline disabled:opacity-40 disabled:cursor-default cursor-pointer"
              >
                Next
              </button>
            </div>
            <span className="font-normal">
              {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
