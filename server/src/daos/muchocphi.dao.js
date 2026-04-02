import { pool } from '../config/db.js';

class MucHocPhiDAO {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT mhp.*, mh.tenMH, mh.soTinChi, hk.tenHocKy, nh.tenNamHoc
       FROM MUCHOCPHI mhp
       LEFT JOIN MONHOC mh ON mhp.maMH = mh.maMH
       LEFT JOIN HOCKY hk ON mhp.maHocKy = hk.maHocKy
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       ORDER BY mhp.maMucHP DESC`
    );
    return rows;
  }

  async findById(maMucHP) {
    const [rows] = await pool.execute(
      `SELECT mhp.*, mh.tenMH, mh.soTinChi, hk.tenHocKy
       FROM MUCHOCPHI mhp
       LEFT JOIN MONHOC mh ON mhp.maMH = mh.maMH
       LEFT JOIN HOCKY hk ON mhp.maHocKy = hk.maHocKy
       WHERE mhp.maMucHP = ?`,
      [maMucHP]
    );
    return rows[0] || null;
  }

  // Tìm mức học phí theo môn + học kỳ + loại SV (dùng cho tính hóa đơn)
  async findByMonHocAndHocKy(maMH, maHocKy, loaiSinhVien = 'ChinhQuy') {
    const [rows] = await pool.execute(
      `SELECT mhp.*, mh.soTinChi 
       FROM MUCHOCPHI mhp
       LEFT JOIN MONHOC mh ON mhp.maMH = mh.maMH
       WHERE mhp.maMH = ? AND mhp.maHocKy = ? AND mhp.loaiSinhVien = ?`,
      [maMH, maHocKy, loaiSinhVien]
    );
    return rows[0] || null;
  }

  async create(data) {
    const { maMH, maHocKy, giaPerTinChi, loaiSinhVien } = data;
    const [result] = await pool.execute(
      'INSERT INTO MUCHOCPHI (maMH, maHocKy, giaPerTinChi, loaiSinhVien) VALUES (?, ?, ?, ?)',
      [maMH, maHocKy, giaPerTinChi, loaiSinhVien || 'ChinhQuy']
    );
    return result;
  }

  async update(maMucHP, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maMucHP);
    const [result] = await pool.execute(
      `UPDATE MUCHOCPHI SET ${fields.join(', ')} WHERE maMucHP = ?`,
      values
    );
    return result;
  }

  async delete(maMucHP) {
    const [result] = await pool.execute('DELETE FROM MUCHOCPHI WHERE maMucHP = ?', [maMucHP]);
    return result;
  }
}

export default new MucHocPhiDAO();
