# Thiết kế và Lập Kế hoạch Chi tiết: Hệ thống Quản lý Thu phí Học sinh

Tài liệu này cung cấp thiết kế mức độ kỹ thuật (Low-Level Design) mở rộng từ sơ đồ Use Case gốc. Hệ thống sử dụng **Node.js (DAO Pattern)** cho Backend và **Vanilla JS** cho Frontend.

---

## 1. Phân Tích Chức Năng Chi Tiết (Nghiệp vụ)

### A. Phân hệ Sinh viên
1. **Đăng nhập:** Xác thực bằng Mã sinh viên / Email và Password. Nhận Token truy cập.
2. **Xem Công Nợ (Tính toán nợ học phí):**
   - Hệ thống quét học kỳ hiện tại, lấy số tín chỉ sinh viên đăng ký nhân với `Đơn giá (Fee Rate)` của học kỳ đó để ra tổng tiền phải đóng (Hóa đơn).
   - Truy vấn các khoản đã thanh toán trước đó, trừ đi để ra **Số nợ cuối cùng**.
3. **Thanh toán trực tuyến:**
   - Chọn hóa đơn hoặc số tiền cần nộp.
   - Gọi API thanh toán (Mô phỏng hoặc qua Momo/VNPay).
   - Ghi lại Transaction và Cập nhật trạng thái Hóa đơn.
4. **Lịch sử giao dịch:** Tra cứu danh sách các lần nộp tiền thành công (Ngày giờ, số tiền).

### B. Phân hệ Nhân viên Tài vụ
1. **Quản lý định mức học phí:** Lập mức giá cho 1 tín chỉ theo từng Năm Học / Học Kỳ.
2. **Theo dõi Hóa đơn & Thu phí thủ công:** Tính năng cho phép nhân viên gạch nợ thủ công (khi sinh viên nộp tiền mặt).
3. **Báo cáo và Danh sách cấm thi:** Xuất danh sách sinh viên nợ tiền học quá hạn để chuyển phòng giáo vụ khóa quyền thi.

### C. Phân hệ Admin
1. Quản lý toàn bộ thông tin Cơ bản, Tài khoản Hệ thống.

---

## 2. Thiết Kế Cơ Sở Dữ Liệu Chi Tiết (MySQL Schema)

Cấu trúc chuẩn hóa (3NF) để tránh dư thừa và dễ bảo trì.

| Tên Bảng | Cột (Trường dữ liệu) | Kiểu dữ liệu | Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **`nguoidung`** (Users) | `id` | INT AUTO_INCREMENT | PK | |
| | `username` | VARCHAR(50) | UNIQUE | Mã SV hoặc Tên đăng nhập |
| | `password` | VARCHAR(255) | | Đã băm (bcrypt) |
| | `role` | ENUM | | 'admin', 'staff', 'student' |
| | `created_at` | TIMESTAMP | | |
| **`sinhvien`** (Students) | `id` | INT AUTO_INCREMENT | PK | |
| | `user_id` | INT | FK | Liên kết sang bảng `nguoidung` |
| | `ma_sv` | VARCHAR(20) | UNIQUE | Mã số sinh viên |
| | `ho_ten` | VARCHAR(100) | | |
| | `lop` | VARCHAR(50) | | |
| | `ngay_sinh` | DATE | | |
| | `email` | VARCHAR(100) | | |
| **`dinhmuc_hocphi`** (Fee Rates)| `id` | INT AUTO_INCREMENT | PK | |
| | `nam_hoc` | VARCHAR(20) | | Ví dụ: "2023-2024" |
| | `hoc_ky` | INT | | 1, 2, 3 |
| | `so_tien_mot_tin_chi` | DECIMAL(10,2)| | VD: 540000 |
| **`hoadon`** (Invoices)| `id` | INT AUTO_INCREMENT | PK | |
| | `sinhvien_id` | INT | FK | Liên kết bảng `sinhvien` |
| | `nam_hoc` | VARCHAR(20) | | |
| | `hoc_ky` | INT | | |
| | `tong_tin_chi` | INT | | Số TC đăng ký kỳ đó |
| | `tong_tien` | DECIMAL(12,2)| | `tong_tin_chi * so_tien...` |
| | `trang_thai` | ENUM | | 'chua_nop', 'mot_phan', 'da_nop' |
| | `han_nop` | DATE | | Hạn cuối đóng phí |
| **`giaodich`** (Transactions)| `id` | INT AUTO_INCREMENT | PK | |
| | `hoadon_id` | INT | FK | Liên kết bảng `hoadon` |
| | `so_tien_nop` | DECIMAL(12,2)| | |
| | `phuong_thuc` | VARCHAR(50) | | 'momo', 'bank', 'cash' |
| | `ngay_nop` | TIMESTAMP | | |

---

## 3. Thiết Kế API Backend (Node.js & Express)

Mỗi Module tuân thủ chặt chẽ mô hình **Router -> Controller -> Service -> DAO**.

### A. API Xác Thực (Auth)
- `POST /api/auth/login`: Nhận `username` & `password`. Trả về `{ token: "jwt_...", role, user_id }`.

### B. API Sinh Viên (`/api/student/*`) - Yêu cầu Token: ROLE=student
- `GET /api/student/profile`: Lấy thông tin cá nhân hiện tại.
- `GET /api/student/invoices`: Liệt kê Hóa đơn học phí (kèm tình trạng đã nộp bao nhiêu, còn nợ bao nhiêu).
- `GET /api/student/transactions`: Xem lịch sử giao dịch.
- `POST /api/student/pay`: Sinh viên tạo một tác vụ thanh toán cho 1 hóa đơn, body: `{ invoice_id, amount, payment_method }`.

### C. API Nhân Viên Cơ sở (`/api/staff/*`) - Yêu cầu Token: ROLE=staff
- `POST /api/staff/fee-rates`: Tạo định mức học phí mới cho học kỳ.
- `GET /api/staff/fee-rates`: Xem tất cả định mức đã tạo.
- `GET /api/staff/debts`: Truy xuất danh sách TẤT CẢ sinh viên đang nợ tiền (để làm danh sách cấm thi).
- `POST /api/staff/generate-invoices`: Quét và tạo tay danh sách các hóa đơn mới cho mọi sinh viên vào đầu kỳ khóa học.

### D. API Quản Trị Viên (`/api/admin/*`) - Yêu cầu Token: ROLE=admin
- `GET, POST, PUT, DELETE /api/admin/students`: CRUD hồ sơ sinh viên cơ bản.
- `GET, POST, PUT, DELETE /api/admin/users`: CRUD tài khoản hệ thống.

---

## 4. Thiết Kế Giao Diện Frontend (Vanilla HTML/CSS/JS)

Sử dụng fetch/wrapper tự viết trong `api.js` chặn mọi JWT vào header.

### A. Luồng Đăng nhập (Auth Flow)
- Giao diện: `/pages/auth/login.html`
- Logic: Nhập thông tin -> Gọi `api.post('/auth/login', ...)` -> Lưu `localStorage.setItem('token', data.token)` -> Điều hướng sang Dashboard tùy vào `role`.

### B. Màn hình Sinh viên (Student Portal) - `/pages/student/`
- **`dashboard.html`**:
  - Giao diện chia 2 cột: Cột trái (Thông tin cá nhân & Số dư nợ hiện tại), Cột phải (Danh sách các học phần/học kỳ chưa đóng phí -> Có nút `[Thanh Toán Bằng MoMo]`).
- **`history.html`**: 
  - Hiển thị bảng dạng lưới danh sách ngày nộp tiền. Gọi `api.get('/student/transactions')`.

### C. Màn hình Nhân viên (Staff Portal) - `/pages/staff/`
- **`rates.html`**: 
  - Bảng liệt kê mức thu hàng năm. Form thêm học phí cho kỳ hạn tới.
- **`report.html`**:
  - Tính năng quan trọng: Chứa một bộ Lọc (Filter) để lọc những Sinh viên `"Chưa đóng đủ phí"`. Có nút "Xuất Excel" (Tính năng mở rộng).

### D. Tái sử dụng HTML Component
- File `components.js` sẽ định nghĩa:
  - `<staff-sidebar></staff-sidebar>`
  - `<student-sidebar></student-sidebar>`
  - `<top-navbar></top-navbar>` 
- Giúp bạn chỉ thiết kế Header 1 lần, các trang html khác gọi `<top-navbar>` tự động render mà không cần Copy/Paste code.

---

## 5. Các bước Action Code cụ thể

1. **Khởi tạo Database**: Viết script `sql.sql` khởi tạo 5 bảng, insert mock dữ liệu (1 admin, 1 nhân viên, 2 sinh viên mẫu).
2. **Làm Backend Module Auth**: Viết tầng daos, service, controller cho `nguoidung`. Phải có token JWT hoạt động chuẩn.
3. **Làm Backend Module Phí (Fee)**: API tạo hóa đơn, tính học phí.
4. **Viết JS Frontend**: Gọi tới backend, xây dựng giao diện xem nợ cho học sinh.
