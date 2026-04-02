import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/namhoc.validator.js';
import namHocController from '../controllers/namhoc.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), namHocController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), namHocController.getById);
router.post('/', authorize('Admin'), validate(createSchema), namHocController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), namHocController.update);
router.delete('/:id', authorize('Admin'), namHocController.delete);

export default router;
