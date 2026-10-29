import { apiClient } from "@/core/lib/api-client"
import type { AuthUser, LoginInput, LoginResponse } from "../types/auth"

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      ...input,
      expiresInMins: 60,
    })
    const user = response.data
    return { ...user, role: user.role ?? (await getRole(user.id)) }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>("/auth/me")
    const user = response.data
    return { ...user, role: user.role ?? (await getRole(user.id)) }
  },
}

async function getRole(userId: number): Promise<AuthUser["role"]> {
  const response = await apiClient.get<Pick<AuthUser, "role">>(
    `/users/${userId}`,
    { params: { select: "role" } }
  )
  return response.data.role ?? "user"
}
