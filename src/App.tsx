import { lazy, Suspense } from "react"
import { Link, Route, Routes } from "react-router-dom"

const TodoListPage = lazy(
  () => import("@/features/todo-list/pages/todo-list-page")
)
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"))
const ForbiddenPage = lazy(() => import("@/features/auth/pages/forbidden-page"))
const ProtectedRoute = lazy(
  () => import("@/features/auth/components/protected-route")
)
const CartPage = lazy(() => import("@/features/cart/pages/cart-page"))
const ProductDetailPage = lazy(
  () => import("@/features/products/pages/product-detail-page")
)
const ProductFormPage = lazy(
  () => import("@/features/products/pages/product-form-page")
)
const ProductsLayout = lazy(
  () => import("@/features/products/pages/products-layout")
)
const ProductsListPage = lazy(
  () => import("@/features/products/pages/products-list-page")
)

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl space-y-3 p-8">
      <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
      <Link className="underline" to="/products">
        Về danh sách sản phẩm
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl p-8">
          <p role="status" className="text-sm text-muted-foreground">
            Đang tải trang...
          </p>
        </main>
      }
    >
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsLayout />}>
            <Route index element={<ProductsListPage />} />
            <Route path=":productId" element={<ProductDetailPage />} />
            <Route element={<ProtectedRoute roles={["admin", "moderator"]} />}>
              <Route path="new" element={<ProductFormPage mode="create" />} />
              <Route
                path=":productId/edit"
                element={<ProductFormPage mode="edit" />}
              />
            </Route>
          </Route>
          <Route path="/cart" element={<CartPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
