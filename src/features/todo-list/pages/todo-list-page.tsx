import { useState } from "react"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { DeleteTaskDialog } from "../components/delete-task-dialog"
import { PaginationBar } from "../components/pagination-bar"
import { TaskForm } from "../components/task-form"
import { TaskItem } from "../components/task-item"
import { TaskToolbar } from "../components/task-toolbar"
import { usePagination } from "../hooks/use-pagination"
import { useTasks } from "../hooks/use-tasks"
import type { Task, TaskFilter, TaskFormValues } from "../types/task"

const PAGE_SIZE = 5

export default function TodoListPage() {
  const { tasks, remainingCount, addTask, updateTask, toggleTask, deleteTask } =
    useTasks()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<TaskFilter>("all")
  const [editor, setEditor] = useState<Task | "new" | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)

  // Dữ liệu suy ra: không cần tạo state riêng.
  const keyword = search.trim().toLocaleLowerCase("vi")
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.note}`
      .toLocaleLowerCase("vi")
      .includes(keyword)
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" ? task.completed : !task.completed)
    return matchesSearch && matchesFilter
  })
  const { activePage, totalPages, pageItems, setPage } = usePagination(
    filteredTasks,
    PAGE_SIZE
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleFilterChange(value: TaskFilter) {
    setFilter(value)
    setPage(1)
  }

  function handleSave(values: TaskFormValues) {
    if (editor && editor !== "new") {
      updateTask(editor.id, values)
      toast.success("Đã cập nhật công việc.")
    } else {
      addTask(values)
      setPage(1) // Việc mới nằm đầu danh sách.
      toast.success("Đã thêm công việc.")
    }
    setEditor(null)
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteTask(deleting.id)
    setDeleting(null)
    toast.success("Đã xóa công việc.")
  }

  return (
    <div className="min-h-svh bg-muted/40 px-4 py-8">
      <section className="mx-auto max-w-xl space-y-4 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Your To Do</h1>
            <nav className="mt-2 flex gap-3 text-sm">
              <Link className="underline" to="/products">
                Tuần 5–6 · Quản lý sản phẩm
              </Link>
              <Link className="underline" to="/login">
                Đăng nhập
              </Link>
            </nav>
          </div>
          <Button onClick={() => setEditor("new")}>
            <Plus />
            Thêm
          </Button>
        </div>

        <TaskToolbar
          search={search}
          filter={filter}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {pageItems.length > 0 ? (
          <ul className="space-y-2">
            {pageItems.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={setEditor}
                onDelete={setDeleting}
              />
            ))}
          </ul>
        ) : (
          <p
            role="status"
            className="py-6 text-center text-sm text-muted-foreground"
          >
            Không có công việc phù hợp.
          </p>
        )}

        <PaginationBar
          page={activePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <p className="text-sm font-medium">
          Your remaining todos : {remainingCount}
        </p>
        <blockquote className="border-l-2 pl-3 text-xs text-muted-foreground italic">
          Hãy hoàn thành từng việc nhỏ mỗi ngày.
        </blockquote>
      </section>

      <Dialog
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editor === "new" ? "Thêm công việc" : "Sửa công việc"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin công việc rồi bấm lưu.
            </DialogDescription>
          </DialogHeader>
          {editor && (
            <TaskForm
              key={editor === "new" ? "new" : editor.id}
              task={editor === "new" ? undefined : editor}
              onSubmit={handleSave}
              onCancel={() => setEditor(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteTaskDialog
        task={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
