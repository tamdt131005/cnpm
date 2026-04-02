import { pool } from '../config/db.js';

class BaoCaoDAO {
  // Tổng thu theo học kỳ
  async tongThuTheoHocKy(maHocKy) {
    const [rows] = await pool.execute(
      `SELECT hk.maHocKy, hk.tenHocKy, nh.tenNamHoc,
              COUNT(DISTINCT tt.maThanhToan) AS soGiaoDich,
              COALESCE(SUM(tt.soTienTT), 0) AS tongThu
       FROM HOCKY hk
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       LEFT JOIN HOADONHOCPHI hd ON hd.maHocKy = hk.maHocKy
       LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
       WHERE hk.maHocKy = ?
       GROUP BY hk.maHocKy`,
      [maHocKy]
    );
    return rows[0] || null;
  }

  // Tổng thu theo năm học
  async tongThuTheoNamHoc(maNamHoc) {
    const [rows] = await pool.execute(
      `SELECT nh.maNamHoc, nh.tenNamHoc,
              COUNT(DISTINCT tt.maThanhToan) AS soGiaoDich,
              COALESCE(SUM(tt.soTienTT), 0) AS tongThu
       FROM NAMHOC nh
       LEFT JOIN HOCKY hk ON hk.maNamHoc = nh.maNamHoc
       LEFT JOIN HOADONHOCPHI hd ON hd.maHocKy = hk.maHocKy
       LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
       WHERE nh.maNamHoc = ?
       GROUP BY nh.maNamHoc`,
      [maNamHoc]
    );
    return rows[0] || null;
  }

  // DS sinh viên chưa đóng / quá hạn
  async dsSVChuaDong(maHocKy) {
    let sql = `
      SELECT hd.maHoaDon, hd.maSV, sv.hoTen, sv.maLop, l.tenLop,
             hd.tongTien, hd.soTienPhaiTra, hd.hanThanhToan, hd.trangThai,
             COALESCE(SUM(tt.soTienTT), 0) AS daTra,
             (hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0)) AS conLai
      FROM HOADONHOCPHI hd
      LEFT JOIN SINHVIEN sv ON hd.maSV = sv.maSV
      LEFT JOIN LOP l ON sv.maLop = l.maLop
      LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
      WHERE hd.trangThai IN ('ChuaThanhToan', 'ThanhToanMotPhan', 'QuaHan')
    `;
    const values = [];
    if (maHocKy) {
      sql += ' AND hd.maHocKy = ?';
      values.push(maHocKy);
    }
    sql += ' GROUP BY hd.maHoaDon ORDER BY hd.hanThanhToan ASC';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  // Thống kê theo khoa
  async thongKeTheoKhoa(maHocKy) {
    let sql = `
      SELECT k.maKhoa, k.tenKhoa,
             COUNT(DISTINCT hd.maSV) AS soSinhVien,
             COALESCE(SUM(hd.tongTien), 0) AS tongHocPhi,
             COALESCE(SUM(hd.soTienMienGiam), 0) AS tongMienGiam,
             COALESCE(SUM(hd.soTienPhaiTra), 0) AS tongPhaiTra,
             COALESCE(paid.tongDaTra, 0) AS tongDaTra
      FROM KHOA k
      LEFT JOIN NGANH n ON n.maKhoa = k.maKhoa
      LEFT JOIN LOP l ON l.maNganh = n.maNganh
      LEFT JOIN SINHVIEN sv ON sv.maLop = l.maLop
      LEFT JOIN HOADONHOCPHI hd ON hd.maSV = sv.maSV
      LEFT JOIN (
        SELECT hd2.maHoaDon, SUM(tt.soTienTT) AS tongDaTra
        FROM HOADONHOCPHI hd2
        LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd2.maHoaDon
        GROUP BY hd2.maHoaDon
      ) paid ON paid.maHoaDon = hd.maHoaDon
    `;
    const values = [];
    if (maHocKy) {
      sql += ' WHERE hd.maHocKy = ?';
      values.push(maHocKy);
    }
    sql += ' GROUP BY k.maKhoa ORDER BY k.maKhoa';

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  // Tra cứu học phí cá nhân (cho sinh viên)
  async traCuuCaNhan(maSV) {
    // Lấy hóa đơn + thanh toán
    const [hoaDons] = await pool.execute(
      `SELECT hd.*, hk.tenHocKy, nh.tenNamHoc,
              COALESCE(paid.tongDaTra, 0) AS daTra,
              (hd.soTienPhaiTra - COALESCE(paid.tongDaTra, 0)) AS conLai
       FROM HOADONHOCPHI hd
       LEFT JOIN HOCKY hk ON hd.maHocKy = hk.maHocKy
       LEFT JOIN NAMHOC nh ON hk.maNamHoc = nh.maNamHoc
       LEFT JOIN (
         SELECT maHoaDon, SUM(soTienTT) AS tongDaTra
         FROM THANHTOAN GROUP BY maHoaDon
       ) paid ON paid.maHoaDon = hd.maHoaDon
       WHERE hd.maSV = ?
       ORDER BY hd.ngayTaoHD DESC`,
      [maSV]
    );

    // Lấy DS đăng ký học + học phí tương ứng
    const [dangKyHocs] = await pool.execute(
      `SELECT dkh.*, mh.tenMH, mh.soTinChi, hk.tenHocKy,
              mhp.giaPerTinChi, (mh.soTinChi * mhp.giaPerTinChi) AS thanhTien
       FROM DANGKYHOC dkh
       LEFT JOIN MONHOC mh ON dkh.maMH = mh.maMH
       LEFT JOIN HOCKY hk ON dkh.maHocKy = hk.maHocKy
       LEFT JOIN MUCHOCPHI mhp ON mhp.maMH = dkh.maMH AND mhp.maHocKy = dkh.maHocKy
       WHERE dkh.maSV = ?
       ORDER BY dkh.ngayDangKy DESC`,
      [maSV]
    );

    return { hoaDons, dangKyHocs };
  }
}

export default new BaoCaoDAO();
