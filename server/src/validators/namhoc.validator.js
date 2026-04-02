import Joi from 'joi';

export const createSchema = Joi.object({
  maNamHoc: Joi.string().max(50).required().messages({
    'any.required': 'Mã năm học là bắt buộc'
  }),
  tenNamHoc: Joi.string().max(50).required().messages({
    'any.required': 'Tên năm học là bắt buộc'
  }),
  namBatDau: Joi.number().integer().required().messages({
    'any.required': 'Năm bắt đầu là bắt buộc'
  }),
  namKetThuc: Joi.number().integer().required().messages({
    'any.required': 'Năm kết thúc là bắt buộc'
  })
});

export const updateSchema = Joi.object({
  tenNamHoc: Joi.string().max(50).optional(),
  namBatDau: Joi.number().integer().optional(),
  namKetThuc: Joi.number().integer().optional()
});
