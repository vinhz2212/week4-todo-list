import { Link, Outlet } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/core/components/ui/button"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { useCartStore } from "@/features/cart/store/cart-store"

export default function ProductsLayout() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const cartCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  )

  function handleLogout() {
    clearSession()
    queryClient.clear()
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Tuần 5 · Router & API</p>
          <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link className="underline" to="/">
            To-do tuần 4
          </Link>
          <Link className="underline" to="/products">
            Sản phẩm
          </Link>
          <Link className="underline" to="/cart">
            Giỏ hàng ({cartCount})
          </Link>
          <span className="text-muted-foreground">
            {user?.firstName} · {user?.role ?? "user"}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </nav>
      </header>
      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        Tuần 6 · TanStack Query, xác thực, phân quyền và state dùng chung bằng
        Zustand. API demo mô phỏng thao tác ghi, nên thay đổi sản phẩm không
        được lưu lâu dài.
      </p>
      <Outlet />
    </main>
  )
}
