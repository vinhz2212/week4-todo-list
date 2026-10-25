import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import { cn } from "@/core/lib/utils"
import type { Task } from "../types/task"

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Hoàn thành: ${task.title}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        {task.note && (
          <p className="truncate text-xs text-muted-foreground">{task.note}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Sửa: ${task.title}`}
        onClick={() => onEdit(task)}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xóa: ${task.title}`}
        onClick={() => onDelete(task)}
      >
        <Trash2 />
      </Button>
    </li>
  )
}
