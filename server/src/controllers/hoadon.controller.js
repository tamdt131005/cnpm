import hoaDonService from '../services/hoadon.service.js';

class HoaDonController {
  // GET /api/v1/hoadon
  async getAll(req, res, next) {
    try {
      const filters = {
        maSV: req.query.maSV,
        maHocKy: req.query.maHocKy,
        trangThai: req.query.trangThai
      };
      const data = await hoaDonService.getAll(filters);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/hoadon/:id
  async getById(req, res, next) {
    try {
      const data = await hoaDonService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // POST /api/v1/hoadon/generate - Tạo hóa đơn tự động
  async generate(req, res, next) {
    try {
      const data = await hoaDonService.generateHoaDon(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  // PATCH /api/v1/hoadon/:id/miengiam - Cập nhật miễn giảm
  async updateMienGiam(req, res, next) {
    try {
      const data = await hoaDonService.updateMienGiam(req.params.id, req.body.soTienMienGiam);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new HoaDonController();
