import Joi from 'joi';

// Schema tạo hóa đơn tự động
export const generateSchema = Joi.object({
  maSV: Joi.string().max(50).required().messages({
    'any.required': 'Mã sinh viên là bắt buộc'
  }),
  maHocKy: Joi.string().max(50).required().messages({
    'any.required': 'Mã học kỳ là bắt buộc'
  }),
  maHoaDon: Joi.string().max(50).required().messages({
    'any.required': 'Mã hóa đơn là bắt buộc'
  }),
  hanThanhToan: Joi.date().optional()
});

// Schema cập nhật miễn giảm
export const updateMienGiamSchema = Joi.object({
  soTienMienGiam: Joi.number().precision(2).min(0).required().messages({
    'any.required': 'Số tiền miễn giảm là bắt buộc',
    'number.min': 'Số tiền miễn giảm không được âm'
  })
});
