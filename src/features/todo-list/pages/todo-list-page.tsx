import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import { PaginationBar } from "../components/pagination-bar"
import { TaskItem } from "../components/task-item"
import { TaskToolbar } from "../components/task-toolbar"
import { usePagination } from "../hooks/use-pagination"
import { useTasks } from "../hooks/use-tasks"
import type { Task, TaskFilter, TaskFormValues } from "../types/task"

const PAGE_SIZE = 5
const TaskEditorDialog = lazy(() => import("../components/task-editor-dialog"))
const DeleteTaskDialog = lazy(() =>
  import("../components/delete-task-dialog").then((module) => ({
    default: module.DeleteTaskDialog,
  }))
)

export default function TodoListPage() {
  const { tasks, remainingCount, addTask, updateTask, toggleTask, deleteTask } =
    useTasks()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<TaskFilter>("all")
  const [editor, setEditor] = useState<Task | "new" | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)

  // Dữ liệu suy ra: không cần tạo state riêng.
  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi")
    return tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.note}`
        .toLocaleLowerCase("vi")
        .includes(keyword)
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" ? task.completed : !task.completed)
      return matchesSearch && matchesFilter
    })
  }, [filter, search, tasks])
  const { activePage, totalPages, pageItems, setPage } = usePagination(
    filteredTasks,
    PAGE_SIZE
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      setPage(1)
    },
    [setPage]
  )

  const handleFilterChange = useCallback(
    (value: TaskFilter) => {
      setFilter(value)
      setPage(1)
    },
    [setPage]
  )

  const handleSave = useCallback(
    (values: TaskFormValues) => {
      if (editor && editor !== "new") {
        updateTask(editor.id, values)
        toast.success("Đã cập nhật công việc.")
      } else {
        addTask(values)
        setPage(1) // Việc mới nằm đầu danh sách.
        toast.success("Đã thêm công việc.")
      }
      setEditor(null)
    },
    [addTask, editor, setPage, updateTask]
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleting) return
    deleteTask(deleting.id)
    setDeleting(null)
    toast.success("Đã xóa công việc.")
  }, [deleteTask, deleting])

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

      {editor && (
        <Suspense fallback={null}>
          <TaskEditorDialog
            editor={editor}
            onOpenChange={(open) => !open && setEditor(null)}
            onSubmit={handleSave}
            onCancel={() => setEditor(null)}
          />
        </Suspense>
      )}
      {deleting && (
        <Suspense fallback={null}>
          <DeleteTaskDialog
            task={deleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleting(null)}
          />
        </Suspense>
      )}
    </div>
  )
}
