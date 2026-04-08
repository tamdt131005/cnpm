import Joi from 'joi';
import { validateRequest } from '../middleware/validate.middleware.js';

const resourceValues = ['khoa', 'nganh', 'lop', 'monhoc', 'sinhvien', 'namhoc', 'hocky'];

const adminQuerySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc',
        'string.empty': 'maNguoiDung không được để trống'
    })
});

const catalogResourceSchema = Joi.object({
    resource: Joi.string().valid(...resourceValues).required().messages({
        'any.required': 'resource là bắt buộc',
        'any.only': 'resource không hợp lệ'
    })
});

const catalogResourceWithIdSchema = Joi.object({
    resource: Joi.string().valid(...resourceValues).required(),
    id: Joi.string().max(80).required().messages({
        'any.required': 'id là bắt buộc'
    })
});

const catalogBodySchema = Joi.object({
    maNguoiDung: Joi.string().max(50).required().messages({
        'any.required': 'maNguoiDung là bắt buộc'
    })
}).unknown(true);

export const validateAdminQuery = validateRequest(adminQuerySchema, 'query');
export const validateCatalogResource = validateRequest(catalogResourceSchema, 'params');
export const validateCatalogResourceWithId = validateRequest(catalogResourceWithIdSchema, 'params');
export const validateCatalogBody = validateRequest(catalogBodySchema);
