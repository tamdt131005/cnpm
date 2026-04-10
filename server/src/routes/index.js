import { Router } from 'express';

// Import tất cả route modules
import authRoutes from './auth.route.js';
import nguoiDungRoutes from './nguoidung.route.js';
import studentRoutes from './student.route.js';
import staffRoutes from './staff.route.js';
import adminRoutes from './admin.route.js';

const router = Router();

router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'API thu hoc phi dang hoat dong',
		groups: ['auth', 'nguoidung', 'student', 'staff', 'admin']
	});
});

router.use('/auth', authRoutes); // Xác thực
router.use('/nguoidung', nguoiDungRoutes); // Quản lý người dùng
router.use('/student', studentRoutes); // Cổng sinh viên
router.use('/staff', staffRoutes); // Cổng tài vụ
router.use('/admin', adminRoutes); // Khu vực quản trị

export default router;