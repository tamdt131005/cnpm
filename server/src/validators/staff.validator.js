import Joi from 'joi';
import { validateRequest } from '../middleware/validate.middleware.js';

const userQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc',
        'string.empty': 'maNguoiDung không được để trống'
    })
});

const createFeeRateSchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc'
    }),
    maMH: Joi.string().max(50).required().messages({
        'any.required': 'Mã môn học là bắt buộc'
    }),
    maHocKy: Joi.string().max(50).required().messages({
        'any.required': 'Mã học kỳ là bắt buộc'
    }),
    giaPerTinChi: Joi.number().positive().required().messages({
        'any.required': 'Giá tiền mỗi tín chỉ là bắt buộc',
        'number.positive': 'Giá tiền mỗi tín chỉ phải lớn hơn 0'
    }),
    loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').default('ChinhQuy').messages({
        'any.only': 'Loại sinh viên phải là ChinhQuy, LienThong hoặc VanBang2'
    })
});

const generateInvoicesSchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc'
    }),
    maHocKy: Joi.string().max(50).required().messages({
        'any.required': 'Mã học kỳ là bắt buộc'
    }),
    hanThanhToan: Joi.date().iso().required().messages({
        'any.required': 'Hạn thanh toán là bắt buộc',
        'date.format': 'Hạn thanh toán phải theo định dạng ISO date'
    }),
    loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').default('ChinhQuy').messages({
        'any.only': 'Loại sinh viên phải là ChinhQuy, LienThong hoặc VanBang2'
    }),
    soTienMienGiamMacDinh: Joi.number().min(0).default(0).messages({
        'number.min': 'Số tiền miễn giảm mặc định không được âm'
    })
});

const registrationsQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    maHocKy: Joi.string().max(50).optional(),
    loaiSinhVien: Joi.string().valid('ChinhQuy', 'LienThong', 'VanBang2').default('ChinhQuy')
});

const invoicesQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    maHocKy: Joi.string().max(50).optional(),
    maSV: Joi.string().max(50).optional(),
    trangThaiNo: Joi.string().valid('ConNo', 'DaThanhToan').optional()
});

const updateInvoiceDiscountSchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    soTienMienGiam: Joi.number().min(0).required().messages({
        'any.required': 'Số tiền miễn giảm là bắt buộc',
        'number.min': 'Số tiền miễn giảm không được âm'
    })
});

const recordPaymentSchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    maHoaDon: Joi.string().max(50).required(),
    soTienTT: Joi.number().positive().required(),
    phuongThucTT: Joi.string().valid('TienMat', 'ChuyenKhoan', 'The', 'ViDienTu').required(),
    ghiChu: Joi.string().allow('', null).max(500).optional()
});

const paymentHistoryQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    maHocKy: Joi.string().max(50).optional(),
    maSV: Joi.string().max(50).optional()
});

const reportSummaryQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    maNamHoc: Joi.string().max(50).optional()
});

const exportReportQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required(),
    type: Joi.string().valid('summary', 'debts', 'org').default('summary'),
    format: Joi.string().valid('excel', 'pdf').default('excel'),
    maNamHoc: Joi.string().max(50).optional()
});

export const validateStaffUserQuery = validateRequest(userQuerySchema, 'query');
export const validateCreateFeeRate = validateRequest(createFeeRateSchema);
export const validateGenerateInvoices = validateRequest(generateInvoicesSchema);
export const validateRegistrationsQuery = validateRequest(registrationsQuerySchema, 'query');
export const validateInvoicesQuery = validateRequest(invoicesQuerySchema, 'query');
export const validateUpdateInvoiceDiscount = validateRequest(updateInvoiceDiscountSchema);
export const validateRecordPayment = validateRequest(recordPaymentSchema);
export const validatePaymentHistoryQuery = validateRequest(paymentHistoryQuerySchema, 'query');
export const validateReportSummaryQuery = validateRequest(reportSummaryQuerySchema, 'query');
export const validateExportReportQuery = validateRequest(exportReportQuerySchema, 'query');