import nguoiDungService from '../services/nguoidung.service.js';

class NguoiDungController {
  // GET /api/v1/nguoidung
  async getAll(req, res, next) {
    try {
      const data = await nguoiDungService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/nguoidung/:id
  async getById(req, res, next) {
    try {
      const data = await nguoiDungService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/nguoidung
  async create(req, res, next) {
    try {
      const data = await nguoiDungService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/nguoidung/:id
  async update(req, res, next) {
    try {
      const data = await nguoiDungService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/nguoidung/:id/status
  async updateStatus(req, res, next) {
    try {
      const data = await nguoiDungService.updateStatus(req.params.id, req.body.trangThai);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new NguoiDungController();
