import dotenv from 'dotenv';
import nguoiDungDAO from '../daos/nguoidung.dao.js';

dotenv.config();

class AuthService {
  async login(tenDangNhap, matKhau) {
    const user = await nguoiDungDAO.findByUsername(tenDangNhap);
    if (!user) {
      const error = new Error('Tên đăng nhập không tồn tại');
      error.statusCode = 401;
      throw error;
    }
    const loginUser = await nguoiDungDAO.loginUser(tenDangNhap, matKhau);
    if (!loginUser) {
      const error = new Error('Mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }
    return loginUser;
  }
  
  async getMe(maNguoiDung) {
    const user = await nguoiDungDAO.findById(maNguoiDung);
    if (!user) {
      const error = new Error('Người dùng không tồn tại');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

export default new AuthService();
