import thanhToanService from '../services/thanhtoan.service.js';

class ThanhToanController {
  // GET /api/v1/thanhtoan
  async getAll(req, res, next) {
    try {
      const filters = {
        maHoaDon: req.query.maHoaDon,
        maSV: req.query.maSV
      };
      const data = await thanhToanService.getAll(filters);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/thanhtoan/hoadon/:maHD
  async getByHoaDon(req, res, next) {
    try {
      const data = await thanhToanService.getByHoaDon(req.params.maHD);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // POST /api/v1/thanhtoan
  async create(req, res, next) {
    try {
      // maNguoiDung lấy từ token (kế toán đang đăng nhập)
      const data = await thanhToanService.create(req.body, req.user.maNguoiDung);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new ThanhToanController();
