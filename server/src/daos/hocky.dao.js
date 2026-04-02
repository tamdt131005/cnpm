import { pool } from '../config/db.js';

class HocKyDAO {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT hk.*, nh.tenNamHoc 
       FROM HOCKY hk 
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       ORDER BY hk.ngayBatDau DESC`
    );
    return rows;
  }

  async findById(maHocKy) {
    const [rows] = await pool.execute(
      `SELECT hk.*, nh.tenNamHoc 
       FROM HOCKY hk 
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       WHERE hk.maHocKy = ?`,
      [maHocKy]
    );
    return rows[0] || null;
  }

  async findByNamHoc(maNamHoc) {
    const [rows] = await pool.execute(
      'SELECT * FROM HOCKY WHERE maNamHoc = ? ORDER BY hocKySo',
      [maNamHoc]
    );
    return rows;
  }

  async create(data) {
    const { maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc } = data;
    const [result] = await pool.execute(
      'INSERT INTO HOCKY (maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc) VALUES (?, ?, ?, ?, ?, ?)',
      [maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc]
    );
    return result;
  }

  async update(maHocKy, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maHocKy);
    const [result] = await pool.execute(
      `UPDATE HOCKY SET ${fields.join(', ')} WHERE maHocKy = ?`,
      values
    );
    return result;
  }

  async delete(maHocKy) {
    const [result] = await pool.execute('DELETE FROM HOCKY WHERE maHocKy = ?', [maHocKy]);
    return result;
  }
}

export default new HocKyDAO();
