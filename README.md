# React Developer · Tuần 4–7

Mini project luyện tập React + TypeScript: To-do CRUD cục bộ (tuần 4), quản lý sản phẩm với Router và Axios (tuần 5), Authentication/TanStack Query/Zustand (tuần 6), và tối ưu, kiểm thử, PWA, Docker, deploy (tuần 7).

## Chạy ứng dụng

```bash
npm install
```

Trên PowerShell, sao chép biến môi trường mẫu nếu chưa có `.env`, sau đó chạy Vite:

```powershell
Copy-Item .env.example .env
npm run dev
```

## Các luồng chính

- `/`: To-do list tuần 4, dữ liệu cục bộ.
- `/login`: đăng nhập demo bằng DummyJSON.
- `/products`: danh sách sản phẩm có tìm kiếm và phân trang; yêu cầu đăng nhập.
- `/products/:productId`: chi tiết sản phẩm và thêm vào giỏ hàng.
- `/products/new`, `/products/:productId/edit`: CRUD chỉ dành cho role `admin` hoặc `moderator`.
- `/cart`: giỏ hàng dùng Zustand.

Tài khoản ví dụ theo tài liệu DummyJSON: `emilys` / `emilyspass`.

## Tuần 6–7 áp dụng ở đâu?

- TanStack Query: `src/features/products/queries/product-queries.ts` quản lý cache, mutation và invalidation.
- Authentication/role: `src/features/auth`; Axios interceptor gắn token.
- Zustand: auth store và cart store nằm trong `src/features`.
- Feature-based: `src/features/auth`, `cart`, `products`, `todo-list`.
- Performance: route dùng `React.lazy`/`Suspense`; To-do dùng `memo`, `useMemo`, `useCallback`.
- Lỗi render: `src/shared/components/error-boundary.tsx`.
- Web Vitals: `src/core/lib/report-web-vitals.ts`; log trong dev console và phát event `app:web-vital`.
- PWA: Vite PWA tạo manifest, service worker precache tài nguyên build và cache API sản phẩm theo Network First; API auth không được cache.
- Test: `npm test` chạy Vitest + React Testing Library.
- Code quality: `npm run lint`, `npm run format`; Husky chạy `lint-staged` trước commit.

## Build và kiểm tra production

```bash
npm test
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

Mở trang preview mà Vite in ra, vào Chrome DevTools → Lighthouse, chọn chế độ Mobile hoặc Desktop rồi chạy báo cáo. Để so sánh trước/sau, dùng cùng thiết bị, chế độ, route và điều kiện mạng; lưu report HTML/JSON cùng các giá trị LCP, INP, CLS, ngày chạy và thiết bị trong `docs/performance/`. Log Web Vitals trong dev có thể đọc ở Console hoặc lắng nghe event `app:web-vital`.

## Docker

```bash
docker build -t react-developer-week7 .
docker run --rm -p 8080:80 react-developer-week7
```

Mở `http://localhost:8080`. API base URL mặc định là `https://dummyjson.com`; thay bằng build argument `--build-arg VITE_API_BASE_URL=...` nếu cần.

## Deploy lên Vercel

Import repository GitHub `vinhz2212/week4-todo-list` vào Vercel. Vercel dùng `npm run build`, thư mục `dist` và rewrite trong `vercel.json` để các deep link của React Router mở được trực tiếp. Trong Project Settings → Environment Variables, đặt `VITE_API_BASE_URL` thành `https://dummyjson.com`, rồi deploy nhánh `main`.

## Giới hạn bản demo

DummyJSON mô phỏng thao tác tạo/sửa/xóa nên dữ liệu sản phẩm không lưu bền vững. Route guard và role ở frontend để học luồng phân quyền; backend thật cũng phải xác thực quyền ở server. Token demo lưu trong localStorage; production nên dùng cookie `HttpOnly`, `Secure`, `SameSite` do server quản lý.
