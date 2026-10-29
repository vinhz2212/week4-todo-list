import { create } from "zustand"
import type { AuthUser, LoginResponse } from "../types/auth"

const USER_STORAGE_KEY = "week6_auth_user"

function readStoredUser(): AuthUser | null {
  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  setSession: (session: LoginResponse) => void
  setUser: (user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: window.localStorage.getItem("access_token"),
  user: readStoredUser(),
  setSession: (session) => {
    const { accessToken, refreshToken, ...user } = session
    window.localStorage.setItem("access_token", accessToken)
    window.localStorage.setItem("refresh_token", refreshToken)
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    set({ accessToken, user })
  },
  setUser: (user) => {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    set({ user })
  },
  clearSession: () => {
    window.localStorage.removeItem("access_token")
    window.localStorage.removeItem("refresh_token")
    window.localStorage.removeItem(USER_STORAGE_KEY)
    set({ accessToken: null, user: null })
  },
}))
