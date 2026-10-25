import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import type { TaskFilter } from "../types/task"

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Chưa xong" },
  { value: "completed", label: "Đã xong" },
]

interface TaskToolbarProps {
  search: string
  filter: TaskFilter
  onSearchChange: (value: string) => void
  onFilterChange: (filter: TaskFilter) => void
}

export function TaskToolbar({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm công việc..."
        aria-label="Tìm công việc"
        className="sm:flex-1"
      />
      <div className="flex gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={filter === item.value ? "default" : "outline"}
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
