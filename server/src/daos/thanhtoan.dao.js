import { pool } from '../config/db.js';

class ThanhToanDAO {
  async findAll(filters = {}) {
    let sql = `
      SELECT tt.*, hd.maSV, hd.tongTien, hd.soTienPhaiTra, hd.trangThai AS trangThaiHoaDon,
             sv.hoTen, nd.hoTen AS nguoiThucHien
      FROM THANHTOAN tt
      LEFT JOIN HOADONHOCPHI hd ON tt.maHoaDon = hd.maHoaDon
      LEFT JOIN SINHVIEN sv ON hd.maSV = sv.maSV
      LEFT JOIN NGUOIDUNG nd ON tt.maNguoiDung = nd.maNguoiDung
    `;
    const conditions = [];
    const values = [];

    if (filters.maHoaDon) {
      conditions.push('tt.maHoaDon = ?');
      values.push(filters.maHoaDon);
    }
    if (filters.maSV) {
      conditions.push('hd.maSV = ?');
      values.push(filters.maSV);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY tt.ngayThanhToan DESC';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  async findById(maThanhToan) {
    const [rows] = await pool.execute(
      `SELECT tt.*, hd.maSV, hd.tongTien, hd.soTienPhaiTra, sv.hoTen
       FROM THANHTOAN tt
       LEFT JOIN HOADONHOCPHI hd ON tt.maHoaDon = hd.maHoaDon
       LEFT JOIN SINHVIEN sv ON hd.maSV = sv.maSV
       WHERE tt.maThanhToan = ?`,
      [maThanhToan]
    );
    return rows[0] || null;
  }

  // Tính tổng tiền đã thanh toán cho 1 hóa đơn
  async getTotalPaidByHoaDon(maHoaDon) {
    const [rows] = await pool.execute(
      'SELECT COALESCE(SUM(soTienTT), 0) AS totalPaid FROM THANHTOAN WHERE maHoaDon = ?',
      [maHoaDon]
    );
    return parseFloat(rows[0].totalPaid);
  }

  async create(data) {
    const { maThanhToan, maHoaDon, maNguoiDung, soTienTT, phuongThucTT, ghiChu } = data;
    const [result] = await pool.execute(
      `INSERT INTO THANHTOAN (maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT, ghiChu)
       VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
      [maThanhToan, maHoaDon, maNguoiDung, soTienTT, phuongThucTT, ghiChu || null]
    );
    return result;
  }
}

export default new ThanhToanDAO();
