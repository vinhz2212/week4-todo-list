import { Button } from "@/core/components/ui/button"

interface PaginationBarProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Phân trang"
      className="flex items-center justify-center gap-3"
    >
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Trước
      </Button>
      <span className="text-sm text-muted-foreground">
        Trang {page}/{totalPages}
      </span>
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </Button>
    </nav>
  )
}
