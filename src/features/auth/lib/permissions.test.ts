import { describe, expect, it } from "vitest"
import { hasPermission } from "./permissions"
import type { AuthUser } from "../types/auth"

const user = (role: AuthUser["role"]): AuthUser => ({
  id: 1,
  username: "demo",
  email: "demo@example.test",
  firstName: "Demo",
  lastName: "User",
  image: "",
  role,
})

describe("hasPermission", () => {
  it("allows a regular user to read but not change products", () => {
    expect(hasPermission(user("user"), "product:read")).toBe(true)
    expect(hasPermission(user("user"), "product:write")).toBe(false)
  })

  it("allows an administrator to change products", () => {
    expect(hasPermission(user("admin"), "product:write")).toBe(true)
  })

  it("denies permissions when there is no signed-in user", () => {
    expect(hasPermission(null, "product:read")).toBe(false)
  })
})
