# Hướng dẫn sử dụng frontend hệ thống thu học phí

> Tài liệu này chỉ hướng dẫn cách sử dụng giao diện và nhập liệu.
> Không bao gồm bước cài đặt hoặc chạy hệ thống.

## 1. Tài khoản mẫu để đăng nhập (đối chiếu từ sql.sql)

| Vai trò | Tên đăng nhập | Mật khẩu | Mã người dùng |
| --- | --- | --- | --- |
| Admin | admin | pass123 | AD01 |
| Kế toán | ketoan01 | pass123 | KT01 |
| Kế toán | ketoan02 | pass123 | KT02 |
| Sinh viên | sv2021001 | pass123 | SV01 |
| Sinh viên | sv2021003 | pass123 | SV03 |
| Sinh viên | sv2021004 | pass123 | SV04 |

Lưu ý:
- Hệ thống chấp nhận mật khẩu plaintext từ dữ liệu seed SQL; sau lần đăng nhập thành công có thể tự nâng cấp sang bcrypt.
- Nếu muốn đổi vai trò test nhanh, đăng xuất rồi đăng nhập lại bằng tài khoản khác.

## 2. Bộ mã dữ liệu sẵn có để nhập form (đối chiếu từ sql.sql)

### 2.1. Enum hợp lệ
- Vai trò người dùng: Admin, KeToan, SinhVien
- Loại sinh viên: ChinhQuy, LienThong, VanBang2
- Phương thức thanh toán: TienMat, ChuyenKhoan, The, ViDienTu
- Trạng thái sinh viên: DangHoc, BaoLuu, DaTotNghiep, ThoiHoc

### 2.2. Mã tham chiếu phổ biến
- Mã năm học: 2021-2022, 2022-2023, 2023-2024, 2024-2025, 2025-2026
- Mã học kỳ: HK1_21-22, HK2_21-22, HK1_22-23, HK2_22-23, HK1_23-24
- Mã khoa: CNTT, KT, NN, CK, DDT, QTKD, XD
- Mã ngành: KHMT, KTPM, TCNH, KTQT, NNA, NNH, Marketing
- Mã lớp: CNTT_K15A, CNTT_K15B, KT_K15A, NN_K15A, XD_K15A
- Mã môn học: CSDL, RR, LTCB, KTMC, TA1, VLDC, KT1, NMQTKD, THDC
- Mã sinh viên: sv2021001, sv2021002, sv2021003, sv2021004, sv2021005

### 2.3. Hóa đơn mẫu có sẵn để test nghiệp vụ thu
- HD21_003 - sv2021003 - HK1_21-22 - số tiền phải trả 1,800,000 - trạng thái ChuaThanhToan
- HD21_004 - sv2021004 - HK1_21-22 - số tiền phải trả 1,200,000 - đã có giao dịch 500,000 nên còn nợ
- HD21_005 - sv2021005 - HK1_21-22 - số tiền phải trả 700,000 - trạng thái ChuaThanhToan

## 3. Đăng nhập và điều hướng theo vai trò

1. Mở trang đăng nhập frontend.
2. Nhập đúng 2 trường:
- Tài khoản: tenDangNhap
- Mật khẩu: matKhau
3. Bấm Đăng nhập.
4. Hệ thống tự điều hướng:
- SinhVien sang trang student overview
- KeToan sang trang staff rates
- Admin sang trang admin dashboard

## 4. Hướng dẫn nhập liệu theo từng vai trò

### 4.1. Sinh viên

#### A. Trang Hóa đơn học phí
1. Chọn tài khoản sv2021003 để dễ thấy hóa đơn chưa thanh toán.
2. Tại dòng hóa đơn HD21_003, bấm Thanh toán.
3. Nhập dữ liệu mẫu:
- Số tiền nộp: 300000
- Ghi chú: Dong hoc phi dot 1
4. Bấm Thanh toán với MoMo để chuyển luồng thanh toán.

#### B. Trang Môn học đăng ký
1. Nhập lọc mã học kỳ: HK1_21-22.
2. Chọn loại sinh viên: ChinhQuy.
3. Bấm Tải danh sách để xem các môn đã đăng ký kèm học phí dự kiến.

#### C. Trang Lịch sử thanh toán
- Dùng để kiểm tra giao dịch đã ghi nhận (mã giao dịch, hóa đơn, phương thức, thời gian).

### 4.2. Kế toán

#### A. Trang Quản lý mức học phí
Ở form Thông tin định mức:
- `maMH` và `maHocKy` là danh sách option lấy sẵn từ DB, chọn trực tiếp trên dropdown.
- Dữ liệu mẫu để test nhanh (không trùng seed hiện có):
- maMH: CSDL
- maHocKy: HK2_21-22
- giaPerTinChi: 470000
- loaiSinhVien: ChinhQuy

#### B. Trang Báo cáo tài vụ
1. Khối Phát sinh hóa đơn theo học kỳ:
- maHocKy: HK1_21-22
- hanThanhToan: 2026-12-31
- loaiSinhVien: ChinhQuy
- soTienMienGiamMacDinh: 0

2. Khối Danh sách đăng ký theo kỳ:
- Lọc maHocKy: HK1_21-22
- loaiSinhVien: ChinhQuy

3. Khối Quản lý hóa đơn và miễn giảm:
- Lọc maSV: sv2021003
- Bấm Cập nhật miễn giảm trên hóa đơn HD21_003 và thử nhập 100000.

4. Khối Ghi nhận thanh toán thủ công:
- maHoaDon: HD21_003
- soTienTT: 300000
- phuongThucTT: ChuyenKhoan
- ghiChu: Thu truc tiep dot 1

5. Khối Tổng hợp báo cáo:
- Lọc maNamHoc: 2021-2022
- Bấm Tải tổng hợp để xem dữ liệu theo kỳ.

### 4.3. Admin

#### A. Trang Tạo tài khoản
Nhập thử một tài khoản mới (không trùng mã đã seed):
- maNguoiDung: SV11
- tenDangNhap: sv2021011
- matKhau: pass123
- hoTen: Vu Huu Nghia
- email: nghia.vh@student.vn
- soDienThoai: 0912345681
- vaiTro: SinhVien

#### B. Trang Quản lý tài khoản
- Lọc theo vai trò để rà soát danh sách.
- Dùng các nút Sửa, Đổi mật khẩu, Khóa/Mở khóa để kiểm tra nghiệp vụ quản trị.

#### C. Trang Danh mục đào tạo
Khi nhập danh mục, cần theo đúng quan hệ khóa ngoại trong SQL:

1. Ngành (phụ thuộc Khoa):
- maNganh: AI
- tenNganh: Tri tue nhan tao
- maKhoa: CNTT

2. Lớp (phụ thuộc Ngành):
- maLop: AI_K17A
- tenLop: AI khoa 17A
- nienKhoa: 2023
- maNganh: AI

3. Môn học (phụ thuộc Khoa):
- maMH: AI101
- tenMH: Nhap mon tri tue nhan tao
- soTinChi: 3
- maKhoa: CNTT

4. Sinh viên (phụ thuộc Lớp):
- maSV: sv2023001
- hoTen: Nguyen Van AI
- ngaySinh: 2005-01-15
- gioiTinh: 1
- diaChi: Ha Noi
- email: sv2023001@student.vn
- soDienThoai: 0900003001
- maLop: AI_K17A
- trangThai: DangHoc

5. Năm học:
- maNamHoc: 2032-2033
- tenNamHoc: Nam hoc 2032-2033
- namBatDau: 2032
- namKetThuc: 2033

6. Học kỳ (phụ thuộc Năm học):
- maHocKy: HK1_32-33
- tenHocKy: Hoc ky 1
- hocKySo: 1
- maNamHoc: 2032-2033
- ngayBatDau: 2032-09-01
- ngayKetThuc: 2033-01-15

## 5. Luồng thao tác mẫu nhanh (chỉ thao tác frontend)

1. Đăng nhập Admin bằng admin/pass123, tạo tài khoản SV11.
2. Đăng nhập Kế toán bằng ketoan01/pass123, tạo định mức CSDL + HK2_21-22.
3. Ở trang staff report, ghi nhận thanh toán thủ công cho HD21_003 với 300000.
4. Đăng nhập Sinh viên bằng sv2021003/pass123, vào lịch sử thanh toán để kiểm tra giao dịch vừa ghi nhận.

## 6. Ghi chú nhập liệu để tránh lỗi

- Không nhập mã cha chưa tồn tại, ví dụ maNganh phải có maKhoa hợp lệ trước.
- Các trường mã nên dùng đúng chữ hoa/thường như trong SQL, ví dụ HK1_21-22 và sv2021003.
- Nếu thêm dữ liệu mới bị báo trùng mã, đổi sang mã khác (thêm hậu tố số) rồi nhập lại.
