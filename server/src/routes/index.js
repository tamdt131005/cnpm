import { Router } from 'express';

// Import tất cả route modules
import authRoutes from './auth.route.js';
import nguoiDungRoutes from './nguoidung.route.js';
import sinhVienRoutes from './sinhvien.route.js';
import khoaRoutes from './khoa.route.js';
import nganhRoutes from './nganh.route.js';
import lopRoutes from './lop.route.js';
import monHocRoutes from './monhoc.route.js';
import namHocRoutes from './namhoc.route.js';
import hocKyRoutes from './hocky.route.js';
import mucHocPhiRoutes from './muchocphi.route.js';
import dangKyHocRoutes from './dangkyhoc.route.js';
import hoaDonRoutes from './hoadon.route.js';
import thanhToanRoutes from './thanhtoan.route.js';
import baoCaoRoutes from './baocao.route.js';

const router = Router();

// ===== Mount tất cả routes =====
router.use('/auth', authRoutes);           // Xác thực
router.use('/nguoidung', nguoiDungRoutes); // Quản lý người dùng
router.use('/sinhvien', sinhVienRoutes);   // Quản lý sinh viên
router.use('/khoa', khoaRoutes);           // Quản lý khoa
router.use('/nganh', nganhRoutes);         // Quản lý ngành
router.use('/lop', lopRoutes);             // Quản lý lớp
router.use('/monhoc', monHocRoutes);       // Quản lý môn học
router.use('/namhoc', namHocRoutes);       // Quản lý năm học
router.use('/hocky', hocKyRoutes);         // Quản lý học kỳ
router.use('/muchocphi', mucHocPhiRoutes); // Quản lý mức học phí
router.use('/dangkyhoc', dangKyHocRoutes); // Quản lý đăng ký học
router.use('/hoadon', hoaDonRoutes);       // Quản lý hóa đơn
router.use('/thanhtoan', thanhToanRoutes); // Quản lý thanh toán
router.use('/baocao', baoCaoRoutes);       // Báo cáo & thống kê

export default router;
