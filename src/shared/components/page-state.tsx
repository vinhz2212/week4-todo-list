import type { ReactNode } from "react"

interface PageStateProps {
  children: ReactNode
  kind?: "default" | "error"
}

function Root({ children, kind = "default" }: PageStateProps) {
  return (
    <div
      className={`rounded-lg border p-5 text-sm ${kind === "error" ? "border-destructive" : ""}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  return <h3 className="font-medium">{children}</h3>
}

function Description({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-muted-foreground">{children}</p>
}

export const PageState = Object.assign(Root, { Title, Description })
