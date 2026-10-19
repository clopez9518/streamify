import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { getPagesPagination } from "@/helpers/getPagesPagination.helper"

interface PaginationProps {
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
}

export const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) => {

  const { pages, lastVisiblePage, firstVisiblePage } = getPagesPagination(page, totalPages)

  const baseButtonClass = "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition"
  const inactiveButtonClass = "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
  const activeButtonClass = "border-white bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
  const disabledButtonClass = "cursor-not-allowed border-white/5 bg-white/5 text-white/30 opacity-45"

  return (
    <nav className="flex items-center justify-center px-6 pt-4 text-white md:px-12">
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-8">
        <button
          aria-label="Previous page"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          className={`${baseButtonClass} ${hasPreviousPage ? inactiveButtonClass : disabledButtonClass}`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {firstVisiblePage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${baseButtonClass} ${inactiveButtonClass}`}
            >
              1
            </button>
            <span className="px-1 text-sm text-white/40">...</span>
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${baseButtonClass} ${p === page ? activeButtonClass : inactiveButtonClass}`}
          >
            {p}
          </button>
        ))}

        {lastVisiblePage < totalPages && (
          <>
            <span className="px-1 text-sm text-white/40">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`${baseButtonClass} ${inactiveButtonClass}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          aria-label="Next page"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className={`${baseButtonClass} ${hasNextPage ? inactiveButtonClass : disabledButtonClass}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
