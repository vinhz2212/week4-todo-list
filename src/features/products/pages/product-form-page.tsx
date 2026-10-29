import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { PageState } from "@/shared/components/page-state"
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from "../queries/product-queries"
import { productFormSchema, type ProductFormValues } from "../types/product"

interface ProductFormPageProps {
  mode: "create" | "edit"
}

export default function ProductFormPage({ mode }: ProductFormPageProps) {
  const { productId } = useParams<{ productId: string }>()
  const isEditing = mode === "edit"
  const id = Number(productId)
  const validId = Number.isInteger(id) && id > 0
  const navigate = useNavigate()
  const productQuery = useProduct(id, isEditing && validId)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isSaving = createMutation.isPending || updateMutation.isPending
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
    if (!isEditing || !productQuery.data) return
    reset({
      title: productQuery.data.title,
      description: productQuery.data.description,
      category: productQuery.data.category,
      price: productQuery.data.price,
    })
  }, [isEditing, productQuery.data, reset])

  async function onSubmit(values: ProductFormValues) {
    try {
      const product = isEditing
        ? await updateMutation.mutateAsync({ id, input: values })
        : await createMutation.mutateAsync(values)
      toast.success(
        isEditing
          ? "Đã gửi yêu cầu cập nhật đến API demo."
          : "Đã gửi yêu cầu tạo đến API demo."
      )
      navigate(`/products/${product.id}`)
    } catch {
      // Mutation errors are rendered beside the form.
    }
  }

  const pageError =
    !validId && isEditing
      ? "Mã sản phẩm không hợp lệ."
      : productQuery.isError
        ? productQuery.error.message
        : (createMutation.error?.message ?? updateMutation.error?.message)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">
        {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>
      {isEditing && productQuery.isPending && validId ? (
        <PageState>
          <PageState.Title>Đang tải dữ liệu sản phẩm...</PageState.Title>
        </PageState>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          {pageError && (
            <PageState kind="error">
              <PageState.Title>{pageError}</PageState.Title>
            </PageState>
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
            <label
              htmlFor="product-description"
              className="text-sm font-medium"
            >
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
            <Button type="submit" disabled={isSaving || Boolean(pageError)}>
              {isSaving
                ? "Đang lưu..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
