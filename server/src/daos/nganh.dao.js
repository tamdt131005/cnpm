import { pool } from '../config/db.js';

class NganhDAO {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT n.*, k.tenKhoa FROM NGANH n 
       LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa 
       ORDER BY n.maNganh`
    );
    return rows;
  }

  async findById(maNganh) {
    const [rows] = await pool.execute(
      `SELECT n.*, k.tenKhoa FROM NGANH n 
       LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa 
       WHERE n.maNganh = ?`,
      [maNganh]
    );
    return rows[0] || null;
  }

  async findByKhoa(maKhoa) {
    const [rows] = await pool.execute(
      'SELECT * FROM NGANH WHERE maKhoa = ? ORDER BY maNganh',
      [maKhoa]
    );
    return rows;
  }

  async create(data) {
    const { maNganh, tenNganh, maKhoa } = data;
    const [result] = await pool.execute(
      'INSERT INTO NGANH (maNganh, tenNganh, maKhoa) VALUES (?, ?, ?)',
      [maNganh, tenNganh, maKhoa]
    );
    return result;
  }

  async update(maNganh, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maNganh);
    const [result] = await pool.execute(
      `UPDATE NGANH SET ${fields.join(', ')} WHERE maNganh = ?`,
      values
    );
    return result;
  }

  async delete(maNganh) {
    const [result] = await pool.execute('DELETE FROM NGANH WHERE maNganh = ?', [maNganh]);
    return result;
  }
}

export default new NganhDAO();
