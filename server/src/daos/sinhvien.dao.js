import { pool } from '../config/db.js';

class SinhVienDAO {
  async findAll(filters = {}) {
    let sql = `
      SELECT sv.*, l.tenLop, n.tenNganh, k.tenKhoa 
      FROM SINHVIEN sv
      LEFT JOIN LOP l ON sv.maLop = l.maLop
      LEFT JOIN NGANH n ON l.maNganh = n.maNganh
      LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa
    `;
    const conditions = [];
    const values = [];

    if (filters.maLop) {
      conditions.push('sv.maLop = ?');
      values.push(filters.maLop);
    }
    if (filters.maKhoa) {
      conditions.push('k.maKhoa = ?');
      values.push(filters.maKhoa);
    }
    if (filters.trangThai) {
      conditions.push('sv.trangThai = ?');
      values.push(filters.trangThai);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY sv.maSV';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  async findById(maSV) {
    const [rows] = await pool.execute(
      `SELECT sv.*, l.tenLop, n.tenNganh, k.tenKhoa 
       FROM SINHVIEN sv
       LEFT JOIN LOP l ON sv.maLop = l.maLop
       LEFT JOIN NGANH n ON l.maNganh = n.maNganh
       LEFT JOIN KHOA k ON n.maKhoa = k.maKhoa
       WHERE sv.maSV = ?`,
      [maSV]
    );
    return rows[0] || null;
  }

  async create(data) {
    const { maSV, hoTen, ngaySinh, gioiTinh, diaChi, email, soDienThoai, maLop } = data;
    const [result] = await pool.execute(
      'INSERT INTO SINHVIEN (maSV, hoTen, ngaySinh, gioiTinh, diaChi, email, soDienThoai, maLop) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [maSV, hoTen, ngaySinh || null, gioiTinh ?? null, diaChi || null, email || null, soDienThoai || null, maLop || null]
    );
    return result;
  }

  async update(maSV, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(maSV);
    const [result] = await pool.execute(
      `UPDATE SINHVIEN SET ${fields.join(', ')} WHERE maSV = ?`,
      values
    );
    return result;
  }

  async updateStatus(maSV, trangThai) {
    const [result] = await pool.execute(
      'UPDATE SINHVIEN SET trangThai = ? WHERE maSV = ?',
      [trangThai, maSV]
    );
    return result;
  }

  async delete(maSV) {
    const [result] = await pool.execute('DELETE FROM SINHVIEN WHERE maSV = ?', [maSV]);
    return result;
  }
}

export default new SinhVienDAO();
