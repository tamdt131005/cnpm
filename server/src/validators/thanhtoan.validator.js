import Joi from 'joi';

export const createSchema = Joi.object({
  maThanhToan: Joi.string().max(50).required().messages({
    'any.required': 'Mã thanh toán là bắt buộc'
  }),
  maHoaDon: Joi.string().max(50).required().messages({
    'any.required': 'Mã hóa đơn là bắt buộc'
  }),
  soTienTT: Joi.number().precision(2).positive().required().messages({
    'any.required': 'Số tiền thanh toán là bắt buộc',
    'number.positive': 'Số tiền phải lớn hơn 0'
  }),
  phuongThucTT: Joi.string().valid('TienMat', 'ChuyenKhoan', 'The', 'ViDienTu').required().messages({
    'any.required': 'Phương thức thanh toán là bắt buộc',
    'any.only': 'Phương thức phải là TienMat, ChuyenKhoan, The hoặc ViDienTu'
  }),
  ghiChu: Joi.string().optional().allow('')
});
