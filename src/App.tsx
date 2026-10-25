import { Link, Route, Routes } from "react-router-dom"
import TodoListPage from "@/modules/todo-list/pages/todo-list-page"
import ProductDetailPage from "@/modules/products/pages/product-detail-page"
import ProductFormPage from "@/modules/products/pages/product-form-page"
import ProductsLayout from "@/modules/products/pages/products-layout"
import ProductsListPage from "@/modules/products/pages/products-list-page"

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
      <Route path="/products" element={<ProductsLayout />}>
        <Route index element={<ProductsListPage />} />
        <Route path="new" element={<ProductFormPage mode="create" />} />
        <Route path=":productId" element={<ProductDetailPage />} />
        <Route
          path=":productId/edit"
          element={<ProductFormPage mode="edit" />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
