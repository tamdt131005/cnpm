import dangKyHocService from '../services/dangkyhoc.service.js';

class DangKyHocController {
  // GET /api/v1/dangkyhoc
  async getAll(req, res, next) {
    try {
      const filters = {
        maHocKy: req.query.maHocKy,
        maSV: req.query.maSV
      };
      const data = await dangKyHocService.getAll(filters);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/dangkyhoc/sinhvien/:maSV
  async getBySinhVien(req, res, next) {
    try {
      const data = await dangKyHocService.getBySinhVien(req.params.maSV);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // POST /api/v1/dangkyhoc
  async create(req, res, next) {
    try {
      const data = await dangKyHocService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  // PATCH /api/v1/dangkyhoc/:id/status
  async updateStatus(req, res, next) {
    try {
      const data = await dangKyHocService.updateStatus(req.params.id, req.body.trangThai);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new DangKyHocController();
