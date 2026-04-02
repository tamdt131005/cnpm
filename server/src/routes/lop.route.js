import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/lop.validator.js';
import lopController from '../controllers/lop.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), lopController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), lopController.getById);
router.post('/', authorize('Admin'), validate(createSchema), lopController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), lopController.update);
router.delete('/:id', authorize('Admin'), lopController.delete);

export default router;
