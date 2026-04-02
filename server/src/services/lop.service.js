import lopDAO from '../daos/lop.dao.js';

class LopService {
  async getAll() {
    return await lopDAO.findAll();
  }

  async getById(maLop) {
    const lop = await lopDAO.findById(maLop);
    if (!lop) {
      const error = new Error('Không tìm thấy lớp');
      error.statusCode = 404;
      throw error;
    }
    return lop;
  }

  async create(data) {
    await lopDAO.create(data);
    return await lopDAO.findById(data.maLop);
  }

  async update(maLop, data) {
    const existing = await lopDAO.findById(maLop);
    if (!existing) {
      const error = new Error('Không tìm thấy lớp');
      error.statusCode = 404;
      throw error;
    }
    await lopDAO.update(maLop, data);
    return await lopDAO.findById(maLop);
  }

  async delete(maLop) {
    const existing = await lopDAO.findById(maLop);
    if (!existing) {
      const error = new Error('Không tìm thấy lớp');
      error.statusCode = 404;
      throw error;
    }
    await lopDAO.delete(maLop);
    return { message: 'Xóa lớp thành công' };
  }
}

export default new LopService();
