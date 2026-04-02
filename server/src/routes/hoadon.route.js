import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { generateSchema, updateMienGiamSchema } from '../validators/hoadon.validator.js';
import hoaDonController from '../controllers/hoadon.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), hoaDonController.getAll);
router.get('/:id', authorize('Admin', 'KeToan', 'SinhVien'), hoaDonController.getById);
router.post('/generate', authorize('KeToan'), validate(generateSchema), hoaDonController.generate);
router.patch('/:id/miengiam', authorize('KeToan'), validate(updateMienGiamSchema), hoaDonController.updateMienGiam);

export default router;
