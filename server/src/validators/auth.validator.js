import Joi from 'joi';
import { validateRequest } from '../middleware/validate.middleware.js';
const loginSchema = Joi.object({
  tenDangNhap: Joi.string().required().messages({
    'any.required': 'Tên đăng nhập là bắt buộc',
    'string.empty': 'Tên đăng nhập không được để trống'
  }),
  matKhau: Joi.string().required().messages({
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống'
  })
});

export const validateLogin = validateRequest(loginSchema);