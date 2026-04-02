import dangKyHocDAO from '../daos/dangkyhoc.dao.js';

class DangKyHocService {
  async getAll(filters) {
    return await dangKyHocDAO.findAll(filters);
  }

  async getById(maDangKy) {
    const dkh = await dangKyHocDAO.findById(maDangKy);
    if (!dkh) {
      const error = new Error('Không tìm thấy đăng ký học');
      error.statusCode = 404;
      throw error;
    }
    return dkh;
  }

  async getBySinhVien(maSV) {
    return await dangKyHocDAO.findAll({ maSV });
  }

  async create(data) {
    const result = await dangKyHocDAO.create(data);
    return await dangKyHocDAO.findById(result.insertId);
  }

  async updateStatus(maDangKy, trangThai) {
    const existing = await dangKyHocDAO.findById(maDangKy);
    if (!existing) {
      const error = new Error('Không tìm thấy đăng ký học');
      error.statusCode = 404;
      throw error;
    }
    await dangKyHocDAO.updateStatus(maDangKy, trangThai);
    return await dangKyHocDAO.findById(maDangKy);
  }
}

export default new DangKyHocService();
