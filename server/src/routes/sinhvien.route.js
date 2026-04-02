import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema, updateStatusSchema } from '../validators/sinhvien.validator.js';
import sinhVienController from '../controllers/sinhvien.controller.js';

const router = Router();

router.use(verifyToken);

// GET - Admin và Kế toán xem được, SV chỉ xem được bản thân
router.get('/', authorize('Admin', 'KeToan'), sinhVienController.getAll);
router.get('/:id', authorize('Admin', 'KeToan', 'SinhVien'), sinhVienController.getById);

// CUD - Chỉ Admin
router.post('/', authorize('Admin'), validate(createSchema), sinhVienController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), sinhVienController.update);
router.patch('/:id/status', authorize('Admin'), validate(updateStatusSchema), sinhVienController.updateStatus);

export default router;
