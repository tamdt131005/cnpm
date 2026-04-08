---
name: Frontend Development Vanilla JS
description: Hướng dẫn chi tiết cách phát triển và làm việc với cấu trúc frontend sử dụng Vanilla HTML/CSS/JS không dùng Bundler.
---

# Hướng Dẫn Phát Triển Frontend (Dựa trên cấu trúc Backend_API_KTTKPM/fontend)

Dự án này sử dụng kiến trúc Vanilla Web (HTML, CSS, JS thuần), không sử dụng các trình đóng gói (bundler) như Webpack, Vite hay hệ sinh thái của React/Vue. Việc quản lý mã nguồn được thực hiện thông qua module pattern thuần bằng đường dẫn thư mục `URL`.

## 1. Cấu Trúc Thư Mục Tiêu Chuẩn

Luôn bám sát cấu trúc folder sau để đảm bảo chuẩn hóa toàn dự án:

```text
/fontend/
 ├── index.html           # Trang chủ
 ├── assets/              # Tài nguyên dùng chung cấp toàn cầu
 │   ├── css/             # CSS chung (style.css, các module design system)
 │   ├── js/              # JS chung (api.js xử lý request, main.js)
 │   └── images/          # Hình ảnh dùng trên giao diện
 ├── components/          # Chứa các component dùng chung 
 │   └── components.js    # Khởi tạo Web Components (Ví dụ <app-header>)
 └── pages/               # Từng page tách biệt theo module domain
     ├── admin/
     ├── auth/            # file HTML, CSS, JS liên quan logic đăng nhập, đăng ký
     ├── product/
     └── ...
```

## 2. Quy Tắc Code HTML & Assets

- **Đường dẫn (Paths):** Do không dùng Bundler, bạn phải cẩn thận với đường dẫn file tĩnh khi tạo file tĩnh trong `pages/`. Luôn phải chỉ định path tương đối chuẩn chỉ ngược về thư mục gốc để tải JS và CSS. 
Ví dụ, trong `pages/auth/login.html`: `../../assets/js/api.js`
- **Sử Dụng Web Components:** Đối với các khối phổ biến như Header, Footer, Toolbar,... hãy mở `components/components.js`. Nếu đã có custom tag như `<app-header></app-header>`, hãy tận dụng thay vì lặp lại div.

## 3. Quy Tắc Code Javascript & API

Hệ thống đã xây dựng sẵn file `/assets/js/api.js` là một wrapper quản lý tập trung luồng Request & Response. ĐỪNG sử dụng `fetch()` trực tiếp ở ngoài nếu gọi API nội bộ!

### Core Methods từ `api.js`:
Sử dụng hằng số `api` được expose toàn cục (cần script src tới `api.js` trên HTML)

- `api.get(endpoint)`
- `api.post(endpoint, body)`
- `api.put(endpoint, body)`
- `api.delete(endpoint)`
- `api.upload(endpoint, formData)` (Dành riêng cho uploads tệp)

### Đặc điểm:
1. **JSON Tự Động:** Các method `.post`, `.put` tự format `body` thành JSON. Không khai báo `JSON.stringify(body)` vào trong hàm gọi tại Component.
2. **Phiên Đăng Nhập:** File `api.js` sẽ tự động đính kèm Token xác thực từ `localStorage.getItem('token')`. Logic xác thực là trong suốt với developer.
3. **Promise Base:** Tất cả hàm call đều trả về Promise. Luôn sử dụng cú pháp `async/await` ở khối try/catch.

*Ví dụ:*
```javascript
async function layChiTietSanPham(id) {
    try {
        const responseData = await api.get(`/products/${id}`);
        // Render UI...
    } catch (error) {
        alert("Lỗi khi tải thông tin: " + error.message);
    }
}
```

## 4. Quản Lý Trạng Thái (State Management)

Dự án sử dụng Browser Storage cho việc quản lý trạng thái phiên.
- `token`: Lưu tại `localStorage` để xác thực người dùng.
- Trạng thái giỏ hàng (Cart) hay settings khác: Ưu tiên lưu trong DB, nhưng có thể lưu tạm `localStorage` nếu đang ở vãng lai (guest).

## 5. CSS & Thiết Kế

- Viết các rule CSS layout toàn cục vào `/assets/css/style.css`.
- Chỉ những CSS nào đặc thù, dị biệt và không tái sử dụng thì mới ném vào `.css` riêng ở trong `/pages/{module}/{file}.css`.
- Tránh ghi đè styles thẻ gốc (như `body`, `h1`, `a`) từ các file CSS của pages nội bộ.
