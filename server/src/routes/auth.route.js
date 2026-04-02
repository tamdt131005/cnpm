import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator.js';
import authController from '../controllers/auth.controller.js';

const router = Router();

// POST /auth/login - Đăng nhập (public, không cần token)
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/change-password - Đổi mật khẩu (cần đăng nhập)
router.post('/change-password', verifyToken, validate(changePasswordSchema), authController.changePassword);

// GET /auth/me - Lấy thông tin user hiện tại (cần đăng nhập)
router.get('/me', verifyToken, authController.getMe);

export default router;
