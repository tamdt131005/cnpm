import mucHocPhiDAO from '../daos/muchocphi.dao.js';

class MucHocPhiService {
  async getAll() {
    return await mucHocPhiDAO.findAll();
  }

  async getById(maMucHP) {
    const mhp = await mucHocPhiDAO.findById(maMucHP);
    if (!mhp) {
      const error = new Error('Không tìm thấy mức học phí');
      error.statusCode = 404;
      throw error;
    }
    return mhp;
  }

  async create(data) {
    const result = await mucHocPhiDAO.create(data);
    return await mucHocPhiDAO.findById(result.insertId);
  }

  async update(maMucHP, data) {
    const existing = await mucHocPhiDAO.findById(maMucHP);
    if (!existing) {
      const error = new Error('Không tìm thấy mức học phí');
      error.statusCode = 404;
      throw error;
    }
    await mucHocPhiDAO.update(maMucHP, data);
    return await mucHocPhiDAO.findById(maMucHP);
  }

  async delete(maMucHP) {
    const existing = await mucHocPhiDAO.findById(maMucHP);
    if (!existing) {
      const error = new Error('Không tìm thấy mức học phí');
      error.statusCode = 404;
      throw error;
    }
    await mucHocPhiDAO.delete(maMucHP);
    return { message: 'Xóa mức học phí thành công' };
  }
}

export default new MucHocPhiService();
