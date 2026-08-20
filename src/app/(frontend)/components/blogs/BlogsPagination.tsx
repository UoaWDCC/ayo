'use client'

type BlogsPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function BlogsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogsPaginationProps) {
  return (
    <div className="border-t border-[#EBEBEB] pt-5 flex justify-between items-center">
      <div className="flex gap-6 underline">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <span className="px-6">
        {currentPage} of {totalPages}
      </span>
    </div>
  )
}
