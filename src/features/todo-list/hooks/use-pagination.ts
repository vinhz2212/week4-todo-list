import { useMemo, useState } from "react"

// Dùng lại được cho bất kỳ danh sách nào.
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  // Giới hạn trang để xóa hết việc ở trang cuối không bị rơi vào trang trống.
  const activePage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => items.slice((activePage - 1) * pageSize, activePage * pageSize),
    [activePage, items, pageSize]
  )

  return { activePage, totalPages, pageItems, setPage }
}
