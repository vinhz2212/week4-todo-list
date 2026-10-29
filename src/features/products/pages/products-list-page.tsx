import { useState, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { PageState } from "@/shared/components/page-state"
import { useProducts } from "../queries/product-queries"

const PAGE_SIZE = 8

export default function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q")?.trim() ?? ""
  const requestedPage = Number(searchParams.get("page") ?? 1)
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const skip = (currentPage - 1) * PAGE_SIZE
  const [searchState, setSearchState] = useState({ query, value: query })
  const searchInput = searchState.query === query ? searchState.value : query
  const productsQuery = useProducts({ q: query, limit: PAGE_SIZE, skip })
  const products = productsQuery.data?.products ?? []
  const total = productsQuery.data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = searchInput.trim()
    const nextParams = new URLSearchParams()
    if (nextQuery) nextParams.set("q", nextQuery)
    setSearchParams(nextParams)
  }

  function changePage(page: number) {
    const nextParams = new URLSearchParams(searchParams)
    if (page === 1) nextParams.delete("page")
    else nextParams.set("page", String(page))
    setSearchParams(nextParams)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Danh sách sản phẩm</h2>
        <PermissionGate permission="product:write">
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            to="/products/new"
          >
            Thêm sản phẩm
          </Link>
        </PermissionGate>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          aria-label="Tìm sản phẩm"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchInput}
          onChange={(event) =>
            setSearchState({ query, value: event.target.value })
          }
        />
        <Button type="submit">Tìm</Button>
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
      ) : products.length === 0 ? (
        <PageState>
          <PageState.Title>
            {query ? "Không tìm thấy sản phẩm phù hợp." : "Chưa có sản phẩm."}
          </PageState.Title>
        </PageState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.id} className="rounded-lg border p-4">
              <Link
                className="font-medium underline"
                to={`/products/${product.id}`}
              >
                {product.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.category}
              </p>
              <p className="mt-2 text-sm">${product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
      {!productsQuery.isPending && !productsQuery.isError && totalPages > 0 && (
        <nav
          aria-label="Phân trang sản phẩm"
          className="flex items-center justify-between gap-3"
        >
          <Button
            type="button"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => changePage(currentPage - 1)}
          >
            Trước
          </Button>
          <span aria-live="polite" className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages} · {total} sản phẩm
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Sau
          </Button>
        </nav>
      )}
    </section>
  )
}
