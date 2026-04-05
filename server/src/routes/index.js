import { Router } from 'express';

// Import tất cả route modules
import authRoutes from './auth.route.js';
import nguoiDungRoutes from './nguoidung.route.js';

const router = Router();
router.use('/auth', authRoutes);           // Xác thực
router.use('/nguoidung', nguoiDungRoutes); // Quản lý người dùng

export default router;
