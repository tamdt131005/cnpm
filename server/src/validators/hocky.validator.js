import Joi from 'joi';

export const createSchema = Joi.object({
  maHocKy: Joi.string().max(50).required().messages({
    'any.required': 'Mã học kỳ là bắt buộc'
  }),
  tenHocKy: Joi.string().max(50).required().messages({
    'any.required': 'Tên học kỳ là bắt buộc'
  }),
  hocKySo: Joi.number().integer().min(1).max(3).required().messages({
    'any.required': 'Số học kỳ là bắt buộc'
  }),
  ngayBatDau: Joi.date().required().messages({
    'any.required': 'Ngày bắt đầu là bắt buộc'
  }),
  ngayKetThuc: Joi.date().required().messages({
    'any.required': 'Ngày kết thúc là bắt buộc'
  }),
  maNamHoc: Joi.string().max(50).required().messages({
    'any.required': 'Mã năm học là bắt buộc'
  })
});

export const updateSchema = Joi.object({
  tenHocKy: Joi.string().max(50).optional(),
  hocKySo: Joi.number().integer().min(1).max(3).optional(),
  ngayBatDau: Joi.date().optional(),
  ngayKetThuc: Joi.date().optional(),
  maNamHoc: Joi.string().max(50).optional()
});
