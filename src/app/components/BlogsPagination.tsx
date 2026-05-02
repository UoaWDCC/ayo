'use client'
import { useState } from 'react'

export default function BlogsPagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

  return (
    <div>
      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        {currentPage} of {totalPages}
      </span>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  )
}
