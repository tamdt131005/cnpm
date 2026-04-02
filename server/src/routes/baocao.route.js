import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import baoCaoController from '../controllers/baocao.controller.js';

const router = Router();

router.use(verifyToken);

// Admin & Kế toán - Báo cáo thống kê
router.get('/tong-thu', authorize('Admin', 'KeToan'), baoCaoController.tongThu);
router.get('/chua-dong', authorize('Admin', 'KeToan'), baoCaoController.dsSVChuaDong);
router.get('/thong-ke-khoa', authorize('Admin', 'KeToan'), baoCaoController.thongKeTheoKhoa);

// Sinh viên - Tra cứu cá nhân
router.get('/tra-cuu', authorize('SinhVien'), baoCaoController.traCuuCaNhan);

export default router;
