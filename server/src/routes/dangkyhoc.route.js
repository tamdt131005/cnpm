import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateStatusSchema } from '../validators/dangkyhoc.validator.js';
import dangKyHocController from '../controllers/dangkyhoc.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), dangKyHocController.getAll);
router.get('/sinhvien/:maSV', authorize('Admin', 'KeToan', 'SinhVien'), dangKyHocController.getBySinhVien);
router.post('/', authorize('Admin'), validate(createSchema), dangKyHocController.create);
router.patch('/:id/status', authorize('Admin'), validate(updateStatusSchema), dangKyHocController.updateStatus);

export default router;
