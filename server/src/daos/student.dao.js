import { pool } from '../config/db.js';

class StudentDAO {
    async findUserById(maNguoiDung) {
        const [rows] = await pool.execute(
            'SELECT maNguoiDung, tenDangNhap, vaiTro FROM NGUOIDUNG WHERE maNguoiDung = ?', [maNguoiDung]
        );
        return rows[0] || null;
    }

    async findStudentProfileByUserId(maNguoiDung) {
        const [rows] = await pool.execute(
            `SELECT nd.maNguoiDung, nd.tenDangNhap, nd.vaiTro, sv.maSV, sv.hoTen, sv.email, sv.soDienThoai, sv.maLop, sv.trangThai
       FROM NGUOIDUNG nd
       INNER JOIN SINHVIEN sv ON (sv.maSV = nd.tenDangNhap OR sv.email = nd.email)
       WHERE nd.maNguoiDung = ?
       LIMIT 1`, [maNguoiDung]
        );
        return rows[0] || null;
    }

    async getInvoicesByMaSV(maSV) {
        const [rows] = await pool.execute(
            `SELECT hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam, hd.soTienPhaiTra,
              hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai,
              COALESCE(SUM(tt.soTienTT), 0) AS daNop
       FROM HOADONHOCPHI hd
       LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
       WHERE hd.maSV = ?
       GROUP BY hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam,
                hd.soTienPhaiTra, hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai
       ORDER BY hd.ngayTaoHD DESC`, [maSV]
        );
        return rows;
    }

    async getTransactionsByMaSV(maSV) {
        const [rows] = await pool.execute(
            `SELECT tt.maThanhToan, tt.maHoaDon, tt.maNguoiDung, tt.soTienTT, tt.ngayThanhToan,
              tt.phuongThucTT, tt.ghiChu
       FROM THANHTOAN tt
       INNER JOIN HOADONHOCPHI hd ON hd.maHoaDon = tt.maHoaDon
       WHERE hd.maSV = ?
       ORDER BY tt.ngayThanhToan DESC`, [maSV]
        );
        return rows;
    }

    async getRegisteredCoursesByMaSV(maSV, maHocKy, loaiSinhVien) {
        let sql = `SELECT dk.maDangKy, dk.maSV, dk.maMH, mh.tenMH, mh.soTinChi,
                          dk.maHocKy, hk.tenHocKy, dk.ngayDangKy, dk.trangThai,
                          COALESCE(hp.giaPerTinChi, 0) AS giaPerTinChi,
                          COALESCE(mh.soTinChi * hp.giaPerTinChi, 0) AS hocPhiDuKien
                   FROM DANGKYHOC dk
                   INNER JOIN MONHOC mh ON mh.maMH = dk.maMH
                   LEFT JOIN HOCKY hk ON hk.maHocKy = dk.maHocKy
                   LEFT JOIN MUCHOCPHI hp
                     ON hp.maMH = dk.maMH
                    AND hp.maHocKy = dk.maHocKy
                    AND hp.loaiSinhVien = ?
                   WHERE dk.maSV = ?`;

        const params = [loaiSinhVien, maSV];

        if (maHocKy) {
            sql += ' AND dk.maHocKy = ?';
            params.push(maHocKy);
        }

        sql += ' ORDER BY dk.maHocKy DESC, dk.maMH ASC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async findInvoiceById(maHoaDon) {
        const [rows] = await pool.execute(
            `SELECT hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam, hd.soTienPhaiTra,
              hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai,
              COALESCE(SUM(tt.soTienTT), 0) AS daNop
       FROM HOADONHOCPHI hd
       LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
       WHERE hd.maHoaDon = ?
       GROUP BY hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam,
                hd.soTienPhaiTra, hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai`, [maHoaDon]
        );
        return rows[0] || null;
    }

    async createTransaction(data) {
        const { maThanhToan, maHoaDon, maNguoiDung, soTienTT, phuongThucTT, ghiChu } = data;
        const [result] = await pool.execute(
            `INSERT INTO THANHTOAN (maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT, ghiChu)
       VALUES (?, ?, ?, ?, NOW(), ?, ?)`, [maThanhToan, maHoaDon, maNguoiDung, soTienTT, phuongThucTT, ghiChu || null]
        );
        return result;
    }

    async findTransactionById(maThanhToan) {
        const [rows] = await pool.execute(
            `SELECT maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT, ghiChu
       FROM THANHTOAN
       WHERE maThanhToan = ?`, [maThanhToan]
        );
        return rows[0] || null;
    }

    async updateInvoiceStatus(maHoaDon, trangThai) {
        const [result] = await pool.execute(
            'UPDATE HOADONHOCPHI SET trangThai = ? WHERE maHoaDon = ?', [trangThai, maHoaDon]
        );
        return result;
    }
}

export default new StudentDAO();