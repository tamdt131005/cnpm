import baoCaoService from '../services/baocao.service.js';

class BaoCaoController {
  // GET /api/v1/baocao/tong-thu?maHocKy=...&maNamHoc=...
  async tongThu(req, res, next) {
    try {
      const data = await baoCaoService.tongThu(req.query);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/baocao/chua-dong?maHocKy=...
  async dsSVChuaDong(req, res, next) {
    try {
      const data = await baoCaoService.dsSVChuaDong(req.query);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/baocao/thong-ke-khoa?maHocKy=...
  async thongKeTheoKhoa(req, res, next) {
    try {
      const data = await baoCaoService.thongKeTheoKhoa(req.query);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // GET /api/v1/baocao/tra-cuu
  async traCuuCaNhan(req, res, next) {
    try {
      // Sinh viên chỉ tra cứu được thông tin của mình
      // Lấy maSV từ tenDangNhap (trùng maSV trong dữ liệu mẫu)
      const maSV = req.query.maSV || req.user.tenDangNhap;
      const data = await baoCaoService.traCuuCaNhan(maSV);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new BaoCaoController();
