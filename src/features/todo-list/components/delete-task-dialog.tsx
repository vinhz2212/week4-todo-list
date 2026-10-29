import { Button } from "@/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import type { Task } from "../types/task"

interface DeleteTaskDialogProps {
  task: Task | null
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteTaskDialog({
  task,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa công việc?</DialogTitle>
          <DialogDescription>
            Bạn sắp xóa “{task?.title}”. Thao tác này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
