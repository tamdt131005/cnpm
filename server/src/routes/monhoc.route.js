import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/monhoc.validator.js';
import monHocController from '../controllers/monhoc.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), monHocController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), monHocController.getById);
router.post('/', authorize('Admin'), validate(createSchema), monHocController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), monHocController.update);
router.delete('/:id', authorize('Admin'), monHocController.delete);

export default router;
