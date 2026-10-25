import { Link, Outlet } from "react-router-dom"

export default function ProductsLayout() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Tuần 5 · Router & API</p>
          <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link className="underline" to="/">
            To-do tuần 4
          </Link>
          <Link className="underline" to="/products">
            Sản phẩm
          </Link>
        </nav>
      </header>
      <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        Đang dùng API demo: tạo, sửa và xóa chỉ mô phỏng, dữ liệu không được lưu lâu dài.
      </p>
      <Outlet />
    </main>
  )
}
