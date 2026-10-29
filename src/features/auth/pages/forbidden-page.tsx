import { Link } from "react-router-dom"

export default function ForbiddenPage() {
  return (
    <main className="mx-auto max-w-xl space-y-3 p-8">
      <h1 className="text-2xl font-semibold">Bạn chưa có quyền truy cập</h1>
      <p className="text-sm text-muted-foreground">
        Tài khoản hiện tại chỉ xem được sản phẩm. Chức năng quản lý yêu cầu vai
        trò admin hoặc moderator.
      </p>
      <Link className="underline" to="/products">
        Quay lại danh sách sản phẩm
      </Link>
    </main>
  )
}
