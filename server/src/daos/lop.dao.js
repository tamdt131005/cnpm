import { pool } from '../config/db.js';

class LopDAO {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT l.*, n.tenNganh, k.tenKhoa 
       FROM LOP l
       LEFT JOIN NGANH n ON l.maNganh = n.maNganh
       LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa
       ORDER BY l.maLop`
    );
    return rows;
  }

  async findById(maLop) {
    const [rows] = await pool.execute(
      `SELECT l.*, n.tenNganh, k.tenKhoa 
       FROM LOP l
       LEFT JOIN NGANH n ON l.maNganh = n.maNganh
       LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa
       WHERE l.maLop = ?`,
      [maLop]
    );
    return rows[0] || null;
  }

  async findByNganh(maNganh) {
    const [rows] = await pool.execute(
      'SELECT * FROM LOP WHERE maNganh = ? ORDER BY maLop',
      [maNganh]
    );
    return rows;
  }

  async create(data) {
    const { maLop, tenLop, nienKhoa, maNganh } = data;
    const [result] = await pool.execute(
      'INSERT INTO LOP (maLop, tenLop, nienKhoa, maNganh) VALUES (?, ?, ?, ?)',
      [maLop, tenLop, nienKhoa || null, maNganh || null]
    );
    return result;
  }

  async update(maLop, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maLop);
    const [result] = await pool.execute(
      `UPDATE LOP SET ${fields.join(', ')} WHERE maLop = ?`,
      values
    );
    return result;
  }

  async delete(maLop) {
    const [result] = await pool.execute('DELETE FROM LOP WHERE maLop = ?', [maLop]);
    return result;
  }
}

export default new LopDAO();
