import Joi from 'joi';
import { validateRequest } from '../middleware/validate.middleware.js';

const userQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc',
        'string.empty': 'maNguoiDung không được để trống'
    })
});

const paySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc'
    }),
    maHoaDon: Joi.string().max(50).required().messages({
        'any.required': 'maHoaDon là bắt buộc'
    }),
    soTienNop: Joi.number().positive().required().messages({
        'any.required': 'Số tiền nộp là bắt buộc',
        'number.base': 'Số tiền nộp phải là số',
        'number.positive': 'Số tiền nộp phải lớn hơn 0'
    }),
    ghiChu: Joi.string().allow('', null).max(500).optional()
});

const registrationQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc'
    }),
    maHocKy: Joi.string().max(50).optional(),
    loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').default('ChinhQuy')
});

export const validateStudentUserQuery = validateRequest(userQuerySchema, 'query');
export const validateStudentPay = validateRequest(paySchema);
export const validateStudentRegistrationQuery = validateRequest(registrationQuerySchema, 'query');