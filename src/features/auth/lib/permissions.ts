import type { AuthUser, Permission } from "../types/auth"

const rolePermissions: Record<AuthUser["role"], Permission[]> = {
  admin: ["product:read", "product:write", "cart:write"],
  moderator: ["product:read", "product:write", "cart:write"],
  user: ["product:read", "cart:write"],
}

export function hasPermission(
  user: AuthUser | null,
  permission: Permission
): boolean {
  return user
    ? (rolePermissions[user.role]?.includes(permission) ?? false)
    : false
}
