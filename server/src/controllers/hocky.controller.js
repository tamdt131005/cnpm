import hocKyService from '../services/hocky.service.js';

class HocKyController {
  async getAll(req, res, next) {
    try {
      const data = await hocKyService.getAll();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const data = await hocKyService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const data = await hocKyService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const data = await hocKyService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const data = await hocKyService.delete(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new HocKyController();
