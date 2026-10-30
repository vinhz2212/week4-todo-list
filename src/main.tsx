import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import App from "./App"
import { Toaster } from "@/core/components/ui/sonner"
import { queryClient } from "@/app/query-client"
import { AppErrorBoundary } from "@/shared/components/error-boundary"
import { reportWebVitals } from "@/core/lib/report-web-vitals"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)

reportWebVitals()
