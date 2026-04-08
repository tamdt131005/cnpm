import { Router } from 'express';
import { validateLogin } from '../validators/auth.validator.js';
import authController from '../controllers/auth.controller.js';

const router = Router();
router.post('/login', validateLogin, authController.login);
export default router;