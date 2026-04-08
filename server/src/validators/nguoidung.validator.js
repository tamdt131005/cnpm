import Joi from 'joi';
import { validateRequest } from '../middleware/validate.middleware.js';

const createSchema = Joi.object({
  maNguoiDungThucHien: Joi.string().max(50).optional(),
  maNguoiDung: Joi.string().max(50).required().messages({
    'any.required': 'Mã người dùng là bắt buộc',
    'string.max': 'Mã người dùng tối đa 50 ký tự'
  }),
  tenDangNhap: Joi.string().max(50).required().messages({
    'any.required': 'Tên đăng nhập là bắt buộc'
  }),
  matKhau: Joi.string().min(6).required().messages({
    'any.required': 'Mật khẩu là bắt buộc',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
  }),
  hoTen: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional().messages({
    'string.email': 'Email không đúng định dạng'
  }),
  soDienThoai: Joi.string().max(20).optional(),
  vaiTro: Joi.string().valid('Admin', 'KeToan', 'SinhVien').default('SinhVien').messages({
    'any.only': 'Vai trò phải là Admin, KeToan hoặc SinhVien'
  })
});

const updateSchema = Joi.object({
  maNguoiDungThucHien: Joi.string().max(50).optional(),
  tenDangNhap: Joi.string().max(50).optional(),
  hoTen: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  soDienThoai: Joi.string().max(20).optional(),
  vaiTro: Joi.string().valid('Admin', 'KeToan', 'SinhVien').optional()
});

const changePasswordSchema = Joi.object({
  maNguoiDungThucHien: Joi.string().max(50).optional(),
  matKhauMoi: Joi.string().min(6).required().messages({
    'any.required': 'Mật khẩu mới là bắt buộc',
    'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự'
  })
});

const lockSchema = Joi.object({
  maNguoiDungThucHien: Joi.string().max(50).required().messages({
    'any.required': 'maNguoiDungThucHien là bắt buộc'
  }),
  biKhoa: Joi.alternatives().try(
    Joi.boolean(),
    Joi.number().valid(0, 1)
  ).required().messages({
    'any.required': 'Trạng thái khóa là bắt buộc'
  }),
  lyDo: Joi.string().allow('', null).max(255).optional()
});

export const taoNguoiDung = validateRequest(createSchema);
export const capNhatNguoiDung = validateRequest(updateSchema);
export const doiMatKhauNguoiDung = validateRequest(changePasswordSchema);
export const khoaNguoiDung = validateRequest(lockSchema);