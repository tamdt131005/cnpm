import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema } from '../validators/thanhtoan.validator.js';
import thanhToanController from '../controllers/thanhtoan.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), thanhToanController.getAll);
router.get('/hoadon/:maHD', authorize('Admin', 'KeToan', 'SinhVien'), thanhToanController.getByHoaDon);
router.post('/', authorize('KeToan'), validate(createSchema), thanhToanController.create);

export default router;
