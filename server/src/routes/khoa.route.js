import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/khoa.validator.js';
import khoaController from '../controllers/khoa.controller.js';

const router = Router();

router.use(verifyToken);

// GET - Admin, Kế toán
router.get('/', authorize('Admin', 'KeToan'), khoaController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), khoaController.getById);

// CUD - Chỉ Admin
router.post('/', authorize('Admin'), validate(createSchema), khoaController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), khoaController.update);
router.delete('/:id', authorize('Admin'), khoaController.delete);

export default router;
