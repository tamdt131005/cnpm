import { pool } from '../config/db.js';

class KhoaDAO {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM KHOA ORDER BY maKhoa');
    return rows;
  }

  async findById(maKhoa) {
    const [rows] = await pool.execute('SELECT * FROM KHOA WHERE maKhoa = ?', [maKhoa]);
    return rows[0] || null;
  }

  async create(data) {
    const { maKhoa, tenKhoa, truongKhoa } = data;
    const [result] = await pool.execute(
      'INSERT INTO KHOA (maKhoa, tenKhoa, truongKhoa) VALUES (?, ?, ?)',
      [maKhoa, tenKhoa, truongKhoa || null]
    );
    return result;
  }

  async update(maKhoa, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maKhoa);
    const [result] = await pool.execute(
      `UPDATE KHOA SET ${fields.join(', ')} WHERE maKhoa = ?`,
      values
    );
    return result;
  }

  async delete(maKhoa) {
    const [result] = await pool.execute('DELETE FROM KHOA WHERE maKhoa = ?', [maKhoa]);
    return result;
  }
}

export default new KhoaDAO();
