import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { productService } from "../services/product-service"
import {
  productFormSchema,
  type ProductFormValues,
} from "../types/product"

interface ProductFormPageProps {
  mode: "create" | "edit"
}

export default function ProductFormPage({ mode }: ProductFormPageProps) {
  const { productId } = useParams<{ productId: string }>()
  const isEditing = mode === "edit"
  const id = Number(productId)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { title: "", description: "", category: "", price: 1 },
  })

  useEffect(() => {
    if (!isEditing) return

    if (!Number.isInteger(id) || id < 1) {
      setPageError("Mã sản phẩm không hợp lệ.")
      setIsLoading(false)
      return
    }

    let isActive = true

    productService
      .getById(id)
      .then((product) => {
        if (!isActive) return
        reset({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
        })
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setPageError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải sản phẩm."
          )
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [id, isEditing, reset])

  async function onSubmit(values: ProductFormValues) {
    setIsSaving(true)
    setPageError(null)

    try {
      const product = isEditing
        ? await productService.update(id, values)
        : await productService.create(values)
      toast.success(
        isEditing
          ? "Đã gửi yêu cầu cập nhật đến API demo."
          : "Đã gửi yêu cầu tạo đến API demo."
      )
      navigate(`/products/${product.id}`, { state: { product } })
    } catch (requestError) {
      setPageError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu sản phẩm."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">
        {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>
      {isLoading ? (
        <p role="status" className="rounded-lg border p-5 text-sm">
          Đang tải dữ liệu sản phẩm...
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          {pageError && (
            <p role="alert" className="rounded-lg border border-destructive p-3 text-sm">
              {pageError}
            </p>
          )}
          <div className="grid gap-2">
            <label htmlFor="product-title" className="text-sm font-medium">
              Tên sản phẩm
            </label>
            <Input
              id="product-title"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title && (
              <p role="alert" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="product-description" className="text-sm font-medium">
              Mô tả
            </label>
            <Textarea
              id="product-description"
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            {errors.description && (
              <p role="alert" className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="product-category" className="text-sm font-medium">
              Danh mục
            </label>
            <Input
              id="product-category"
              aria-invalid={Boolean(errors.category)}
              {...register("category")}
            />
            {errors.category && (
              <p role="alert" className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="product-price" className="text-sm font-medium">
              Giá (USD)
            </label>
            <Input
              id="product-price"
              type="number"
              min="0.01"
              step="0.01"
              aria-invalid={Boolean(errors.price)}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p role="alert" className="text-sm text-destructive">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
