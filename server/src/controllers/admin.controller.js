import adminService from '../services/admin.service.js';

class AdminController {
    async getOverview(req, res, next) {
        try {
            const data = await adminService.getOverview(req.query.maNguoiDung);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async listCatalog(req, res, next) {
        try {
            const data = await adminService.listCatalog(req.query.maNguoiDung, req.params.resource);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async createCatalog(req, res, next) {
        try {
            const data = await adminService.createCatalog(req.body.maNguoiDung, req.params.resource, req.body);
            res.status(201).json({ success: true, message: 'Tạo dữ liệu thành công', data });
        } catch (error) {
            next(error);
        }
    }

    async updateCatalog(req, res, next) {
        try {
            const data = await adminService.updateCatalog(
                req.body.maNguoiDung,
                req.params.resource,
                req.params.id,
                req.body
            );
            res.json({ success: true, message: 'Cập nhật dữ liệu thành công', data });
        } catch (error) {
            next(error);
        }
    }

    async deleteCatalog(req, res, next) {
        try {
            const data = await adminService.deleteCatalog(req.query.maNguoiDung, req.params.resource, req.params.id);
            res.json({ success: true, message: 'Xóa dữ liệu thành công', data });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
