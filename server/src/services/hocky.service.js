import hocKyDAO from '../daos/hocky.dao.js';

class HocKyService {
  async getAll() {
    return await hocKyDAO.findAll();
  }

  async getById(maHocKy) {
    const hk = await hocKyDAO.findById(maHocKy);
    if (!hk) {
      const error = new Error('Không tìm thấy học kỳ');
      error.statusCode = 404;
      throw error;
    }
    return hk;
  }

  async create(data) {
    await hocKyDAO.create(data);
    return await hocKyDAO.findById(data.maHocKy);
  }

  async update(maHocKy, data) {
    const existing = await hocKyDAO.findById(maHocKy);
    if (!existing) {
      const error = new Error('Không tìm thấy học kỳ');
      error.statusCode = 404;
      throw error;
    }
    await hocKyDAO.update(maHocKy, data);
    return await hocKyDAO.findById(maHocKy);
  }

  async delete(maHocKy) {
    const existing = await hocKyDAO.findById(maHocKy);
    if (!existing) {
      const error = new Error('Không tìm thấy học kỳ');
      error.statusCode = 404;
      throw error;
    }
    await hocKyDAO.delete(maHocKy);
    return { message: 'Xóa học kỳ thành công' };
  }
}

export default new HocKyService();
