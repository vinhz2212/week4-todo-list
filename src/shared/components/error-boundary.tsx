import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/core/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Ứng dụng gặp lỗi giao diện:", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto grid min-h-svh max-w-xl content-center gap-4 p-8">
          <h1 className="text-2xl font-semibold">Đã xảy ra lỗi</h1>
          <p className="text-sm text-muted-foreground">
            Trang này gặp sự cố khi hiển thị. Hãy tải lại để thử lại.
          </p>
          <Button className="w-fit" onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </main>
      )
    }

    return this.props.children
  }
}
