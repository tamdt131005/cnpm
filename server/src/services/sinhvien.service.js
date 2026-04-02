import sinhVienDAO from '../daos/sinhvien.dao.js';

class SinhVienService {
  async getAll(filters) {
    return await sinhVienDAO.findAll(filters);
  }

  async getById(maSV) {
    const sv = await sinhVienDAO.findById(maSV);
    if (!sv) {
      const error = new Error('Không tìm thấy sinh viên');
      error.statusCode = 404;
      throw error;
    }
    return sv;
  }

  async create(data) {
    await sinhVienDAO.create(data);
    return await sinhVienDAO.findById(data.maSV);
  }

  async update(maSV, data) {
    const existing = await sinhVienDAO.findById(maSV);
    if (!existing) {
      const error = new Error('Không tìm thấy sinh viên');
      error.statusCode = 404;
      throw error;
    }
    await sinhVienDAO.update(maSV, data);
    return await sinhVienDAO.findById(maSV);
  }

  async updateStatus(maSV, trangThai) {
    const existing = await sinhVienDAO.findById(maSV);
    if (!existing) {
      const error = new Error('Không tìm thấy sinh viên');
      error.statusCode = 404;
      throw error;
    }
    await sinhVienDAO.updateStatus(maSV, trangThai);
    return await sinhVienDAO.findById(maSV);
  }
}

export default new SinhVienService();
