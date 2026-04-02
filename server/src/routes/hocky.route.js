import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/error.middleware.js';
import { createSchema, updateSchema } from '../validators/hocky.validator.js';
import hocKyController from '../controllers/hocky.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Admin', 'KeToan'), hocKyController.getAll);
router.get('/:id', authorize('Admin', 'KeToan'), hocKyController.getById);
router.post('/', authorize('Admin'), validate(createSchema), hocKyController.create);
router.put('/:id', authorize('Admin'), validate(updateSchema), hocKyController.update);
router.delete('/:id', authorize('Admin'), hocKyController.delete);

export default router;
