import monHocService from '../services/monhoc.service.js';

class MonHocController {
  async getAll(req, res, next) {
    try {
      const data = await monHocService.getAll();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const data = await monHocService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const data = await monHocService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const data = await monHocService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const data = await monHocService.delete(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new MonHocController();
