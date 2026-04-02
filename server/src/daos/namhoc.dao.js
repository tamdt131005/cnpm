import { pool } from '../config/db.js';

class NamHocDAO {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM NAMHOC ORDER BY namBatDau DESC');
    return rows;
  }

  async findById(maNamHoc) {
    const [rows] = await pool.execute('SELECT * FROM NAMHOC WHERE maNamHoc = ?', [maNamHoc]);
    return rows[0] || null;
  }

  async create(data) {
    const { maNamHoc, tenNamHoc, namBatDau, namKetThuc } = data;
    const [result] = await pool.execute(
      'INSERT INTO NAMHOC (maNamHoc, tenNamHoc, namBatDau, namKetThuc) VALUES (?, ?, ?, ?)',
      [maNamHoc, tenNamHoc, namBatDau, namKetThuc]
    );
    return result;
  }

  async update(maNamHoc, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maNamHoc);
    const [result] = await pool.execute(
      `UPDATE NAMHOC SET ${fields.join(', ')} WHERE maNamHoc = ?`,
      values
    );
    return result;
  }

  async delete(maNamHoc) {
    const [result] = await pool.execute('DELETE FROM NAMHOC WHERE maNamHoc = ?', [maNamHoc]);
    return result;
  }
}

export default new NamHocDAO();
