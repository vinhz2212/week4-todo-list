import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TaskItem } from "./task-item"

describe("TaskItem", () => {
  it("calls the toggle action when its checkbox is clicked", () => {
    const onToggle = vi.fn()

    render(
      <TaskItem
        task={{
          id: "task-1",
          title: "Hoàn thành tuần 7",
          note: "",
          completed: false,
          createdAt: 1,
        }}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Hoàn thành: Hoàn thành tuần 7" })
    )

    expect(onToggle).toHaveBeenCalledWith("task-1")
  })
})
