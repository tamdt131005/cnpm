-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS HocPhiSinhVien;
USE HocPhiSinhVien;

-- Bảng NGUOIDUNG (Người dùng hệ thống)
CREATE TABLE NGUOIDUNG (
    maNguoiDung VARCHAR(50) PRIMARY KEY,
    tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    hoTen VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    soDienThoai VARCHAR(20),
    vaiTro ENUM('Admin', 'KeToan', 'SinhVien') DEFAULT 'SinhVien',
    trangThai BOOLEAN DEFAULT TRUE,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng KHOA
CREATE TABLE KHOA (
    maKhoa VARCHAR(50) PRIMARY KEY,
    tenKhoa VARCHAR(100) NOT NULL,
    truongKhoa VARCHAR(100)
);

-- Bảng NGANH
CREATE TABLE NGANH (
    maNganh VARCHAR(50) PRIMARY KEY,
    tenNganh VARCHAR(100) NOT NULL,
    maKhoa VARCHAR(50),
    FOREIGN KEY (maKhoa) REFERENCES KHOA(maKhoa)
);

-- Bảng LOP
CREATE TABLE LOP (
    maLop VARCHAR(50) PRIMARY KEY,
    tenLop VARCHAR(100) NOT NULL,
    nienKhoa INT,
    maNganh VARCHAR(50),
    FOREIGN KEY (maNganh) REFERENCES NGANH(maNganh)
);

-- Bảng SINHVIEN
CREATE TABLE SINHVIEN (
    maSV VARCHAR(50) PRIMARY KEY,
    hoTen VARCHAR(100) NOT NULL,
    ngaySinh DATE,
    gioiTinh BOOLEAN,
    diaChi TEXT,
    email VARCHAR(100),
    soDienThoai VARCHAR(20),
    maLop VARCHAR(50),
    trangThai ENUM('DangHoc', 'BaoLuu', 'DaTotNghiep', 'ThoiHoc') DEFAULT 'DangHoc',
    FOREIGN KEY (maLop) REFERENCES LOP(maLop)
);

-- Bảng NAMHOC
CREATE TABLE NAMHOC (
    maNamHoc VARCHAR(50) PRIMARY KEY,
    tenNamHoc VARCHAR(50) NOT NULL,
    namBatDau INT,
    namKetThuc INT
);

-- Bảng HOCKY
CREATE TABLE HOCKY (
    maHocKy VARCHAR(50) PRIMARY KEY,
    tenHocKy VARCHAR(50) NOT NULL,
    hocKySo INT,
    ngayBatDau DATE,
    ngayKetThuc DATE,
    maNamHoc VARCHAR(50),
    FOREIGN KEY (maNamHoc) REFERENCES NAMHOC(maNamHoc)
);

-- Bảng MONHOC
CREATE TABLE MONHOC (
    maMH VARCHAR(50) PRIMARY KEY,
    tenMH VARCHAR(100) NOT NULL,
    soTinChi INT NOT NULL,
    maKhoa VARCHAR(50),
    FOREIGN KEY (maKhoa) REFERENCES KHOA(maKhoa)
);

-- Bảng DANGKYHOC
CREATE TABLE DANGKYHOC (
    maDangKy INT AUTO_INCREMENT PRIMARY KEY,
    maSV VARCHAR(50),
    maMH VARCHAR(50),
    maHocKy VARCHAR(50),
    ngayDangKy DATE,
    trangThai ENUM('ThanhCong', 'Huy', 'ChoXacNhan') DEFAULT 'ThanhCong',
    FOREIGN KEY (maSV) REFERENCES SINHVIEN(maSV),
    FOREIGN KEY (maMH) REFERENCES MONHOC(maMH),
    FOREIGN KEY (maHocKy) REFERENCES HOCKY(maHocKy)
);

-- Bảng MUCHOCPHI
CREATE TABLE MUCHOCPHI (
    maMucHP INT AUTO_INCREMENT PRIMARY KEY,
    maMH VARCHAR(50),
    maHocKy VARCHAR(50),
    giaPerTinChi DECIMAL(15, 2),
    loaiSinhVien ENUM('ChinhQuy', 'LienThong', 'VanBang2') DEFAULT 'ChinhQuy',
    FOREIGN KEY (maMH) REFERENCES MONHOC(maMH),
    FOREIGN KEY (maHocKy) REFERENCES HOCKY(maHocKy)
);

-- Bảng HOADONHOCPHI
CREATE TABLE HOADONHOCPHI (
    maHoaDon VARCHAR(50) PRIMARY KEY,
    maSV VARCHAR(50),
    maHocKy VARCHAR(50),
    tongTien DECIMAL(15, 2),
    soTienMienGiam DECIMAL(15, 2),
    soTienPhaiTra DECIMAL(15, 2),
    ngayTaoHD DATE,
    hanThanhToan DATE,
    trangThai ENUM('ChuaThanhToan', 'DaThanhToan', 'ThanhToanMotPhan', 'QuaHan') DEFAULT 'ChuaThanhToan',
    FOREIGN KEY (maSV) REFERENCES SINHVIEN(maSV),
    FOREIGN KEY (maHocKy) REFERENCES HOCKY(maHocKy)
);

-- Bảng THANHTOAN
CREATE TABLE THANHTOAN (
    maThanhToan VARCHAR(50) PRIMARY KEY,
    maHoaDon VARCHAR(50),
    maNguoiDung VARCHAR(50),
    soTienTT DECIMAL(15, 2),
    ngayThanhToan DATETIME,
    phuongThucTT ENUM('TienMat', 'ChuyenKhoan', 'The', 'ViDienTu') DEFAULT 'ChuyenKhoan',
    ghiChu TEXT,
    FOREIGN KEY (maHoaDon) REFERENCES HOADONHOCPHI(maHoaDon),
    FOREIGN KEY (maNguoiDung) REFERENCES NGUOIDUNG(maNguoiDung)
);

-- --- DỮ LIỆU MẪU (MỖI BẢNG TRÊN 10 DÒNG) ---

-- 1. NGUOIDUNG
INSERT INTO NGUOIDUNG (maNguoiDung, tenDangNhap, matKhau, hoTen, email, vaiTro) VALUES
('AD01', 'admin', 'pass123', 'Vũ Văn Quản', 'admin@edu.vn', 'Admin'),
('KT01', 'ketoan01', 'pass123', 'Lê Thị Ngân', 'nganlt@edu.vn', 'KeToan'),
('KT02', 'ketoan02', 'pass123', 'Trần Văn Quỹ', 'quytv@edu.vn', 'KeToan'),
('SV01', 'sv2021001', 'pass123', 'Nguyễn Văn An', 'an.nv@student.vn', 'SinhVien'),
('SV02', 'sv2021002', 'pass123', 'Trần Thị Bình', 'binh.tt@student.vn', 'SinhVien'),
('SV03', 'sv2021003', 'pass123', 'Lê Công Chiến', 'chien.lc@student.vn', 'SinhVien'),
('SV04', 'sv2021004', 'pass123', 'Phạm Minh Danh', 'danh.pm@student.vn', 'SinhVien'),
('SV05', 'sv2021005', 'pass123', 'Hoàng Thu Thảo', 'thao.ht@student.vn', 'SinhVien'),
('SV06', 'sv2021006', 'pass123', 'Ngô Quang Hiếu', 'hieu.nq@student.vn', 'SinhVien'),
('SV07', 'sv2021007', 'pass123', 'Đặng Phương Linh', 'linh.dp@student.vn', 'SinhVien'),
('SV08', 'sv2021008', 'pass123', 'Bùi Xuân Thành', 'thanh.bx@student.vn', 'SinhVien'),
('SV09', 'sv2021009', 'pass123', 'Lương Minh Tâm', 'tam.lm@student.vn', 'SinhVien'),
('SV10', 'sv2021010', 'pass123', 'Trịnh Gia Hưng', 'hung.tg@student.vn', 'SinhVien');

-- 2. KHOA
INSERT INTO KHOA (maKhoa, tenKhoa, truongKhoa) VALUES
('CNTT', 'Công nghệ thông tin', 'TS. Nguyễn Mạnh Hùng'),
('KT', 'Kinh tế', 'PGS. TRẦN Lan'),
('NN', 'Ngoại ngữ', 'ThS. Lê Hoàng'),
('CK', 'Cơ khí', 'TS. Đặng Văn Nam'),
('XD', 'Xây dựng', 'TS. Bùi Văn Hải'),
('DDT', 'Điện - Điện tử', 'TS. Cao Văn Sơn'),
('SH', 'Công nghệ sinh học', 'TS. Phạm Lan Hương'),
('MT', 'Môi trường', 'ThS. Nguyễn Thị Cúc'),
('QTKD', 'Quản trị kinh doanh', 'TS. Hồ Xuân Thắng'),
('Luat', 'Luật', 'PGS. Ngô Huy Thành'),
('DL', 'Du lịch', 'ThS. Vũ Thùy Linh');

-- 3. NGANH
INSERT INTO NGANH (maNganh, tenNganh, maKhoa) VALUES
('KHMT', 'Khoa học máy tính', 'CNTT'),
('KTPM', 'Kỹ thuật phần mềm', 'CNTT'),
('HTTT', 'Hệ thống thông tin', 'CNTT'),
('TCNH', 'Tài chính ngân hàng', 'KT'),
('KTQT', 'Kinh tế quốc tế', 'KT'),
('NNA', 'Ngôn ngữ Anh', 'NN'),
('NNH', 'Ngôn ngữ Hàn', 'NN'),
('CKCD', 'Cơ khí chế tạo', 'CK'),
('OT', 'Kỹ thuật ô tô', 'CK'),
('KTXD', 'Kỹ thuật xây dựng', 'XD'),
('DCN', 'Điện công nghiệp', 'DDT'),
('Marketing', 'Marketing', 'QTKD');

-- 4. LOP
INSERT INTO LOP (maLop, tenLop, nienKhoa, maNganh) VALUES
('CNTT_K15A', 'CNTT Khóa 15A', 2021, 'KHMT'),
('CNTT_K15B', 'CNTT Khóa 15B', 2021, 'KTPM'),
('KT_K15A', 'Kinh tế Khóa 15A', 2021, 'TCNH'),
('NN_K15A', 'Ngoại ngữ Anh K15', 2021, 'NNA'),
('XD_K15A', 'Xây dựng Khóa 15', 2021, 'KTXD'),
('CK_K15A', 'Cơ khí Khóa 15', 2021, 'CKCD'),
('DDT_K15A', 'Điện K15A', 2021, 'DCN'),
('QTKD_K15A', 'Marketing K15', 2021, 'Marketing'),
('CNTT_K16A', 'CNTT Khóa 16A', 2022, 'KHMT'),
('KT_K16A', 'Kinh tế Khóa 16A', 2022, 'KTQT'),
('NN_K16A', 'Ngoại ngữ Hàn K16', 2022, 'NNH');

-- 5. SINHVIEN
INSERT INTO SINHVIEN (maSV, hoTen, ngaySinh, gioiTinh, diaChi, email, soDienThoai, maLop) VALUES
('sv2021001', 'Nguyễn Văn An', '2003-01-05', 1, 'Hà Nội', 'an.nv@student.vn', '0912345671', 'CNTT_K15A'),
('sv2021002', 'Trần Thị Bình', '2003-02-15', 0, 'Hải Phòng', 'binh.tt@student.vn', '0912345672', 'CNTT_K15A'),
('sv2021003', 'Lê Công Chiến', '2003-03-25', 1, 'Đà Nẵng', 'chien.lc@student.vn', '0912345673', 'CNTT_K15B'),
('sv2021004', 'Phạm Minh Danh', '2003-04-10', 1, 'TP.HCM', 'danh.pm@student.vn', '0912345674', 'KT_K15A'),
('sv2021005', 'Hoàng Thu Thảo', '2003-05-20', 0, 'Cần Thơ', 'thao.ht@student.vn', '0912345675', 'NN_K15A'),
('sv2021006', 'Ngô Quang Hiếu', '2003-06-30', 1, 'Bắc Ninh', 'hieu.nq@student.vn', '0912345676', 'XD_K15A'),
('sv2021007', 'Đặng Phương Linh', '2003-07-05', 0, 'Hải Dương', 'linh.dp@student.vn', '0912345677', 'CK_K15A'),
('sv2021008', 'Bùi Xuân Thành', '2003-08-12', 1, 'Nam Định', 'thanh.bx@student.vn', '0912345678', 'DDT_K15A'),
('sv2021009', 'Lương Minh Tâm', '2003-09-22', 1, 'Thái Bình', 'tam.lm@student.vn', '0912345679', 'QTKD_K15A'),
('sv2021010', 'Trịnh Gia Hưng', '2003-10-14', 1, 'Nghệ An', 'hung.tg@student.vn', '0912345680', 'CNTT_K15A'),
('sv2021011', 'Vũ Hữu Nghĩa', '2003-11-28', 1, 'Hà Tĩnh', 'nghia.vh@student.vn', '0912345681', 'CNTT_K15B');

-- 6. NAMHOC
INSERT INTO NAMHOC (maNamHoc, tenNamHoc, namBatDau, namKetThuc) VALUES
('2021-2022', 'Năm học 2021-2022', 2021, 2022),
('2022-2023', 'Năm học 2022-2023', 2022, 2023),
('2023-2024', 'Năm học 2023-2024', 2023, 2024),
('2024-2025', 'Năm học 2024-2025', 2024, 2025),
('2025-2026', 'Năm học 2025-2026', 2025, 2026),
('2026-2027', 'Năm học 2026-2027', 2026, 2027),
('2027-2028', 'Năm học 2027-2028', 2027, 2028),
('2028-2029', 'Năm học 2028-2029', 2028, 2029),
('2029-2030', 'Năm học 2029-2030', 2029, 2030),
('2030-2031', 'Năm học 2030-2031', 2030, 2031),
('2031-2032', 'Năm học 2031-2032', 2031, 2032);

-- 7. HOCKY
INSERT INTO HOCKY (maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc) VALUES
('HK1_21-22', 'Học kỳ 1', 1, '2021-09-01', '2022-01-15', '2021-2022'),
('HK2_21-22', 'Học kỳ 2', 2, '2022-02-15', '2022-06-30', '2021-2022'),
('HK1_22-23', 'Học kỳ 1', 1, '2022-09-01', '2023-01-15', '2022-2023'),
('HK2_22-23', 'Học kỳ 2', 2, '2023-02-15', '2023-06-30', '2022-2023'),
('HK1_23-24', 'Học kỳ 1', 1, '2023-09-01', '2024-01-15', '2023-2024'),
('HK2_23-24', 'Học kỳ 2', 2, '2024-02-15', '2024-06-30', '2023-2024'),
('HK1_24-25', 'Học kỳ 1', 1, '2024-09-01', '2025-01-15', '2024-2025'),
('HK2_24-25', 'Học kỳ 2', 2, '2025-02-15', '2025-06-30', '2024-2025'),
('HK1_25-26', 'Học kỳ 1', 1, '2025-09-01', '2026-01-15', '2025-2026'),
('HK2_25-26', 'Học kỳ 2', 2, '2026-02-15', '2026-06-30', '2025-2026');

-- 8. MONHOC
INSERT INTO MONHOC (maMH, tenMH, soTinChi, maKhoa) VALUES
('CSDL', 'Cơ sở dữ liệu', 3, 'CNTT'),
('RR', 'Toán rời rạc', 3, 'CNTT'),
('LTCB', 'Lập trình cơ bản', 4, 'CNTT'),
('KTMC', 'Kinh tế vĩ mô', 3, 'KT'),
('Tckt', 'Tài chính kế toán', 3, 'KT'),
('TA1', 'Tiếng Anh 1', 2, 'NN'),
('VLDC', 'Vật lý đại cương', 3, 'CK'),
('THDC', 'Tin học đại cương', 2, 'CNTT'),
('KT1', 'Kỹ thuật điện', 3, 'DDT'),
('GT1', 'Giải tích 1', 4, 'CNTT'),
('NMCNTT', 'Nhập môn CNTT', 2, 'CNTT'),
('NMQTKD', 'Nhập môn QTKD', 2, 'QTKD');

-- 9. MUCHOCPHI
INSERT INTO MUCHOCPHI (maMH, maHocKy, giaPerTinChi, loaiSinhVien) VALUES
('CSDL', 'HK1_21-22', 450000, 'ChinhQuy'),
('RR', 'HK1_21-22', 450000, 'ChinhQuy'),
('LTCB', 'HK1_21-22', 450000, 'ChinhQuy'),
('KTMC', 'HK1_21-22', 400000, 'ChinhQuy'),
('Tckt', 'HK1_21-22', 400000, 'ChinhQuy'),
('TA1', 'HK1_21-22', 350000, 'ChinhQuy'),
('VLDC', 'HK1_21-22', 450000, 'ChinhQuy'),
('THDC', 'HK1_21-22', 450000, 'ChinhQuy'),
('KT1', 'HK1_21-22', 450000, 'ChinhQuy'),
('GT1', 'HK1_21-22', 450000, 'ChinhQuy'),
('NMQTKD', 'HK1_21-22', 400000, 'ChinhQuy');

-- 10. DANGKYHOC
INSERT INTO DANGKYHOC (maSV, maMH, maHocKy, ngayDangKy, trangThai) VALUES
('sv2021001', 'CSDL', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
('sv2021001', 'RR', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
('sv2021002', 'CSDL', 'HK1_21-22', '2021-08-21', 'ThanhCong'),
('sv2021002', 'LTCB', 'HK1_21-22', '2021-08-21', 'ThanhCong'),
('sv2021003', 'LTCB', 'HK1_21-22', '2021-08-22', 'ThanhCong'),
('sv2021004', 'KTMC', 'HK1_21-22', '2021-08-23', 'ThanhCong'),
('sv2021005', 'TA1', 'HK1_21-22', '2021-08-24', 'ThanhCong'),
('sv2021006', 'VLDC', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
('sv2021007', 'VLDC', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
('sv2021008', 'KT1', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
('sv2021009', 'NMQTKD', 'HK1_21-22', '2021-08-20', 'ThanhCong');

-- 11. HOADONHOCPHI
INSERT INTO HOADONHOCPHI (maHoaDon, maSV, maHocKy, tongTien, soTienMienGiam, soTienPhaiTra, ngayTaoHD, hanThanhToan, trangThai) VALUES
('HD21_001', 'sv2021001', 'HK1_21-22', 2700000, 0, 2700000, '2021-10-01', '2021-11-01', 'DaThanhToan'),
('HD21_002', 'sv2021002', 'HK1_21-22', 3150000, 0, 3150000, '2021-10-01', '2021-11-01', 'DaThanhToan'),
('HD21_003', 'sv2021003', 'HK1_21-22', 1800000, 0, 1800000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_004', 'sv2021004', 'HK1_21-22', 1200000, 0, 1200000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_005', 'sv2021005', 'HK1_21-22', 700000, 0, 700000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_006', 'sv2021006', 'HK1_21-22', 1350000, 0, 1350000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_007', 'sv2021007', 'HK1_21-22', 1350000, 0, 1350000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_008', 'sv2021008', 'HK1_21-22', 1350000, 0, 1350000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_009', 'sv2021009', 'HK1_21-22', 800000, 0, 800000, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
('HD21_010', 'sv2021010', 'HK1_21-22', 450000, 0, 450000, '2021-10-01', '2021-11-01', 'ChuaThanhToan');

-- 12. THANHTOAN
INSERT INTO THANHTOAN (maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT) VALUES
('TT21_001', 'HD21_001', 'KT01', 2700000, '2021-10-15 10:30:00', 'ChuyenKhoan'),
('TT21_002', 'HD21_002', 'KT01', 3150000, '2021-10-16 14:20:00', 'TienMat'),
('TT21_003', 'HD21_004', 'KT02', 500000, '2021-10-20 09:00:00', 'ViDienTu'),
('TT21_004', 'HD21_001', 'KT01', 100000, '2021-10-21 10:30:00', 'ChuyenKhoan'),
('TT21_005', 'HD21_002', 'KT02', 200000, '2021-10-22 14:20:00', 'TienMat'),
('TT21_006', 'HD21_003', 'KT01', 300000, '2021-10-23 10:30:00', 'ChuyenKhoan'),
('TT21_007', 'HD21_005', 'KT02', 400000, '2021-10-24 14:20:00', 'TienMat'),
('TT21_008', 'HD21_006', 'KT01', 500000, '2021-10-25 10:30:00', 'ChuyenKhoan'),
('TT21_009', 'HD21_007', 'KT02', 600000, '2021-10-26 14:20:00', 'TienMat'),
('TT21_010', 'HD21_008', 'KT01', 700000, '2021-10-27 10:30:00', 'ChuyenKhoan'),
('TT21_011', 'HD21_009', 'KT02', 800000, '2021-10-28 14:20:00', 'TienMat');
