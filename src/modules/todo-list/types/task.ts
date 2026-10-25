import { z } from "zod"

// Một nguồn sự thật: schema dùng để kiểm tra form, type suy ra từ schema.
export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên công việc")
    .max(100, "Tên công việc tối đa 100 ký tự"),
  note: z.string().trim().max(300, "Ghi chú tối đa 300 ký tự"),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export interface Task extends TaskFormValues {
  id: string
  completed: boolean
  createdAt: number
}

export type TaskFilter = "all" | "active" | "completed"
