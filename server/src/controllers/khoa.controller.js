import khoaService from '../services/khoa.service.js';

class KhoaController {
  async getAll(req, res, next) {
    try {
      const data = await khoaService.getAll();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const data = await khoaService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const data = await khoaService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const data = await khoaService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const data = await khoaService.delete(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new KhoaController();
