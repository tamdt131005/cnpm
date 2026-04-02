import namHocDAO from '../daos/namhoc.dao.js';

class NamHocService {
  async getAll() {
    return await namHocDAO.findAll();
  }

  async getById(maNamHoc) {
    const nh = await namHocDAO.findById(maNamHoc);
    if (!nh) {
      const error = new Error('Không tìm thấy năm học');
      error.statusCode = 404;
      throw error;
    }
    return nh;
  }

  async create(data) {
    await namHocDAO.create(data);
    return await namHocDAO.findById(data.maNamHoc);
  }

  async update(maNamHoc, data) {
    const existing = await namHocDAO.findById(maNamHoc);
    if (!existing) {
      const error = new Error('Không tìm thấy năm học');
      error.statusCode = 404;
      throw error;
    }
    await namHocDAO.update(maNamHoc, data);
    return await namHocDAO.findById(maNamHoc);
  }

  async delete(maNamHoc) {
    const existing = await namHocDAO.findById(maNamHoc);
    if (!existing) {
      const error = new Error('Không tìm thấy năm học');
      error.statusCode = 404;
      throw error;
    }
    await namHocDAO.delete(maNamHoc);
    return { message: 'Xóa năm học thành công' };
  }
}

export default new NamHocService();
