import { useState } from "react"
import type { Task, TaskFormValues } from "../types/task"

// 7 việc mẫu để thấy rõ phân trang (mỗi trang 5 việc).
const INITIAL_TASKS: Task[] = Array.from({ length: 7 }, (_, index) => ({
  id: crypto.randomUUID(),
  title: `This is an example of task #${index + 1}`,
  note: "",
  completed: index % 2 === 0,
  createdAt: Date.now() - index * 1000,
}))

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  const remainingCount = tasks.filter((task) => !task.completed).length

  function addTask(values: TaskFormValues) {
    const task: Task = {
      id: crypto.randomUUID(),
      ...values,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((current) => [task, ...current])
  }

  function updateTask(id: string, values: TaskFormValues) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...values } : task))
    )
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return { tasks, remainingCount, addTask, updateTask, toggleTask, deleteTask }
}
