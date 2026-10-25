import axios, { AxiosError } from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const message = error.response
        ? `API trả về lỗi ${error.response.status}.`
        : "Không thể kết nối đến máy chủ. Hãy kiểm tra kết nối mạng."
      return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
  }
)
