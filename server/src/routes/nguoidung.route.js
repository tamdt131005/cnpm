import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema, updateStatusSchema } from '../validators/nguoidung.validator.js';
import nguoiDungController from '../controllers/nguoidung.controller.js';

const router = Router();

// Tất cả routes đều cần đăng nhập + quyền Admin
router.use(verifyToken, authorize('Admin'));

router.get('/', nguoiDungController.getAll);
router.get('/:id', nguoiDungController.getById);
router.post('/', validate(createSchema), nguoiDungController.create);
router.put('/:id', validate(updateSchema), nguoiDungController.update);
router.patch('/:id/status', validate(updateStatusSchema), nguoiDungController.updateStatus);

export default router;
