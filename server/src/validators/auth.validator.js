import Joi from 'joi';

// Schema đăng nhập
export const loginSchema = Joi.object({
  tenDangNhap: Joi.string().required().messages({
    'any.required': 'Tên đăng nhập là bắt buộc',
    'string.empty': 'Tên đăng nhập không được để trống'
  }),
  matKhau: Joi.string().required().messages({
    'any.required': 'Mật khẩu là bắt buộc',
    'string.empty': 'Mật khẩu không được để trống'
  })
});

// Schema đổi mật khẩu
export const changePasswordSchema = Joi.object({
  matKhauCu: Joi.string().required().messages({
    'any.required': 'Mật khẩu cũ là bắt buộc'
  }),
  matKhauMoi: Joi.string().min(6).required().messages({
    'any.required': 'Mật khẩu mới là bắt buộc',
    'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự'
  }),
  xacNhanMatKhau: Joi.string().valid(Joi.ref('matKhauMoi')).required().messages({
    'any.only': 'Xác nhận mật khẩu không khớp',
    'any.required': 'Xác nhận mật khẩu là bắt buộc'
  })
});
