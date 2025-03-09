
import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./Button"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  className,
  ...props
}: PaginationProps) => {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === pageCount

  const getPageNumbers = () => {
    const visiblePageCount = 5
    const pageNumbers: number[] = []

    if (pageCount <= visiblePageCount) {
      for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }

    const middlePage = Math.ceil(visiblePageCount / 2)
    let startPage = Math.max(1, currentPage - middlePage + 1)
    let endPage = Math.min(pageCount, startPage + visiblePageCount - 1)

    if (endPage - startPage + 1 < visiblePageCount) {
      startPage = Math.max(1, endPage - visiblePageCount + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()
  const visiblePageCount = 5

  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={isFirstPage}
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
        {pageNumbers[0] !== 1 + 1 && pageCount > visiblePageCount && (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
        {pageNumbers.map((page) =>
          page === 1 || page === pageCount ? null : (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        {pageNumbers[pageNumbers.length - 1] !== pageCount - 1 &&
          pageCount > visiblePageCount && (
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        {pageCount > 1 && (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageCount)}
            disabled={isLastPage}
          >
            {pageCount}
          </Button>
        )}
      </div>
    </div>
  )
}

export { Pagination }
