import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { productService } from "../services/product-service"
import type { Product } from "../types/product"

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)
  const location = useLocation()
  const navigate = useNavigate()
  const routeProduct = (location.state as { product?: Product } | null)?.product
  const [product, setProduct] = useState<Product | null>(
    routeProduct?.id === id ? routeProduct : null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setProduct(null)

    if (!Number.isInteger(id) || id < 1) {
      setIsLoading(false)
      setError("Mã sản phẩm không hợp lệ.")
      return
    }

    if (routeProduct?.id === id) {
      setProduct(routeProduct)
      setIsLoading(false)
      return
    }

    let isActive = true

    productService
      .getById(id)
      .then((result) => {
        if (isActive) setProduct(result)
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Đã xảy ra lỗi khi tải sản phẩm."
          )
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [id, routeProduct])

  async function handleDelete() {
    if (!product) return

    setIsDeleting(true)
    setDeleteError(null)
    try {
      await productService.delete(product.id)
      toast.success("API đã nhận yêu cầu xóa sản phẩm.")
      navigate("/products")
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể xóa sản phẩm."
      )
    } finally {
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Chi tiết sản phẩm</h2>
      {isLoading ? (
        <p role="status" className="rounded-lg border p-5 text-sm">
          Đang tải sản phẩm...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-lg border border-destructive p-5 text-sm">
          {error}
        </p>
      ) : product ? (
        <>
          <article className="space-y-3 rounded-lg border p-5">
            {product.thumbnail ? (
              <img
                className="h-48 w-full rounded-md bg-muted object-contain"
                src={product.thumbnail}
                alt={product.title}
              />
            ) : (
              <div className="grid h-32 place-items-center rounded-md bg-muted text-sm text-muted-foreground">
                Không có hình ảnh
              </div>
            )}
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p>{product.description}</p>
            <p className="font-medium">${product.price.toFixed(2)}</p>
          </article>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate(`/products/${product.id}/edit`)}>
              Sửa sản phẩm
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              Xóa sản phẩm
            </Button>
          </div>
        </>
      ) : null}
      <div className="flex gap-4 text-sm">
        <Link className="underline" to="/products">
          Quay lại danh sách
        </Link>
      </div>
      {deleteError && (
        <p role="alert" className="text-sm text-destructive">
          {deleteError}
        </p>
      )}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm?</DialogTitle>
            <DialogDescription>
              Bạn sắp gửi yêu cầu xóa “{product?.title}”.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
