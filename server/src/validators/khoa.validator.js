import Joi from 'joi';

export const createSchema = Joi.object({
  maKhoa: Joi.string().max(50).required().messages({
    'any.required': 'Mã khoa là bắt buộc'
  }),
  tenKhoa: Joi.string().max(100).required().messages({
    'any.required': 'Tên khoa là bắt buộc'
  }),
  truongKhoa: Joi.string().max(100).optional()
});

export const updateSchema = Joi.object({
  tenKhoa: Joi.string().max(100).optional(),
  truongKhoa: Joi.string().max(100).optional()
});
