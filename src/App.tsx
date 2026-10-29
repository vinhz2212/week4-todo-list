import { Link, Route, Routes } from "react-router-dom"
import ProtectedRoute from "@/features/auth/components/protected-route"
import LoginPage from "@/features/auth/pages/login-page"
import ForbiddenPage from "@/features/auth/pages/forbidden-page"
import CartPage from "@/features/cart/pages/cart-page"
import TodoListPage from "@/features/todo-list/pages/todo-list-page"
import ProductDetailPage from "@/features/products/pages/product-detail-page"
import ProductFormPage from "@/features/products/pages/product-form-page"
import ProductsLayout from "@/features/products/pages/products-layout"
import ProductsListPage from "@/features/products/pages/products-list-page"

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
  )
}
