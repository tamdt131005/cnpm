import nganhDAO from '../daos/nganh.dao.js';

class NganhService {
  async getAll() {
    return await nganhDAO.findAll();
  }

  async getById(maNganh) {
    const nganh = await nganhDAO.findById(maNganh);
    if (!nganh) {
      const error = new Error('Không tìm thấy ngành');
      error.statusCode = 404;
      throw error;
    }
    return nganh;
  }

  async create(data) {
    await nganhDAO.create(data);
    return await nganhDAO.findById(data.maNganh);
  }

  async update(maNganh, data) {
    const existing = await nganhDAO.findById(maNganh);
    if (!existing) {
      const error = new Error('Không tìm thấy ngành');
      error.statusCode = 404;
      throw error;
    }
    await nganhDAO.update(maNganh, data);
    return await nganhDAO.findById(maNganh);
  }

  async delete(maNganh) {
    const existing = await nganhDAO.findById(maNganh);
    if (!existing) {
      const error = new Error('Không tìm thấy ngành');
      error.statusCode = 404;
      throw error;
    }
    await nganhDAO.delete(maNganh);
    return { message: 'Xóa ngành thành công' };
  }
}

export default new NganhService();
