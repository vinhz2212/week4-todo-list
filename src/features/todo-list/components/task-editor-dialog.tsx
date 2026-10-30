import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { TaskForm } from "./task-form"
import type { Task, TaskFormValues } from "../types/task"

type EditorState = Task | "new"

interface TaskEditorDialogProps {
  editor: EditorState
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

export default function TaskEditorDialog({
  editor,
  onOpenChange,
  onSubmit,
  onCancel,
}: TaskEditorDialogProps) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editor === "new" ? "Thêm công việc" : "Sửa công việc"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin công việc rồi bấm lưu.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          key={editor === "new" ? "new" : editor.id}
          task={editor === "new" ? undefined : editor}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
