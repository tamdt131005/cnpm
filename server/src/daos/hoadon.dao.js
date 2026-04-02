import { pool } from '../config/db.js';

class HoaDonDAO {
  async findAll(filters = {}) {
    let sql = `
      SELECT hd.*, sv.hoTen, hk.tenHocKy, nh.tenNamHoc
      FROM HOADONHOCPHI hd
      LEFT JOIN SINHVIEN sv ON hd.maSV = sv.maSV
      LEFT JOIN HOCKY hk ON hd.maHocKy = hk.maHocKy
      LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
    `;
    const conditions = [];
    const values = [];

    if (filters.maSV) {
      conditions.push('hd.maSV = ?');
      values.push(filters.maSV);
    }
    if (filters.maHocKy) {
      conditions.push('hd.maHocKy = ?');
      values.push(filters.maHocKy);
    }
    if (filters.trangThai) {
      conditions.push('hd.trangThai = ?');
      values.push(filters.trangThai);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY hd.ngayTaoHD DESC';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  async findById(maHoaDon) {
    const [rows] = await pool.execute(
      `SELECT hd.*, sv.hoTen, sv.maLop, hk.tenHocKy, nh.tenNamHoc
       FROM HOADONHOCPHI hd
       LEFT JOIN SINHVIEN sv ON hd.maSV = sv.maSV
       LEFT JOIN HOCKY hk ON hd.maHocKy = hk.maHocKy
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       WHERE hd.maHoaDon = ?`,
      [maHoaDon]
    );
    return rows[0] || null;
  }

  async create(data) {
    const { maHoaDon, maSV, maHocKy, tongTien, soTienMienGiam, soTienPhaiTra, ngayTaoHD, hanThanhToan } = data;
    const [result] = await pool.execute(
      `INSERT INTO HOADONHOCPHI (maHoaDon, maSV, maHocKy, tongTien, soTienMienGiam, soTienPhaiTra, ngayTaoHD, hanThanhToan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [maHoaDon, maSV, maHocKy, tongTien, soTienMienGiam || 0, soTienPhaiTra, ngayTaoHD || new Date(), hanThanhToan || null]
    );
    return result;
  }

  // Cập nhật miễn giảm, tính lại số tiền phải trả
  async updateMienGiam(maHoaDon, soTienMienGiam) {
    const [result] = await pool.execute(
      `UPDATE HOADONHOCPHI 
       SET soTienMienGiam = ?, soTienPhaiTra = tongTien - ? 
       WHERE maHoaDon = ?`,
      [soTienMienGiam, soTienMienGiam, maHoaDon]
    );
    return result;
  }

  // Cập nhật trạng thái hóa đơn
  async updateStatus(maHoaDon, trangThai) {
    const [result] = await pool.execute(
      'UPDATE HOADONHOCPHI SET trangThai = ? WHERE maHoaDon = ?',
      [trangThai, maHoaDon]
    );
    return result;
  }
}

export default new HoaDonDAO();
