import { pool } from '../config/db.js';

class NguoiDungDAO {
  // Tìm người dùng theo tên đăng nhập (dùng cho login)
  async findByUsername(tenDangNhap) {
    const [rows] = await pool.execute(
      'SELECT * FROM NGUOIDUNG WHERE tenDangNhap = ?',
      [tenDangNhap]
    );
    return rows[0] || null;
  }

  // Tìm người dùng theo mã
  async findById(maNguoiDung) {
    const [rows] = await pool.execute(
      'SELECT maNguoiDung, tenDangNhap, hoTen, email, soDienThoai, vaiTro, trangThai, ngayTao FROM NGUOIDUNG WHERE maNguoiDung = ?',
      [maNguoiDung]
    );
    return rows[0] || null;
  }

  // Lấy danh sách tất cả người dùng (không trả mật khẩu)
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT maNguoiDung, tenDangNhap, hoTen, email, soDienThoai, vaiTro, trangThai, ngayTao FROM NGUOIDUNG ORDER BY ngayTao DESC'
    );
    return rows;
  }

  // Thêm người dùng mới
  async create(data) {
    const { maNguoiDung, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro } = data;
    const [result] = await pool.execute(
      'INSERT INTO NGUOIDUNG (maNguoiDung, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maNguoiDung, tenDangNhap, matKhau, hoTen || null, email || null, soDienThoai || null, vaiTro || 'SinhVien']
    );
    return result;
  }

  // Cập nhật thông tin người dùng
  async update(maNguoiDung, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maNguoiDung);
    const [result] = await pool.execute(
      `UPDATE NGUOIDUNG SET ${fields.join(', ')} WHERE maNguoiDung = ?`,
      values
    );
    return result;
  }

  // Cập nhật mật khẩu
  async updatePassword(maNguoiDung, hashedPassword) {
    const [result] = await pool.execute(
      'UPDATE NGUOIDUNG SET matKhau = ? WHERE maNguoiDung = ?',
      [hashedPassword, maNguoiDung]
    );
    return result;
  }

  // Cập nhật trạng thái (khóa/mở khóa)
  async updateStatus(maNguoiDung, trangThai) {
    const [result] = await pool.execute(
      'UPDATE NGUOIDUNG SET trangThai = ? WHERE maNguoiDung = ?',
      [trangThai, maNguoiDung]
    );
    return result;
  }
}

export default new NguoiDungDAO();
