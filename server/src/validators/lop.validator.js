import Joi from 'joi';

export const createSchema = Joi.object({
  maLop: Joi.string().max(50).required().messages({
    'any.required': 'Mã lớp là bắt buộc'
  }),
  tenLop: Joi.string().max(100).required().messages({
    'any.required': 'Tên lớp là bắt buộc'
  }),
  nienKhoa: Joi.number().integer().optional(),
  maNganh: Joi.string().max(50).optional()
});

export const updateSchema = Joi.object({
  tenLop: Joi.string().max(100).optional(),
  nienKhoa: Joi.number().integer().optional(),
  maNganh: Joi.string().max(50).optional()
});
