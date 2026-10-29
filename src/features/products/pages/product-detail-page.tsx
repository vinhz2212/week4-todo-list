import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
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
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { useCartStore } from "@/features/cart/store/cart-store"
import { PageState } from "@/shared/components/page-state"
import { useDeleteProduct, useProduct } from "../queries/product-queries"

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = Number(productId)
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const validId = Number.isInteger(id) && id > 0
  const productQuery = useProduct(id)
  const deleteMutation = useDeleteProduct()
  const addToCart = useCartStore((state) => state.add)
  const product = productQuery.data

  async function handleDelete() {
    if (!product) return
    try {
      await deleteMutation.mutateAsync(product.id)
      toast.success("API đã nhận yêu cầu xóa sản phẩm.")
      navigate("/products")
    } catch {
      // The mutation error is rendered below.
    } finally {
      setIsDeleteOpen(false)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Chi tiết sản phẩm</h2>
      {!validId ? (
        <PageState kind="error">
          <PageState.Title>Mã sản phẩm không hợp lệ.</PageState.Title>
        </PageState>
      ) : productQuery.isPending ? (
        <PageState>
          <PageState.Title>Đang tải sản phẩm...</PageState.Title>
        </PageState>
      ) : productQuery.isError ? (
        <PageState kind="error">
          <PageState.Title>Không tải được sản phẩm</PageState.Title>
          <PageState.Description>
            {productQuery.error.message}
          </PageState.Description>
        </PageState>
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
            <PermissionGate permission="product:write">
              <Button
                variant="outline"
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                Sửa sản phẩm
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                Xóa sản phẩm
              </Button>
            </PermissionGate>
            <Button
              variant="secondary"
              onClick={() => {
                addToCart(product)
                toast.success("Đã thêm sản phẩm vào giỏ hàng.")
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </>
      ) : null}
      <div className="flex gap-4 text-sm">
        <Link className="underline" to="/products">
          Quay lại danh sách
        </Link>
      </div>
      {deleteMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {deleteMutation.error.message}
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
              disabled={deleteMutation.isPending}
              onClick={() => setIsDeleteOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
