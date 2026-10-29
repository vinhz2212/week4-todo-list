import { apiClient } from "@/core/lib/api-client"
import type {
  Product,
  ProductInput,
  ProductListResponse,
  ProductUpdate,
} from "../types/product"

interface ProductQuery {
  q?: string
  limit?: number
  skip?: number
}

export const productService = {
  async getAll(query: ProductQuery = {}): Promise<ProductListResponse> {
    const q = query.q?.trim()
    const response = await apiClient.get<ProductListResponse>(
      q ? "/products/search" : "/products",
      {
        params: {
          ...(q ? { q } : {}),
          limit: query.limit,
          skip: query.skip,
        },
      }
    )
    return response.data
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async create(input: ProductInput): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", input)
    return response.data
  },

  async update(id: number, input: ProductUpdate): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, input)
    return response.data
  },

  async delete(id: number): Promise<Product & { isDeleted: boolean }> {
    const response = await apiClient.delete<Product & { isDeleted: boolean }>(
      `/products/${id}`
    )
    return response.data
  },
}
