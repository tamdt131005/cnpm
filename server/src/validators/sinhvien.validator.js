import Joi from 'joi';

export const createSchema = Joi.object({
  maSV: Joi.string().max(50).required().messages({
    'any.required': 'Mã sinh viên là bắt buộc'
  }),
  hoTen: Joi.string().max(100).required().messages({
    'any.required': 'Họ tên là bắt buộc'
  }),
  ngaySinh: Joi.date().optional(),
  gioiTinh: Joi.boolean().optional(),
  diaChi: Joi.string().optional(),
  email: Joi.string().email().max(100).optional().messages({
    'string.email': 'Email không đúng định dạng'
  }),
  soDienThoai: Joi.string().max(20).optional(),
  maLop: Joi.string().max(50).optional()
});

export const updateSchema = Joi.object({
  hoTen: Joi.string().max(100).optional(),
  ngaySinh: Joi.date().optional(),
  gioiTinh: Joi.boolean().optional(),
  diaChi: Joi.string().optional(),
  email: Joi.string().email().max(100).optional(),
  soDienThoai: Joi.string().max(20).optional(),
  maLop: Joi.string().max(50).optional()
});

export const updateStatusSchema = Joi.object({
  trangThai: Joi.string().valid('DangHoc', 'BaoLuu', 'DaTotNghiep', 'ThoiHoc').required().messages({
    'any.only': 'Trạng thái phải là DangHoc, BaoLuu, DaTotNghiep hoặc ThoiHoc'
  })
});
