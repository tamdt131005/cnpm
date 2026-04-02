import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/nganh.validator.js';
import nganhController from '../controllers/nganh.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), nganhController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), nganhController.getById);
router.post('/', authorize('Admin'), validate(createSchema), nganhController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), nganhController.update);
router.delete('/:id', authorize('Admin'), nganhController.delete);

export default router;
