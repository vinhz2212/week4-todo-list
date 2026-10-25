import { z } from "zod"

export const productFormSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(120),
  description: z.string().trim().min(1, "Vui lòng nhập mô tả sản phẩm"),
  category: z.string().trim().min(1, "Vui lòng nhập danh mục"),
  price: z.number().positive("Giá phải lớn hơn 0"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  rating?: number
  stock?: number
  thumbnail?: string
  images?: string[]
}

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductInput = ProductFormValues

export type ProductUpdate = Partial<ProductInput>
