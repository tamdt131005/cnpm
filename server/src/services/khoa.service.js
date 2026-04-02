import khoaDAO from '../daos/khoa.dao.js';

class KhoaService {
  async getAll() {
    return await khoaDAO.findAll();
  }

  async getById(maKhoa) {
    const khoa = await khoaDAO.findById(maKhoa);
    if (!khoa) {
      const error = new Error('Không tìm thấy khoa');
      error.statusCode = 404;
      throw error;
    }
    return khoa;
  }

  async create(data) {
    await khoaDAO.create(data);
    return await khoaDAO.findById(data.maKhoa);
  }

  async update(maKhoa, data) {
    const existing = await khoaDAO.findById(maKhoa);
    if (!existing) {
      const error = new Error('Không tìm thấy khoa');
      error.statusCode = 404;
      throw error;
    }
    await khoaDAO.update(maKhoa, data);
    return await khoaDAO.findById(maKhoa);
  }

  async delete(maKhoa) {
    const existing = await khoaDAO.findById(maKhoa);
    if (!existing) {
      const error = new Error('Không tìm thấy khoa');
      error.statusCode = 404;
      throw error;
    }
    await khoaDAO.delete(maKhoa);
    return { message: 'Xóa khoa thành công' };
  }
}

export default new KhoaService();
