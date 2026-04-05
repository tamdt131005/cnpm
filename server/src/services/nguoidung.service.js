import bcrypt from 'bcryptjs';
import nguoiDungDAO from '../daos/nguoidung.dao.js';

class NguoiDungService {
  async getAll(vaiTro) {
    if(vaiTro == "Admin"){
      return await nguoiDungDAO.findAll();
    }
    throw error;
  }

  async getById(maNguoiDung) {
    const user = await nguoiDungDAO.findById(maNguoiDung);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async create(data) {
    // Hash mật khẩu trước khi lưu
    data.matKhau = await bcrypt.hash(data.matKhau, 10);
    await nguoiDungDAO.create(data);
    return await nguoiDungDAO.findById(data.maNguoiDung);
  }

  async update(maNguoiDung, data) {
    const existing = await nguoiDungDAO.findById(maNguoiDung);
    if (!existing) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }
    await nguoiDungDAO.update(maNguoiDung, data);
    return await nguoiDungDAO.findById(maNguoiDung);
  }

  async updateStatus(maNguoiDung, trangThai) {
    const existing = await nguoiDungDAO.findById(maNguoiDung);
    if (!existing) {
      const error = new Error('Không tìm thấy người dùng');
      error.statusCode = 404;
      throw error;
    }
    await nguoiDungDAO.updateStatus(maNguoiDung, trangThai);
    return await nguoiDungDAO.findById(maNguoiDung);
  }
}

export default new NguoiDungService();
