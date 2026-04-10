import staffService from '../services/staff.service.js';

class StaffController {
    async createFeeRate(req, res, next) {
        try {
            const data = await staffService.createFeeRate(req.body);
            res.status(201).json({ success: true, data, message: 'Tạo định mức học phí thành công' });
        } catch (error) {
            next(error);
        }
    }

    async getFeeRates(req, res, next) {
        try {
            const data = await staffService.getFeeRates(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getFeeRateOptions(req, res, next) {
        try {
            const data = await staffService.getFeeRateOptions(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getDebts(req, res, next) {
        try {
            const data = await staffService.getDebts(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getRegistrations(req, res, next) {
        try {
            const data = await staffService.getRegistrations(
                req.query.maNguoiDung,
                req.query.maHocKy,
                req.query.loaiSinhVien
            );
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getInvoices(req, res, next) {
        try {
            const data = await staffService.getInvoices(req.query.maNguoiDung, {
                maHocKy: req.query.maHocKy,
                maSV: req.query.maSV,
                trangThaiNo: req.query.trangThaiNo
            });
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateInvoiceDiscount(req, res, next) {
        try {
            const data = await staffService.updateInvoiceDiscount({
                maNguoiDung: req.body.maNguoiDung,
                maHoaDon: req.params.maHoaDon,
                soTienMienGiam: req.body.soTienMienGiam
            });
            res.json({ success: true, message: 'Cập nhật miễn giảm thành công', data });
        } catch (error) {
            next(error);
        }
    }

    async recordPayment(req, res, next) {
        try {
            const data = await staffService.recordPayment(req.body);
            res.status(201).json({ success: true, message: 'Ghi nhận thanh toán thành công', data });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentHistory(req, res, next) {
        try {
            const data = await staffService.getPaymentHistory(req.query.maNguoiDung, {
                maHocKy: req.query.maHocKy,
                maSV: req.query.maSV
            });
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getReportSummary(req, res, next) {
        try {
            const data = await staffService.getReportSummary(req.query.maNguoiDung, req.query.maNamHoc);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getDebtByOrganization(req, res, next) {
        try {
            const data = await staffService.getDebtByOrganization(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async exportReport(req, res, next) {
        try {
            const data = await staffService.exportReport({
                maNguoiDung: req.query.maNguoiDung,
                type: req.query.type,
                format: req.query.format,
                maNamHoc: req.query.maNamHoc
            });

            res.setHeader('Content-Type', data.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${data.fileName}"`);
            res.send(data.content);
        } catch (error) {
            next(error);
        }
    }

    async generateInvoices(req, res, next) {
        try {
            const data = await staffService.generateInvoices(req.body);
            res.json({ success: true, data, message: 'Tạo hóa đơn học phí thành công' });
        } catch (error) {
            next(error);
        }
    }
}

export default new StaffController();