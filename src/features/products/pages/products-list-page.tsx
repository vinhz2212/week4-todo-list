import { useMemo, useState, type FormEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Download, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { hasPermission } from "@/features/auth/lib/permissions"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { PageState } from "@/shared/components/page-state"
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../queries/product-queries"
import type { Product } from "../types/product"

const PAGE_SIZE = 5
const formSchema = z.object({
  title: z.string().trim().min(1, "Nhập tên sản phẩm"),
  category: z.string().trim().min(1, "Nhập danh mục"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  stock: z.number().int().min(0, "Số lượng không được âm"),
  description: z.string().trim(),
  thumbnail: z.union([z.url("Đường dẫn ảnh không hợp lệ"), z.literal("")]),
})
type FormValues = z.infer<typeof formSchema>
const emptyForm: FormValues = {
  title: "",
  category: "",
  price: 1,
  stock: 0,
  description: "",
  thumbnail: "",
}

function exportCsv(products: Product[]) {
  const rows = [
    ["ID", "Tên sản phẩm", "Danh mục", "Giá (USD)", "Số lượng", "Trạng thái"],
    ...products.map((item) => [
      item.id,
      item.title,
      item.category,
      item.price,
      item.stock ?? 0,
      (item.stock ?? 0) > 0 ? "Còn hàng" : "Hết hàng",
    ]),
  ]
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    )
    .join("\r\n")
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = "danh-sach-san-pham.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export default function ProductsListPage() {
  const user = useAuthStore((state) => state.user)
  const canWrite = hasPermission(user, "product:write")
  const productsQuery = useProducts({ q: "", limit: 0, skip: 0 })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const [local, setLocal] = useState<Record<number, Product>>({})
  const [deleted, setDeleted] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [imageInputKey, setImageInputKey] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm,
  })
  const products = useMemo(() => {
    const fromApi = productsQuery.data?.products ?? []
    const ids = new Set(fromApi.map((item) => item.id))
    return [
      ...Object.values(local).filter((item) => !ids.has(item.id)),
      ...fromApi.map((item) => local[item.id] ?? item),
    ].filter((item) => !deleted.includes(item.id))
  }, [productsQuery.data, local, deleted])
  const categories = useMemo(
    () => [...new Set(products.map((item) => item.category))].sort(),
    [products]
  )
  const filtered = useMemo(
    () =>
      products.filter(
        (item) =>
          (!search ||
            item.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())) &&
          (!category || item.category === category) &&
          (!status ||
            (status === "in" ? (item.stock ?? 0) > 0 : (item.stock ?? 0) <= 0))
      ),
    [products, search, category, status]
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  function clearForm() {
    setEditingId(null)
    setSelectedImage("")
    setImageInputKey((value) => value + 1)
    reset(emptyForm)
  }
  function startEdit(item: Product) {
    setEditingId(item.id)
    setSelectedImage("")
    setImageInputKey((value) => value + 1)
    reset({
      title: item.title,
      category: item.category,
      price: item.price,
      stock: item.stock ?? 0,
      description: item.description,
      thumbnail: item.thumbnail ?? "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  async function save(values: FormValues) {
    if (!canWrite) return
    try {
      if (editingId !== null) {
        await updateMutation.mutateAsync({ id: editingId, input: values })
        const previous = products.find((item) => item.id === editingId)
        setLocal((current) => ({
          ...current,
          [editingId]: {
            ...previous,
            ...values,
            thumbnail: selectedImage || previous?.thumbnail || "",
            id: editingId,
          } as Product,
        }))
        toast.success("Đã sửa sản phẩm trong phiên này")
      } else {
        const created = await createMutation.mutateAsync(values)
        const id = products.some((item) => item.id === created.id)
          ? Math.max(0, ...products.map((item) => item.id)) + 1
          : created.id
        setLocal((current) => ({
          ...current,
          [id]: {
            ...created,
            ...values,
            thumbnail: selectedImage,
            createdAt: new Date().toISOString(),
            id,
          },
        }))
        toast.success("Đã thêm sản phẩm trong phiên này")
      }
      clearForm()
      setPage(1)
    } catch {
      toast.error("Không lưu được sản phẩm. Vui lòng thử lại.")
    }
  }
  async function remove(item: Product) {
    if (
      !canWrite ||
      !window.confirm(`Xóa “${item.title}” khỏi danh sách trong phiên này?`)
    )
      return
    try {
      await deleteMutation.mutateAsync(item.id)
      setDeleted((current) => [...current, item.id])
      if (editingId === item.id) clearForm()
      toast.success("Đã xóa sản phẩm trong phiên này")
    } catch {
      toast.error("Không xóa được sản phẩm. Vui lòng thử lại.")
    }
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }
  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setSelectedImage("")
      return
    }
    const reader = new FileReader()
    reader.onload = () =>
      setSelectedImage(typeof reader.result === "string" ? reader.result : "")
    reader.readAsDataURL(file)
  }
  const fieldClass = "space-y-1 text-sm font-medium text-slate-700"
  return (
    <div className="space-y-5">
      {canWrite && (
        <section
          className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm"
          aria-labelledby="product-form-title"
        >
          <div className="flex items-center gap-3 border-b border-sky-100 bg-sky-50/70 px-5 py-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Plus size={18} />
            </span>
            <div>
              <h2
                id="product-form-title"
                className="font-semibold text-slate-900"
              >
                {editingId === null ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
              </h2>
              <p className="text-xs text-slate-500">
                Điền đầy đủ thông tin để quản lý sản phẩm.
              </p>
            </div>
          </div>
          <form
            className="grid gap-4 p-5 md:grid-cols-3"
            onSubmit={handleSubmit(save)}
            noValidate
          >
            <label className={fieldClass}>
              Tên sản phẩm <span className="text-red-500">*</span>
              <Input
                placeholder="Nhập tên sản phẩm"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <span className="text-xs text-red-600">
                  {errors.title.message}
                </span>
              )}
            </label>
            <label className={fieldClass}>
              Danh mục <span className="text-red-500">*</span>
              <Input
                placeholder="Chọn danh mục"
                list="product-categories"
                aria-invalid={!!errors.category}
                {...register("category")}
              />
              <datalist id="product-categories">
                {categories.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {errors.category && (
                <span className="text-xs text-red-600">
                  {errors.category.message}
                </span>
              )}
            </label>
            <label className={fieldClass}>
              Giá (USD) <span className="text-red-500">*</span>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Nhập giá sản phẩm"
                aria-invalid={!!errors.price}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <span className="text-xs text-red-600">
                  {errors.price.message}
                </span>
              )}
            </label>
            <label className={fieldClass}>
              Số lượng <span className="text-red-500">*</span>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="Nhập số lượng"
                aria-invalid={!!errors.stock}
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <span className="text-xs text-red-600">
                  {errors.stock.message}
                </span>
              )}
            </label>
            <label className={fieldClass}>
              Mô tả
              <Textarea
                className="min-h-9"
                placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                {...register("description")}
              />
            </label>
            <label className={fieldClass}>
              Hình ảnh
              <Input
                key={imageInputKey}
                type="file"
                accept="image/*"
                onChange={selectImage}
                className="pt-1"
              />
              {selectedImage && (
                <span className="text-xs text-slate-500">
                  Đã chọn ảnh xem trước
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2 pt-1 md:col-span-3">
              <Button
                type="submit"
                disabled={busy}
                className="bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                <Plus size={15} />
                {editingId === null ? "Thêm sản phẩm" : "Lưu thay đổi"}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm}>
                <RotateCcw size={14} />
                Làm mới
              </Button>
            </div>
          </form>
        </section>
      )}
      <section
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="product-list-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="product-list-title"
              className="font-semibold text-slate-900"
            >
              Danh sách sản phẩm
            </h2>
            <p className="text-xs text-slate-500">
              Tổng số {filtered.length} sản phẩm trong hệ thống
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportCsv(filtered)}
            disabled={!filtered.length}
            className="border-blue-100 text-blue-600"
          >
            <Download size={14} />
            Xuất Excel (.csv)
          </Button>
        </div>
        <form
          onSubmit={submitSearch}
          className="grid gap-2 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_1fr_1fr_auto]"
        >
          <Input
            aria-label="Tìm theo tên sản phẩm"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select
            aria-label="Lọc danh mục"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc trạng thái"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="in">Còn hàng</option>
            <option value="out">Hết hàng</option>
          </select>
          <Button
            type="submit"
            className="bg-blue-600 px-4 text-white hover:bg-blue-700"
          >
            <Search size={14} />
            Tìm kiếm
          </Button>
        </form>
        {productsQuery.isPending ? (
          <PageState>
            <PageState.Title>Đang tải sản phẩm...</PageState.Title>
          </PageState>
        ) : productsQuery.isError ? (
          <PageState kind="error">
            <PageState.Title>Không tải được sản phẩm</PageState.Title>
            <PageState.Description>
              {productsQuery.error.message}
            </PageState.Description>
          </PageState>
        ) : filtered.length === 0 ? (
          <PageState>
            <PageState.Title>Không tìm thấy sản phẩm phù hợp.</PageState.Title>
          </PageState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  {[
                    "#",
                    "Hình ảnh",
                    "Tên sản phẩm",
                    "Danh mục",
                    "Giá (USD)",
                    "Số lượng",
                    "Trạng thái",
                    "Ngày tạo",
                    "Thao tác",
                  ].map((label) => (
                    <th key={label} className="px-4 py-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-500">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-2">
                      {item.thumbnail ? (
                        <img
                          className="size-10 rounded-md bg-slate-100 object-contain"
                          src={item.thumbnail}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex size-10 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        to={`/products/${item.id}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {new Intl.NumberFormat("vi-VN").format(item.price)}
                    </td>
                    <td className="px-4 py-3">{item.stock ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${(item.stock ?? 0) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                      >
                        {(item.stock ?? 0) > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.createdAt || item.meta?.createdAt
                        ? new Intl.DateTimeFormat("vi-VN").format(
                            new Date(
                              item.createdAt ?? item.meta?.createdAt ?? ""
                            )
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {canWrite && (
                          <>
                            <Button
                              type="button"
                              size="icon-sm"
                              aria-label={`Sửa ${item.title}`}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => startEdit(item)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              aria-label={`Xóa ${item.title}`}
                              className="bg-red-500 text-white hover:bg-red-600"
                              disabled={busy}
                              onClick={() => remove(item)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>
            Hiển thị {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} /{" "}
            {filtered.length} sản phẩm
          </span>
          <nav
            aria-label="Phân trang sản phẩm"
            className="flex items-center gap-1"
          >
            <Button
              size="xs"
              type="button"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Trước
            </Button>
            {Array.from({ length: pages }, (_, index) => index + 1)
              .filter(
                (number) =>
                  number === 1 ||
                  number === pages ||
                  Math.abs(number - currentPage) <= 1
              )
              .map((number) => (
                <Button
                  key={number}
                  size="xs"
                  type="button"
                  variant={number === currentPage ? "default" : "outline"}
                  className={
                    number === currentPage ? "bg-blue-600 text-white" : ""
                  }
                  onClick={() => setPage(number)}
                >
                  {number}
                </Button>
              ))}
            <Button
              size="xs"
              type="button"
              variant="outline"
              disabled={currentPage >= pages}
              onClick={() => setPage(currentPage + 1)}
            >
              Sau
            </Button>
          </nav>
        </div>
      </section>
      <p className="text-xs text-slate-500">
        API demo không lưu thay đổi lâu dài. Sản phẩm vừa thêm, sửa hoặc xóa chỉ
        được giữ trong phiên mở trang này.
      </p>
    </div>
  )
}
