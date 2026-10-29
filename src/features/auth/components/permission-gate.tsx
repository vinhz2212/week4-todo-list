import type { ReactNode } from "react"
import { hasPermission } from "../lib/permissions"
import { useAuthStore } from "../store/auth-store"
import type { Permission } from "../types/auth"

interface PermissionGateProps {
  permission: Permission
  children: ReactNode
}

export function PermissionGate({ permission, children }: PermissionGateProps) {
  const user = useAuthStore((state) => state.user)
  return hasPermission(user, permission) ? children : null
}
