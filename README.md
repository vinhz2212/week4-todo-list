# React Developer · Tuần 4–6

Ứng dụng luyện tập React + TypeScript theo plan: To-do CRUD cục bộ (tuần 4), quản lý sản phẩm với Router và Axios (tuần 5), sau đó thêm Authentication, TanStack Query, Zustand, role/permission và kiểm tra trước commit (tuần 6).

## Chạy ứng dụng

```bash
npm install
cp .env.example .env
npm run dev
```

Trên PowerShell, nếu chưa có `.env`, dùng `Copy-Item .env.example .env`.

## Các luồng chính

- `/`: To-do list tuần 4, dữ liệu cục bộ.
- `/login`: đăng nhập demo bằng DummyJSON.
- `/products`: danh sách sản phẩm có tìm kiếm và phân trang; yêu cầu đăng nhập.
- `/products/:productId`: chi tiết sản phẩm và thêm vào giỏ hàng.
- `/products/new`, `/products/:productId/edit`: CRUD chỉ dành cho vai trò `admin` hoặc `moderator`.
- `/cart`: giỏ hàng dùng Zustand.

Tài khoản ví dụ theo tài liệu DummyJSON: `emilys` / `emilyspass`. Có thể dùng thông tin tài khoản khác trong danh sách users của DummyJSON.

## Tuần 6 áp dụng ở đâu?

- TanStack Query: `src/features/products/queries/product-queries.ts` quản lý query key, cache, mutation và invalidation.
- Authentication: `src/features/auth`; Axios interceptor gắn access token từ localStorage.
- Protected Route: route sản phẩm yêu cầu phiên hợp lệ; route ghi sản phẩm kiểm tra role.
- Permission: `src/features/auth/lib/permissions.ts` và `PermissionGate` ẩn thao tác ghi với người không có quyền.
- Zustand: auth store và cart store nằm trong `src/features`.
- Compound Component: `PageState.Title` và `PageState.Description` dùng cùng `PageState` root.
- Lint/format: `npm run lint`, `npm run format`; Husky chạy `lint-staged` khi commit.
- Feature-based: `src/features/auth`, `src/features/cart`, `src/features/products` và `src/features/todo-list` gom code theo tính năng.

## Giới hạn của bản demo

DummyJSON là API giả lập. Tạo/sửa/xóa sản phẩm trả dữ liệu mẫu nhưng không lưu bền vững. Vai trò và route guard ở frontend dùng để học luồng phân quyền; backend thật vẫn phải kiểm tra quyền ở server. Token được lưu trong localStorage theo yêu cầu bài thực hành, nhưng ứng dụng production nên dùng cookie `HttpOnly`, `Secure`, `SameSite` do server quản lý và có cơ chế refresh/thu hồi token.
