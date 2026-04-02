import { pool } from '../config/db.js';

class MonHocDAO {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT mh.*, k.tenKhoa 
       FROM MONHOC mh 
       LEFT JOIN KHOA k ON mh.maKhoa = k.maKhoa
       ORDER BY mh.maMH`
    );
    return rows;
  }

  async findById(maMH) {
    const [rows] = await pool.execute(
      `SELECT mh.*, k.tenKhoa 
       FROM MONHOC mh 
       LEFT JOIN KHOA k ON mh.maKhoa = k.maKhoa
       WHERE mh.maMH = ?`,
      [maMH]
    );
    return rows[0] || null;
  }

  async create(data) {
    const { maMH, tenMH, soTinChi, maKhoa } = data;
    const [result] = await pool.execute(
      'INSERT INTO MONHOC (maMH, tenMH, soTinChi, maKhoa) VALUES (?, ?, ?, ?)',
      [maMH, tenMH, soTinChi, maKhoa || null]
    );
    return result;
  }

  async update(maMH, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maMH);
    const [result] = await pool.execute(
      `UPDATE MONHOC SET ${fields.join(', ')} WHERE maMH = ?`,
      values
    );
    return result;
  }

  async delete(maMH) {
    const [result] = await pool.execute('DELETE FROM MONHOC WHERE maMH = ?', [maMH]);
    return result;
  }
}

export default new MonHocDAO();
