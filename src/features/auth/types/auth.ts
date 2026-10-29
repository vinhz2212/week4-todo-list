export type UserRole = "admin" | "moderator" | "user"

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
  role: UserRole
}

export interface LoginInput {
  username: string
  password: string
}

export interface LoginResponse extends AuthUser {
  accessToken: string
  refreshToken: string
}

export type Permission = "product:read" | "product:write" | "cart:write"
