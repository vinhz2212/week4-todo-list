import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { taskFormSchema, type Task, type TaskFormValues } from "../types/task"

interface TaskFormProps {
  task?: Task
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: task?.title ?? "", note: task?.note ?? "" },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="task-title" className="text-sm font-medium">
          Công việc
        </label>
        <Input
          id="task-title"
          autoComplete="off"
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
        {errors.title && (
          <p role="alert" className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="task-note" className="text-sm font-medium">
          Ghi chú
        </label>
        <Textarea
          id="task-note"
          aria-invalid={Boolean(errors.note)}
          {...register("note")}
        />
        {errors.note && (
          <p role="alert" className="text-sm text-destructive">
            {errors.note.message}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {task ? "Lưu thay đổi" : "Thêm công việc"}
        </Button>
      </div>
    </form>
  )
}
