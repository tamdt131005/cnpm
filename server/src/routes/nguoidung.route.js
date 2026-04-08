import { Router } from 'express';
import {
	taoNguoiDung,
	capNhatNguoiDung,
	doiMatKhauNguoiDung,
	khoaNguoiDung
} from '../validators/nguoidung.validator.js';
import nguoiDungController from '../controllers/nguoidung.controller.js';

const router = Router();

// Tất cả routes đều cần đăng nhập + quyền Admin
router.get('/', nguoiDungController.getAll);
router.get('/:id', nguoiDungController.getById);
router.post('/', taoNguoiDung, nguoiDungController.create);
router.put('/:id', capNhatNguoiDung, nguoiDungController.update);
router.patch('/:id/password', doiMatKhauNguoiDung, nguoiDungController.changePassword);
router.patch('/:id/lock', khoaNguoiDung, nguoiDungController.lockAccount);

export default router;