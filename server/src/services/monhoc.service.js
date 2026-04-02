import monHocDAO from '../daos/monhoc.dao.js';

class MonHocService {
  async getAll() {
    return await monHocDAO.findAll();
  }

  async getById(maMH) {
    const mh = await monHocDAO.findById(maMH);
    if (!mh) {
      const error = new Error('Không tìm thấy môn học');
      error.statusCode = 404;
      throw error;
    }
    return mh;
  }

  async create(data) {
    await monHocDAO.create(data);
    return await monHocDAO.findById(data.maMH);
  }

  async update(maMH, data) {
    const existing = await monHocDAO.findById(maMH);
    if (!existing) {
      const error = new Error('Không tìm thấy môn học');
      error.statusCode = 404;
      throw error;
    }
    await monHocDAO.update(maMH, data);
    return await monHocDAO.findById(maMH);
  }

  async delete(maMH) {
    const existing = await monHocDAO.findById(maMH);
    if (!existing) {
      const error = new Error('Không tìm thấy môn học');
      error.statusCode = 404;
      throw error;
    }
    await monHocDAO.delete(maMH);
    return { message: 'Xóa môn học thành công' };
  }
}

export default new MonHocService();
