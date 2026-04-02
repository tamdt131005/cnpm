import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nguoiDungDAO from '../daos/nguoidung.dao.js';

dotenv.config();

class AuthService {
  /**
   * Xử lý đăng nhập
   * Luồng: Tìm user → So sánh mật khẩu → Tạo JWT token
   */
  async login(tenDangNhap, matKhau) {
    // 1. Tìm user theo tên đăng nhập
    const user = await nguoiDungDAO.findByUsername(tenDangNhap);
    if (!user) {
      const error = new Error('Tên đăng nhập không tồn tại');
      error.statusCode = 401;
      throw error;
    }

    // 2. Kiểm tra tài khoản có bị khóa không
    if (!user.trangThai) {
      const error = new Error('Tài khoản đã bị khóa. Vui lòng liên hệ admin.');
      error.statusCode = 403;
      throw error;
    }

    // 3. So sánh mật khẩu (hỗ trợ cả bcrypt hash và plaintext cũ)
    let isMatch = false;
    if (user.matKhau.startsWith('$2')) {
      // Mật khẩu đã được hash bằng bcrypt
      isMatch = await bcrypt.compare(matKhau, user.matKhau);
    } else {
      // Mật khẩu plaintext (dữ liệu mẫu cũ)
      isMatch = matKhau === user.matKhau;
    }

    if (!isMatch) {
      const error = new Error('Mật khẩu không chính xác');
      error.statusCode = 401;
      throw error;
    }

    // 4. Tạo JWT token
    const tokenPayload = {
      maNguoiDung: user.maNguoiDung,
      tenDangNhap: user.tenDangNhap,
      hoTen: user.hoTen,
      vaiTro: user.vaiTro
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    return {
      token,
      user: {
        maNguoiDung: user.maNguoiDung,
        tenDangNhap: user.tenDangNhap,
        hoTen: user.hoTen,
        email: user.email,
        vaiTro: user.vaiTro
      }
    };
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(maNguoiDung, matKhauCu, matKhauMoi) {
    const user = await nguoiDungDAO.findByUsername(
      (await nguoiDungDAO.findById(maNguoiDung)).tenDangNhap
    );
    if (!user) {
      const error = new Error('Người dùng không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    // Kiểm tra mật khẩu cũ
    let isMatch = false;
    if (user.matKhau.startsWith('$2')) {
      isMatch = await bcrypt.compare(matKhauCu, user.matKhau);
    } else {
      isMatch = matKhauCu === user.matKhau;
    }

    if (!isMatch) {
      const error = new Error('Mật khẩu cũ không chính xác');
      error.statusCode = 400;
      throw error;
    }

    // Hash mật khẩu mới và lưu
    const hashedPassword = await bcrypt.hash(matKhauMoi, 10);
    await nguoiDungDAO.updatePassword(maNguoiDung, hashedPassword);

    return { message: 'Đổi mật khẩu thành công' };
  }

  /**
   * Lấy thông tin user hiện tại
   */
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
