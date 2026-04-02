import Joi from 'joi';

export const createSchema = Joi.object({
  maMH: Joi.string().max(50).required().messages({
    'any.required': 'Mã môn học là bắt buộc'
  }),
  maHocKy: Joi.string().max(50).required().messages({
    'any.required': 'Mã học kỳ là bắt buộc'
  }),
  giaPerTinChi: Joi.number().precision(2).positive().required().messages({
    'any.required': 'Giá mỗi tín chỉ là bắt buộc',
    'number.positive': 'Giá phải là số dương'
  }),
  loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').default('ChinhQuy').messages({
    'any.only': 'Loại sinh viên phải là ChinhQuy, LienThong hoặc VanBang2'
  })
});

export const updateSchema = Joi.object({
  giaPerTinChi: Joi.number().precision(2).positive().optional(),
  loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').optional()
});
