import lopService from '../services/lop.service.js';

class LopController {
  async getAll(req, res, next) {
    try {
      const data = await lopService.getAll();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const data = await lopService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const data = await lopService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const data = await lopService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const data = await lopService.delete(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new LopController();
