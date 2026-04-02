import Joi from 'joi';

export const createSchema = Joi.object({
  maSV: Joi.string().max(50).required().messages({
    'any.required': 'Mã sinh viên là bắt buộc'
  }),
  maMH: Joi.string().max(50).required().messages({
    'any.required': 'Mã môn học là bắt buộc'
  }),
  maHocKy: Joi.string().max(50).required().messages({
    'any.required': 'Mã học kỳ là bắt buộc'
  }),
  ngayDangKy: Joi.date().optional(),
  trangThai: Joi.string().valid('ThanhCong', 'Huy', 'ChoXacNhan').default('ThanhCong')
});

export const updateStatusSchema = Joi.object({
  trangThai: Joi.string().valid('ThanhCong', 'Huy', 'ChoXacNhan').required().messages({
    'any.only': 'Trạng thái phải là ThanhCong, Huy hoặc ChoXacNhan'
  })
});
