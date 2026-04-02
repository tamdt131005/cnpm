import sinhVienService from '../services/sinhvien.service.js';

class SinhVienController {
  // GET /api/v1/sinhvien
  async getAll(req, res, next) {
    try {
      const filters = {
        maLop: req.query.maLop,
        maKhoa: req.query.maKhoa,
        trangThai: req.query.trangThai
      };
      const data = await sinhVienService.getAll(filters);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/sinhvien/:id
  async getById(req, res, next) {
    try {
      const data = await sinhVienService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/sinhvien
  async create(req, res, next) {
    try {
      const data = await sinhVienService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/sinhvien/:id
  async update(req, res, next) {
    try {
      const data = await sinhVienService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/sinhvien/:id/status
  async updateStatus(req, res, next) {
    try {
      const data = await sinhVienService.updateStatus(req.params.id, req.body.trangThai);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new SinhVienController();
