'use client'
import { useState } from 'react'

export default function BlogsPagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

  return (
    <div className="border-t border-[#EBEBEB] pt-5 flex justify-end gap-6 items-center">
      {/* border colour is from figma */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="underline"
      >
        Previous
      </button>
      <span className="px-6">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="underline"
      >
        Next
      </button>
    </div>
  )
}
