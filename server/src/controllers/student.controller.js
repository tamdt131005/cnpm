import studentService from '../services/student.service.js';

class StudentController {
    async getProfile(req, res, next) {
        try {
            const data = await studentService.getProfile(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getInvoices(req, res, next) {
        try {
            const data = await studentService.getInvoices(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getTransactions(req, res, next) {
        try {
            const data = await studentService.getTransactions(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getRegistrations(req, res, next) {
        try {
            const data = await studentService.getRegistrations(
                req.query.maNguoiDung,
                req.query.maHocKy,
                req.query.loaiSinhVien
            );
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async pay(req, res, next) {
        try {
            const data = await studentService.payInvoice(req.body);
            res.json({ success: true, data, message: 'Tạo thanh toán MoMo thành công' });
        } catch (error) {
            next(error);
        }
    }

    async momoIpn(req, res) {
        try {
            const data = await studentService.handleMomoIpn(req.body || {});
            res.json({
                resultCode: 0,
                message: data.message || 'IPN processed',
                success: true
            });
        } catch (error) {
            res.json({
                resultCode: 1,
                message: error.message || 'IPN processing failed',
                success: false
            });
        }
    }
}

export default new StudentController();