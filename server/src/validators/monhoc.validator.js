import Joi from 'joi';

export const createSchema = Joi.object({
  maMH: Joi.string().max(50).required().messages({
    'any.required': 'Mã môn học là bắt buộc'
  }),
  tenMH: Joi.string().max(100).required().messages({
    'any.required': 'Tên môn học là bắt buộc'
  }),
  soTinChi: Joi.number().integer().min(1).max(10).required().messages({
    'any.required': 'Số tín chỉ là bắt buộc',
    'number.min': 'Số tín chỉ tối thiểu là 1',
    'number.max': 'Số tín chỉ tối đa là 10'
  }),
  maKhoa: Joi.string().max(50).optional()
});

export const updateSchema = Joi.object({
  tenMH: Joi.string().max(100).optional(),
  soTinChi: Joi.number().integer().min(1).max(10).optional(),
  maKhoa: Joi.string().max(50).optional()
});
