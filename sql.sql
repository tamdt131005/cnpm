-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Phiên bản:           12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hocphisinhvien
CREATE DATABASE IF NOT EXISTS `hocphisinhvien` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hocphisinhvien`;

-- Dumping structure for table hocphisinhvien.dangkyhoc
CREATE TABLE IF NOT EXISTS `dangkyhoc` (
  `maDangKy` int NOT NULL AUTO_INCREMENT,
  `maSV` varchar(50) DEFAULT NULL,
  `maMH` varchar(50) DEFAULT NULL,
  `maHocKy` varchar(50) DEFAULT NULL,
  `ngayDangKy` date DEFAULT NULL,
  `trangThai` enum('ThanhCong','Huy','ChoXacNhan') DEFAULT 'ThanhCong',
  PRIMARY KEY (`maDangKy`),
  KEY `maSV` (`maSV`),
  KEY `maMH` (`maMH`),
  KEY `maHocKy` (`maHocKy`),
  CONSTRAINT `dangkyhoc_ibfk_1` FOREIGN KEY (`maSV`) REFERENCES `sinhvien` (`maSV`),
  CONSTRAINT `dangkyhoc_ibfk_2` FOREIGN KEY (`maMH`) REFERENCES `monhoc` (`maMH`),
  CONSTRAINT `dangkyhoc_ibfk_3` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.dangkyhoc: ~0 rows (approximately)
INSERT INTO `dangkyhoc` (`maDangKy`, `maSV`, `maMH`, `maHocKy`, `ngayDangKy`, `trangThai`) VALUES
	(1, 'sv2021001', 'CSDL', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
	(2, 'sv2021001', 'RR', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
	(3, 'sv2021002', 'CSDL', 'HK1_21-22', '2021-08-21', 'ThanhCong'),
	(4, 'sv2021002', 'LTCB', 'HK1_21-22', '2021-08-21', 'ThanhCong'),
	(5, 'sv2021003', 'LTCB', 'HK1_21-22', '2021-08-22', 'ThanhCong'),
	(6, 'sv2021004', 'KTMC', 'HK1_21-22', '2021-08-23', 'ThanhCong'),
	(7, 'sv2021005', 'TA1', 'HK1_21-22', '2021-08-24', 'ThanhCong'),
	(8, 'sv2021006', 'VLDC', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
	(9, 'sv2021007', 'VLDC', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
	(10, 'sv2021008', 'KT1', 'HK1_21-22', '2021-08-20', 'ThanhCong'),
	(11, 'sv2021009', 'NMQTKD', 'HK1_21-22', '2021-08-20', 'ThanhCong');

-- Dumping structure for table hocphisinhvien.hoadonhocphi
CREATE TABLE IF NOT EXISTS `hoadonhocphi` (
  `maHoaDon` varchar(50) NOT NULL,
  `maSV` varchar(50) DEFAULT NULL,
  `maHocKy` varchar(50) DEFAULT NULL,
  `tongTien` decimal(15,2) DEFAULT NULL,
  `soTienMienGiam` decimal(15,2) DEFAULT NULL,
  `soTienPhaiTra` decimal(15,2) DEFAULT NULL,
  `ngayTaoHD` date DEFAULT NULL,
  `hanThanhToan` date DEFAULT NULL,
  `trangThai` enum('ChuaThanhToan','DaThanhToan','ThanhToanMotPhan','QuaHan') DEFAULT 'ChuaThanhToan',
  PRIMARY KEY (`maHoaDon`),
  KEY `maSV` (`maSV`),
  KEY `maHocKy` (`maHocKy`),
  CONSTRAINT `hoadonhocphi_ibfk_1` FOREIGN KEY (`maSV`) REFERENCES `sinhvien` (`maSV`),
  CONSTRAINT `hoadonhocphi_ibfk_2` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.hoadonhocphi: ~0 rows (approximately)
INSERT INTO `hoadonhocphi` (`maHoaDon`, `maSV`, `maHocKy`, `tongTien`, `soTienMienGiam`, `soTienPhaiTra`, `ngayTaoHD`, `hanThanhToan`, `trangThai`) VALUES
	('HD21_001', 'sv2021001', 'HK1_21-22', 2700000.00, 0.00, 2700000.00, '2021-10-01', '2021-11-01', 'DaThanhToan'),
	('HD21_002', 'sv2021002', 'HK1_21-22', 3150000.00, 0.00, 3150000.00, '2021-10-01', '2021-11-01', 'DaThanhToan'),
	('HD21_003', 'sv2021003', 'HK1_21-22', 1800000.00, 0.00, 1800000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_004', 'sv2021004', 'HK1_21-22', 1200000.00, 0.00, 1200000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_005', 'sv2021005', 'HK1_21-22', 700000.00, 0.00, 700000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_006', 'sv2021006', 'HK1_21-22', 1350000.00, 0.00, 1350000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_007', 'sv2021007', 'HK1_21-22', 1350000.00, 0.00, 1350000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_008', 'sv2021008', 'HK1_21-22', 1350000.00, 0.00, 1350000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_009', 'sv2021009', 'HK1_21-22', 800000.00, 0.00, 800000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan'),
	('HD21_010', 'sv2021010', 'HK1_21-22', 450000.00, 0.00, 450000.00, '2021-10-01', '2021-11-01', 'ChuaThanhToan');

-- Dumping structure for table hocphisinhvien.hocky
CREATE TABLE IF NOT EXISTS `hocky` (
  `maHocKy` varchar(50) NOT NULL,
  `tenHocKy` varchar(50) NOT NULL,
  `hocKySo` int DEFAULT NULL,
  `ngayBatDau` date DEFAULT NULL,
  `ngayKetThuc` date DEFAULT NULL,
  `maNamHoc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`maHocKy`),
  KEY `maNamHoc` (`maNamHoc`),
  CONSTRAINT `hocky_ibfk_1` FOREIGN KEY (`maNamHoc`) REFERENCES `namhoc` (`maNamHoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.hocky: ~10 rows (approximately)
INSERT INTO `hocky` (`maHocKy`, `tenHocKy`, `hocKySo`, `ngayBatDau`, `ngayKetThuc`, `maNamHoc`) VALUES
	('HK1_21-22', 'Học kỳ 1', 1, '2021-09-01', '2022-01-15', '2021-2022'),
	('HK1_22-23', 'Học kỳ 1', 1, '2022-09-01', '2023-01-15', '2022-2023'),
	('HK1_23-24', 'Học kỳ 1', 1, '2023-09-01', '2024-01-15', '2023-2024'),
	('HK1_24-25', 'Học kỳ 1', 1, '2024-09-01', '2025-01-15', '2024-2025'),
	('HK1_25-26', 'Học kỳ 1', 1, '2025-09-01', '2026-01-15', '2025-2026'),
	('HK2_21-22', 'Học kỳ 2', 2, '2022-02-15', '2022-06-30', '2021-2022'),
	('HK2_22-23', 'Học kỳ 2', 2, '2023-02-15', '2023-06-30', '2022-2023'),
	('HK2_23-24', 'Học kỳ 2', 2, '2024-02-15', '2024-06-30', '2023-2024'),
	('HK2_24-25', 'Học kỳ 2', 2, '2025-02-15', '2025-06-30', '2024-2025'),
	('HK2_25-26', 'Học kỳ 2', 2, '2026-02-15', '2026-06-30', '2025-2026');

-- Dumping structure for table hocphisinhvien.khoa
CREATE TABLE IF NOT EXISTS `khoa` (
  `maKhoa` varchar(50) NOT NULL,
  `tenKhoa` varchar(100) NOT NULL,
  `truongKhoa` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`maKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.khoa: ~11 rows (approximately)
INSERT INTO `khoa` (`maKhoa`, `tenKhoa`, `truongKhoa`) VALUES
	('CK', 'Cơ khí', 'TS. Đặng Văn Nam'),
	('CNTT', 'Công nghệ thông tin', 'TS. Nguyễn Mạnh Hùng'),
	('DDT', 'Điện - Điện tử', 'TS. Cao Văn Sơn'),
	('DL', 'Du lịch', 'ThS. Vũ Thùy Linh'),
	('KT', 'Kinh tế', 'PGS. TRẦN Lan'),
	('Luat', 'Luật', 'PGS. Ngô Huy Thành'),
	('MT', 'Môi trường', 'ThS. Nguyễn Thị Cúc'),
	('NN', 'Ngoại ngữ', 'ThS. Lê Hoàng'),
	('QTKD', 'Quản trị kinh doanh', 'TS. Hồ Xuân Thắng'),
	('SH', 'Công nghệ sinh học', 'TS. Phạm Lan Hương'),
	('XD', 'Xây dựng', 'TS. Bùi Văn Hải');

-- Dumping structure for table hocphisinhvien.lop
CREATE TABLE IF NOT EXISTS `lop` (
  `maLop` varchar(50) NOT NULL,
  `tenLop` varchar(100) NOT NULL,
  `nienKhoa` int DEFAULT NULL,
  `maNganh` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`maLop`),
  KEY `maNganh` (`maNganh`),
  CONSTRAINT `lop_ibfk_1` FOREIGN KEY (`maNganh`) REFERENCES `nganh` (`maNganh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.lop: ~11 rows (approximately)
INSERT INTO `lop` (`maLop`, `tenLop`, `nienKhoa`, `maNganh`) VALUES
	('CK_K15A', 'Cơ khí Khóa 15', 2021, 'CKCD'),
	('CNTT_K15A', 'CNTT Khóa 15A', 2021, 'KHMT'),
	('CNTT_K15B', 'CNTT Khóa 15B', 2021, 'KTPM'),
	('CNTT_K16A', 'CNTT Khóa 16A', 2022, 'KHMT'),
	('DDT_K15A', 'Điện K15A', 2021, 'DCN'),
	('KT_K15A', 'Kinh tế Khóa 15A', 2021, 'TCNH'),
	('KT_K16A', 'Kinh tế Khóa 16A', 2022, 'KTQT'),
	('NN_K15A', 'Ngoại ngữ Anh K15', 2021, 'NNA'),
	('NN_K16A', 'Ngoại ngữ Hàn K16', 2022, 'NNH'),
	('QTKD_K15A', 'Marketing K15', 2021, 'Marketing'),
	('XD_K15A', 'Xây dựng Khóa 15', 2021, 'KTXD');

-- Dumping structure for table hocphisinhvien.monhoc
CREATE TABLE IF NOT EXISTS `monhoc` (
  `maMH` varchar(50) NOT NULL,
  `tenMH` varchar(100) NOT NULL,
  `soTinChi` int NOT NULL,
  `maKhoa` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`maMH`),
  KEY `maKhoa` (`maKhoa`),
  CONSTRAINT `monhoc_ibfk_1` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.monhoc: ~12 rows (approximately)
INSERT INTO `monhoc` (`maMH`, `tenMH`, `soTinChi`, `maKhoa`) VALUES
	('CSDL', 'Cơ sở dữ liệu', 3, 'CNTT'),
	('GT1', 'Giải tích 1', 4, 'CNTT'),
	('KT1', 'Kỹ thuật điện', 3, 'DDT'),
	('KTMC', 'Kinh tế vĩ mô', 3, 'KT'),
	('LTCB', 'Lập trình cơ bản', 4, 'CNTT'),
	('NMCNTT', 'Nhập môn CNTT', 2, 'CNTT'),
	('NMQTKD', 'Nhập môn QTKD', 2, 'QTKD'),
	('RR', 'Toán rời rạc', 3, 'CNTT'),
	('TA1', 'Tiếng Anh 1', 2, 'NN'),
	('Tckt', 'Tài chính kế toán', 3, 'KT'),
	('THDC', 'Tin học đại cương', 2, 'CNTT'),
	('VLDC', 'Vật lý đại cương', 3, 'CK');

-- Dumping structure for table hocphisinhvien.muchocphi
CREATE TABLE IF NOT EXISTS `muchocphi` (
  `maMucHP` int NOT NULL AUTO_INCREMENT,
  `maMH` varchar(50) DEFAULT NULL,
  `maHocKy` varchar(50) DEFAULT NULL,
  `giaPerTinChi` decimal(15,2) DEFAULT NULL,
  `loaiSinhVien` enum('ChinhQuy','LienThong','VanBang2') DEFAULT 'ChinhQuy',
  PRIMARY KEY (`maMucHP`),
  KEY `maMH` (`maMH`),
  KEY `maHocKy` (`maHocKy`),
  CONSTRAINT `muchocphi_ibfk_1` FOREIGN KEY (`maMH`) REFERENCES `monhoc` (`maMH`),
  CONSTRAINT `muchocphi_ibfk_2` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.muchocphi: ~0 rows (approximately)
INSERT INTO `muchocphi` (`maMucHP`, `maMH`, `maHocKy`, `giaPerTinChi`, `loaiSinhVien`) VALUES
	(1, 'CSDL', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(2, 'RR', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(3, 'LTCB', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(4, 'KTMC', 'HK1_21-22', 400000.00, 'ChinhQuy'),
	(5, 'Tckt', 'HK1_21-22', 400000.00, 'ChinhQuy'),
	(6, 'TA1', 'HK1_21-22', 350000.00, 'ChinhQuy'),
	(7, 'VLDC', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(8, 'THDC', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(9, 'KT1', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(10, 'GT1', 'HK1_21-22', 450000.00, 'ChinhQuy'),
	(11, 'NMQTKD', 'HK1_21-22', 400000.00, 'ChinhQuy');

-- Dumping structure for table hocphisinhvien.namhoc
CREATE TABLE IF NOT EXISTS `namhoc` (
  `maNamHoc` varchar(50) NOT NULL,
  `tenNamHoc` varchar(50) NOT NULL,
  `namBatDau` int DEFAULT NULL,
  `namKetThuc` int DEFAULT NULL,
  PRIMARY KEY (`maNamHoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.namhoc: ~11 rows (approximately)
INSERT INTO `namhoc` (`maNamHoc`, `tenNamHoc`, `namBatDau`, `namKetThuc`) VALUES
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

-- Dumping structure for table hocphisinhvien.nganh
CREATE TABLE IF NOT EXISTS `nganh` (
  `maNganh` varchar(50) NOT NULL,
  `tenNganh` varchar(100) NOT NULL,
  `maKhoa` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`maNganh`),
  KEY `maKhoa` (`maKhoa`),
  CONSTRAINT `nganh_ibfk_1` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.nganh: ~12 rows (approximately)
INSERT INTO `nganh` (`maNganh`, `tenNganh`, `maKhoa`) VALUES
	('CKCD', 'Cơ khí chế tạo', 'CK'),
	('DCN', 'Điện công nghiệp', 'DDT'),
	('HTTT', 'Hệ thống thông tin', 'CNTT'),
	('KHMT', 'Khoa học máy tính', 'CNTT'),
	('KTPM', 'Kỹ thuật phần mềm', 'CNTT'),
	('KTQT', 'Kinh tế quốc tế', 'KT'),
	('KTXD', 'Kỹ thuật xây dựng', 'XD'),
	('Marketing', 'Marketing', 'QTKD'),
	('NNA', 'Ngôn ngữ Anh', 'NN'),
	('NNH', 'Ngôn ngữ Hàn', 'NN'),
	('OT', 'Kỹ thuật ô tô', 'CK'),
	('TCNH', 'Tài chính ngân hàng', 'KT');

-- Dumping structure for table hocphisinhvien.nguoidung
CREATE TABLE IF NOT EXISTS `nguoidung` (
  `maNguoiDung` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tenDangNhap` varchar(50) NOT NULL,
  `matKhau` varchar(255) NOT NULL,
  `hoTen` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `soDienThoai` varchar(20) DEFAULT NULL,
  `vaiTro` enum('Admin','KeToan','SinhVien') DEFAULT 'SinhVien',
  `ngayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`maNguoiDung`) USING BTREE,
  UNIQUE KEY `tenDangNhap` (`tenDangNhap`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.nguoidung: ~7 rows (approximately)
INSERT INTO `nguoidung` (`maNguoiDung`, `tenDangNhap`, `matKhau`, `hoTen`, `email`, `soDienThoai`, `vaiTro`, `ngayTao`) VALUES
	('AD01', 'admin', 'pass123', 'Vũ Văn Quản', 'admin@edu.vn', NULL, 'Admin', '2026-04-03 21:31:34'),
	('KT01', 'ketoan01', 'pass123', 'Lê Thị Ngân', 'nganlt@edu.vn', NULL, 'KeToan', '2026-04-03 21:31:34'),
	('KT02', 'ketoan02', 'pass123', 'Trần Văn Quỹ', 'quytv@edu.vn', NULL, 'KeToan', '2026-04-03 21:31:34'),
	('SV01', 'sv2021001', 'pass123', 'Nguyễn Văn An', 'an.nv@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV02', 'sv2021002', 'pass123', 'Trần Thị Bình', 'binh.tt@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV03', 'sv2021003', 'pass123', 'Lê Công Chiến', 'chien.lc@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV04', 'sv2021004', 'pass123', 'Phạm Minh Danh', 'danh.pm@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV05', 'sv2021005', 'pass123', 'Hoàng Thu Thảo', 'thao.ht@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV06', 'sv2021006', 'pass123', 'Ngô Quang Hiếu', 'hieu.nq@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV07', 'sv2021007', 'pass123', 'Đặng Phương Linh', 'linh.dp@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV08', 'sv2021008', 'pass123', 'Bùi Xuân Thành', 'thanh.bx@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV09', 'sv2021009', 'pass123', 'Lương Minh Tâm', 'tam.lm@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34'),
	('SV10', 'sv2021010', 'pass123', 'Trịnh Gia Hưng', 'hung.tg@student.vn', NULL, 'SinhVien', '2026-04-03 21:31:34');

-- Dumping structure for table hocphisinhvien.sinhvien
CREATE TABLE IF NOT EXISTS `sinhvien` (
  `maSV` varchar(50) NOT NULL,
  `hoTen` varchar(100) NOT NULL,
  `ngaySinh` date DEFAULT NULL,
  `gioiTinh` tinyint(1) DEFAULT NULL,
  `diaChi` text,
  `email` varchar(100) DEFAULT NULL,
  `soDienThoai` varchar(20) DEFAULT NULL,
  `maLop` varchar(50) DEFAULT NULL,
  `trangThai` enum('DangHoc','BaoLuu','DaTotNghiep','ThoiHoc') DEFAULT 'DangHoc',
  PRIMARY KEY (`maSV`),
  KEY `maLop` (`maLop`),
  CONSTRAINT `sinhvien_ibfk_1` FOREIGN KEY (`maLop`) REFERENCES `lop` (`maLop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.sinhvien: ~11 rows (approximately)
INSERT INTO `sinhvien` (`maSV`, `hoTen`, `ngaySinh`, `gioiTinh`, `diaChi`, `email`, `soDienThoai`, `maLop`, `trangThai`) VALUES
	('sv2021001', 'Nguyễn Văn An', '2003-01-05', 1, 'Hà Nội', 'an.nv@student.vn', '0912345671', 'CNTT_K15A', 'DangHoc'),
	('sv2021002', 'Trần Thị Bình', '2003-02-15', 0, 'Hải Phòng', 'binh.tt@student.vn', '0912345672', 'CNTT_K15A', 'DangHoc'),
	('sv2021003', 'Lê Công Chiến', '2003-03-25', 1, 'Đà Nẵng', 'chien.lc@student.vn', '0912345673', 'CNTT_K15B', 'DangHoc'),
	('sv2021004', 'Phạm Minh Danh', '2003-04-10', 1, 'TP.HCM', 'danh.pm@student.vn', '0912345674', 'KT_K15A', 'DangHoc'),
	('sv2021005', 'Hoàng Thu Thảo', '2003-05-20', 0, 'Cần Thơ', 'thao.ht@student.vn', '0912345675', 'NN_K15A', 'DangHoc'),
	('sv2021006', 'Ngô Quang Hiếu', '2003-06-30', 1, 'Bắc Ninh', 'hieu.nq@student.vn', '0912345676', 'XD_K15A', 'DangHoc'),
	('sv2021007', 'Đặng Phương Linh', '2003-07-05', 0, 'Hải Dương', 'linh.dp@student.vn', '0912345677', 'CK_K15A', 'DangHoc'),
	('sv2021008', 'Bùi Xuân Thành', '2003-08-12', 1, 'Nam Định', 'thanh.bx@student.vn', '0912345678', 'DDT_K15A', 'DangHoc'),
	('sv2021009', 'Lương Minh Tâm', '2003-09-22', 1, 'Thái Bình', 'tam.lm@student.vn', '0912345679', 'QTKD_K15A', 'DangHoc'),
	('sv2021010', 'Trịnh Gia Hưng', '2003-10-14', 1, 'Nghệ An', 'hung.tg@student.vn', '0912345680', 'CNTT_K15A', 'DangHoc'),
	('sv2021011', 'Vũ Hữu Nghĩa', '2003-11-28', 1, 'Hà Tĩnh', 'nghia.vh@student.vn', '0912345681', 'CNTT_K15B', 'DangHoc');

-- Dumping structure for table hocphisinhvien.thanhtoan
CREATE TABLE IF NOT EXISTS `thanhtoan` (
  `maThanhToan` varchar(50) NOT NULL,
  `maHoaDon` varchar(50) DEFAULT NULL,
  `maNguoiDung` varchar(50) DEFAULT NULL,
  `soTienTT` decimal(15,2) DEFAULT NULL,
  `ngayThanhToan` datetime DEFAULT NULL,
  `phuongThucTT` enum('TienMat','ChuyenKhoan','The','ViDienTu') DEFAULT 'ChuyenKhoan',
  `ghiChu` text,
  PRIMARY KEY (`maThanhToan`),
  KEY `maHoaDon` (`maHoaDon`),
  KEY `maNguoiDung` (`maNguoiDung`),
  CONSTRAINT `thanhtoan_ibfk_1` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadonhocphi` (`maHoaDon`),
  CONSTRAINT `thanhtoan_ibfk_2` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table hocphisinhvien.thanhtoan: ~11 rows (approximately)
INSERT INTO `thanhtoan` (`maThanhToan`, `maHoaDon`, `maNguoiDung`, `soTienTT`, `ngayThanhToan`, `phuongThucTT`, `ghiChu`) VALUES
	('TT21_001', 'HD21_001', 'KT01', 2700000.00, '2021-10-15 10:30:00', 'ChuyenKhoan', NULL),
	('TT21_002', 'HD21_002', 'KT01', 3150000.00, '2021-10-16 14:20:00', 'TienMat', NULL),
	('TT21_003', 'HD21_004', 'KT02', 500000.00, '2021-10-20 09:00:00', 'ViDienTu', NULL),
	('TT21_004', 'HD21_001', 'KT01', 100000.00, '2021-10-21 10:30:00', 'ChuyenKhoan', NULL),
	('TT21_005', 'HD21_002', 'KT02', 200000.00, '2021-10-22 14:20:00', 'TienMat', NULL),
	('TT21_006', 'HD21_003', 'KT01', 300000.00, '2021-10-23 10:30:00', 'ChuyenKhoan', NULL),
	('TT21_007', 'HD21_005', 'KT02', 400000.00, '2021-10-24 14:20:00', 'TienMat', NULL),
	('TT21_008', 'HD21_006', 'KT01', 500000.00, '2021-10-25 10:30:00', 'ChuyenKhoan', NULL),
	('TT21_009', 'HD21_007', 'KT02', 600000.00, '2021-10-26 14:20:00', 'TienMat', NULL),
	('TT21_010', 'HD21_008', 'KT01', 700000.00, '2021-10-27 10:30:00', 'ChuyenKhoan', NULL),
	('TT21_011', 'HD21_009', 'KT02', 800000.00, '2021-10-28 14:20:00', 'TienMat', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
