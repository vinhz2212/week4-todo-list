import { Link } from "react-router-dom"
import { Button } from "@/core/components/ui/button"
import { useCartStore } from "../store/cart-store"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const remove = useCartStore((state) => state.remove)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <section className="mx-auto max-w-3xl space-y-5 p-6 sm:p-8">
      <h1 className="text-2xl font-semibold">Giỏ hàng Zustand</h1>
      {items.length === 0 ? (
        <div className="space-y-3 rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Giỏ hàng đang trống.</p>
          <Link className="underline" to="/products">
            Chọn sản phẩm
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y rounded-lg border">
            {items.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div>
                  <Link
                    className="font-medium underline"
                    to={`/products/${product.id}`}
                  >
                    {product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)} / sản phẩm
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`quantity-${product.id}`}>
                    Số lượng {product.title}
                  </label>
                  <input
                    className="h-8 w-16 rounded-md border bg-background px-2 text-sm"
                    id={`quantity-${product.id}`}
                    min="1"
                    onChange={(event) =>
                      setQuantity(product.id, Number(event.target.value))
                    }
                    type="number"
                    value={quantity}
                  />
                  <Button variant="outline" onClick={() => remove(product.id)}>
                    Xóa
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold">
            Tổng tạm tính: ${total.toFixed(2)}
          </p>
        </>
      )}
    </section>
  )
}
