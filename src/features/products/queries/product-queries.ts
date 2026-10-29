import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { productService } from "../services/product-service"
import type { ProductInput, ProductUpdate } from "../types/product"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (query: { q: string; limit: number; skip: number }) =>
    [...productKeys.lists(), query] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

export function useProducts(query: { q: string; limit: number; skip: number }) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productService.getAll(query),
  })
}

export function useProduct(id: number, enabled = true) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: enabled && Number.isInteger(id) && id > 0,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) => productService.create(input),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product)
      return queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductUpdate }) =>
      productService.update(id, input),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product)
      return queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({
        queryKey: productKeys.detail(id),
        exact: true,
      })
      return queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
