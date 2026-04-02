import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/muchocphi.validator.js';
import mucHocPhiController from '../controllers/muchocphi.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), mucHocPhiController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), mucHocPhiController.getById);
router.post('/', authorize('Admin'), validate(createSchema), mucHocPhiController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), mucHocPhiController.update);
router.delete('/:id', authorize('Admin'), mucHocPhiController.delete);

export default router;
