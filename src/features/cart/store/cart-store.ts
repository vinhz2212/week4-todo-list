import { create } from "zustand"
import type { Product } from "@/features/products/types/product"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  add: (product: Product) => void
  remove: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (product) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      )
      return {
        items: existing
          ? state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.items, { product, quantity: 1 }],
      }
    }),
  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity < 1
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
    })),
  clear: () => set({ items: [] }),
}))
