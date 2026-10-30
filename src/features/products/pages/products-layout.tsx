import { Link, Outlet } from "react-router-dom"
import { Package } from "lucide-react"
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
    <main className="min-h-screen bg-slate-50/70 px-4 py-5 sm:px-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Package size={22} />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Quản lý sản phẩm
              </h1>
              <p className="text-xs text-slate-500">
                Thêm mới, chỉnh sửa và quản lý danh sách sản phẩm
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <Link className="hover:text-blue-600" to="/">
              Trang chủ
            </Link>
            <span>/</span>
            <Link className="hover:text-blue-600" to="/products">
              Sản phẩm
            </Link>
            <Link className="hover:text-blue-600" to="/cart">
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
        <Outlet />
      </div>
    </main>
  )
}
