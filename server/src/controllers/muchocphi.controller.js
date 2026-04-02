import mucHocPhiService from '../services/muchocphi.service.js';

class MucHocPhiController {
  async getAll(req, res, next) {
    try {
      const data = await mucHocPhiService.getAll();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const data = await mucHocPhiService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const data = await mucHocPhiService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const data = await mucHocPhiService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const data = await mucHocPhiService.delete(req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export default new MucHocPhiController();
