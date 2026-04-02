import Joi from 'joi';

export const createSchema = Joi.object({
  maNganh: Joi.string().max(50).required().messages({
    'any.required': 'Mã ngành là bắt buộc'
  }),
  tenNganh: Joi.string().max(100).required().messages({
    'any.required': 'Tên ngành là bắt buộc'
  }),
  maKhoa: Joi.string().max(50).required().messages({
    'any.required': 'Mã khoa là bắt buộc'
  })
});

export const updateSchema = Joi.object({
  tenNganh: Joi.string().max(100).optional(),
  maKhoa: Joi.string().max(50).optional()
});
