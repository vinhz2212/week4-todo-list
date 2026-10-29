import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { authService } from "../api/auth-service"
import { useAuthStore } from "../store/auth-store"
import type { UserRole } from "../types/auth"

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearSession = useAuthStore((state) => state.clearSession)
  const setUser = useAuthStore((state) => state.setUser)
  const authQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    enabled: Boolean(accessToken),
    retry: false,
  })

  useEffect(() => {
    if (authQuery.data) setUser(authQuery.data)
  }, [authQuery.data, setUser])

  useEffect(() => {
    if (authQuery.isError) clearSession()
  }, [authQuery.isError, clearSession])

  if (!accessToken || authQuery.isError) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (authQuery.isPending || !authQuery.data) {
    return (
      <p
        role="status"
        className="mx-auto max-w-xl p-8 text-sm text-muted-foreground"
      >
        Đang kiểm tra phiên đăng nhập...
      </p>
    )
  }

  if (roles && !roles.includes(authQuery.data.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}
