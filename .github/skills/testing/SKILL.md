---
name: Hướng dẫn Kiểm thử (Testing)
description: Định hướng và hướng dẫn sử dụng công cụ kiểm thử API (Bruno) và kiểm thử thủ công cho dự án.
---

# Hướng dẫn Kiểm thử Hệ thống

Dự án hiện tại chưa tích hợp một Test Runner tự động (như Jest hay Mocha) chuyên sâu toàn diện. Theo như quy tắc kiến trúc của dự án, bước kiểm thử Backend mạnh mẽ qua GUI bằng **Bruno** là một tiêu chuẩn bắt buộc cho mọi API.

## 1. Kiểm thử API thông qua Bruno

Hãy tìm file/thư mục cấu hình có sẵn thư mục gốc thường là `btapweb`. Bruno là một phần mềm mã nguồn mở (thay thế cho Postman). Các request test được lưu dưới dạng file `.bru`.

### Quy trình khi viết một API mới (Ví dụ `GET /api/student/invoices`):
1. Code controller, service, daos và route của Node.js.
2. Mở Bruno App (hoặc tính năng Bruno chạy trên Extension VSCode).
3. Tạo file request mới, đặt tên rõ ràng (Ví dụ `Lấy Hóa Đơn Sinh Viên.bru`).
4. **Về Authentication**: Nếu route yêu cầu phân quyền sinh viên, hãy gọi HTTP request Đăng nhập trước -> Lấy Access Token -> Paste vào tab `Auth (Bearer)` của request vừa tạo.
5. Gửi request và phân tích độ trễ, format JSON.

### Bộ Tiêu Chuẩn Output API Đạt (Pass Test):
Bắt buộc một Request khi gửi xong phải cho kết quả tuân thủ mẫu JSON quy định:
```json
{
  "success": true,
  "message": "Thông báo tiếng Việt thân thiện",
  "data": { ... }
}
```
HTTP Status code phải chuẩn xác hoàn toàn (Không lạm dụng mã 200 cho lỗi):
- `200`: Lấy dữ liệu thành công, logic thực thi ổn thỏa.
- `201`: Khởi tạo thành công (Ví dụ: Tạo mới mức học phí).
- `400`: Validation đầu vào Joi không hợp lệ.
- `401`: Token không đúng chuẩn, hoặc đã đăng xuất.
- `403`: Role nhân viên nhưng gọi API của sinh viên.
- `500`: Các lỗi bắt bằng khối `catch` từ Database.

## 2. Kiểm thử Validation và Bảo Mật (Backend)

Phải luôn ép các kịch bản ngoại lệ để làm cho Server chết/bị lỗi:
- Gửi trường tham số rỗng (Empty/null body).
- Sai logic định dạng (Email ko có @, điểm nợ là số âm).
- Truy vấn ngoài luồng (VD: Cố sửa `invoice_id` của thằng khác qua API).
- Kiểm tra SQL Injection qua Bruno. Nếu bạn tuân thủ dùng Parameterized method qua hàm `pool.execute()` ở Database, tự động bài kiểm tra này sẽ Tốt.

## 3. Kiểm thử Frontend Vanilla
Không sử dụng Unit test DOM. Người lập trình làm công tác Manual UI Test:
1. Luôn test trạng thái Trống (Blank State): Người dùng bấm vào Trang Nợ mà chưa đăng nhập -> Có đẩy về màn Login không?
2. Bật Tab Network (F12) quan sát sự gọi API, đảm bảo Frontend không xả rác gọi nhiều API thụt lùi không cần thiết.
3. Test Edge cases: Gõ chữ vào ô nhập Số tiền nộp học phí, hoặc bấm Nộp 2 lần liên tục. Tránh bấm spam -> Disable Javascript Button ngay lập tức.
