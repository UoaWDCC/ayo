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
    <div className="border-t border-[#EBEBEB] pt-5 flex justify-end gap-6 items-center">
      {/* border colour is from figma */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="underline underline-offset-3 hover:text-muted transition-colors"
      >
        Previous
      </button>
      <span className="px-6">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="underline underline-offset-3 hover:text-muted transition-colors"
      >
        Next
      </button>
    </div>
  )
}
