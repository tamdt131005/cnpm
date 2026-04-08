import nguoiDungService from '../services/nguoidung.service.js';

class NguoiDungController {
    async getAll(req, res, next) {
        try {
            const data = await nguoiDungService.getAll(
                req.query.vaiTro,
                req.query.maNguoiDung,
                req.query.locVaiTro
            );
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const data = await nguoiDungService.getById(
                req.params.id,
                req.query.maNguoiDung,
                req.query.vaiTro
            );
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const data = await nguoiDungService.create(req.body);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const data = await nguoiDungService.update(req.params.id, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const data = await nguoiDungService.changePassword(req.params.id, req.body);
            res.json({ success: true, message: 'Đổi mật khẩu thành công', data });
        } catch (error) {
            next(error);
        }
    }

    async lockAccount(req, res, next) {
        try {
            const data = await nguoiDungService.setLockStatus(req.params.id, req.body);
            res.json({ success: true, message: 'Cập nhật trạng thái khóa tài khoản thành công', data });
        } catch (error) {
            next(error);
        }
    }
}

export default new NguoiDungController();