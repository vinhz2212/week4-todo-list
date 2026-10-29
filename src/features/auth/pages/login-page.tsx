import { useState, type FormEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { authService } from "../api/auth-service"
import { useAuthStore } from "../store/auth-store"

interface LoginLocationState {
  from?: { pathname?: string }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((state) => state.setSession)
  const [username, setUsername] = useState("emilys")
  const [password, setPassword] = useState("emilyspass")
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session)
      navigate(
        (location.state as LoginLocationState | null)?.from?.pathname ??
          "/products",
        {
          replace: true,
        }
      )
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate({ username: username.trim(), password })
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-lg content-center gap-6 p-6">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Tuần 6 · Authentication</p>
        <h1 className="text-3xl font-semibold">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          API demo DummyJSON. Tài khoản mẫu được điền sẵn để bạn thử luồng đăng
          nhập.
        </p>
      </header>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border p-5"
      >
        <label className="grid gap-2 text-sm font-medium" htmlFor="username">
          Tên đăng nhập
          <Input
            autoComplete="username"
            id="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor="password">
          Mật khẩu
          <Input
            autoComplete="current-password"
            id="password"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {loginMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {loginMutation.error.message ||
              "Đăng nhập thất bại. Hãy kiểm tra thông tin."}
          </p>
        )}
        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Gợi ý tài khoản demo: <code>emilys</code> / <code>emilyspass</code>
      </p>
    </main>
  )
}
