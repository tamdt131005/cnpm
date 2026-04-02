import { pool } from '../config/db.js';

class DangKyHocDAO {
  async findAll(filters = {}) {
    let sql = `
      SELECT dkh.*, sv.hoTen, mh.tenMH, mh.soTinChi, hk.tenHocKy
      FROM DANGKYHOC dkh
      LEFT JOIN SINHVIEN sv ON dkh.maSV = sv.maSV
      LEFT JOIN MONHOC mh ON dkh.maMH = mh.maMH
      LEFT JOIN HOCKY hk ON dkh.maHocKy = hk.maHocKy
    `;
    const conditions = [];
    const values = [];

    if (filters.maHocKy) {
      conditions.push('dkh.maHocKy = ?');
      values.push(filters.maHocKy);
    }
    if (filters.maSV) {
      conditions.push('dkh.maSV = ?');
      values.push(filters.maSV);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY dkh.ngayDangKy DESC';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  async findById(maDangKy) {
    const [rows] = await pool.execute(
      `SELECT dkh.*, sv.hoTen, mh.tenMH, mh.soTinChi, hk.tenHocKy
       FROM DANGKYHOC dkh
       LEFT JOIN SINHVIEN sv ON dkh.maSV = sv.maSV
       LEFT JOIN MONHOC mh ON dkh.maMH = mh.maMH
       LEFT JOIN HOCKY hk ON dkh.maHocKy = hk.maHocKy
       WHERE dkh.maDangKy = ?`,
      [maDangKy]
    );
    return rows[0] || null;
  }

  // Lấy DS đăng ký theo sinh viên và học kỳ (dùng cho tính hóa đơn)
  async findBySVAndHocKy(maSV, maHocKy) {
    const [rows] = await pool.execute(
      `SELECT dkh.*, mh.tenMH, mh.soTinChi
       FROM DANGKYHOC dkh
       LEFT JOIN MONHOC mh ON dkh.maMH = mh.maMH
       WHERE dkh.maSV = ? AND dkh.maHocKy = ? AND dkh.trangThai = 'ThanhCong'`,
      [maSV, maHocKy]
    );
    return rows;
  }

  async create(data) {
    const { maSV, maMH, maHocKy, ngayDangKy, trangThai } = data;
    const [result] = await pool.execute(
      'INSERT INTO DANGKYHOC (maSV, maMH, maHocKy, ngayDangKy, trangThai) VALUES (?, ?, ?, ?, ?)',
      [maSV, maMH, maHocKy, ngayDangKy || new Date(), trangThai || 'ThanhCong']
    );
    return result;
  }

  async updateStatus(maDangKy, trangThai) {
    const [result] = await pool.execute(
      'UPDATE DANGKYHOC SET trangThai = ? WHERE maDangKy = ?',
      [trangThai, maDangKy]
    );
    return result;
  }
}

export default new DangKyHocDAO();
