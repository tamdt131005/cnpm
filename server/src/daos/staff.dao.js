import { pool } from '../config/db.js';

class StaffDAO {
    async findUserById(maNguoiDung) {
        const [rows] = await pool.execute(
            'SELECT maNguoiDung, tenDangNhap, vaiTro FROM NGUOIDUNG WHERE maNguoiDung = ?', [maNguoiDung]
        );
        return rows[0] || null;
    }

    async findFeeRate(maMH, maHocKy, loaiSinhVien) {
        const [rows] = await pool.execute(
            `SELECT maMucHP, maMH, maHocKy, giaPerTinChi, loaiSinhVien
       FROM MUCHOCPHI
       WHERE maMH = ? AND maHocKy = ? AND loaiSinhVien = ?
       LIMIT 1`, [maMH, maHocKy, loaiSinhVien]
        );
        return rows[0] || null;
    }

    async createFeeRate(data) {
        const { maMH, maHocKy, giaPerTinChi, loaiSinhVien } = data;
        const [result] = await pool.execute(
            `INSERT INTO MUCHOCPHI (maMH, maHocKy, giaPerTinChi, loaiSinhVien)
       VALUES (?, ?, ?, ?)`, [maMH, maHocKy, giaPerTinChi, loaiSinhVien]
        );
        return result;
    }

    async findFeeRateById(maMucHP) {
        const [rows] = await pool.execute(
            `SELECT hp.maMucHP, hp.maMH, mh.tenMH, hp.maHocKy, hk.tenHocKy, hk.maNamHoc,
              hp.giaPerTinChi, hp.loaiSinhVien
       FROM MUCHOCPHI hp
       LEFT JOIN MONHOC mh ON mh.maMH = hp.maMH
       LEFT JOIN HOCKY hk ON hk.maHocKy = hp.maHocKy
       WHERE hp.maMucHP = ?
       LIMIT 1`, [maMucHP]
        );
        return rows[0] || null;
    }

    async getFeeRates() {
        const [rows] = await pool.execute(
            `SELECT hp.maMucHP, hp.maMH, mh.tenMH, hp.maHocKy, hk.tenHocKy, hk.maNamHoc,
              hp.giaPerTinChi, hp.loaiSinhVien
       FROM MUCHOCPHI hp
       LEFT JOIN MONHOC mh ON mh.maMH = hp.maMH
       LEFT JOIN HOCKY hk ON hk.maHocKy = hp.maHocKy
       ORDER BY hp.maHocKy DESC, hp.maMH ASC`
        );
        return rows;
    }

    async getFeeRateOptions() {
        const [monHoc] = await pool.execute(
            `SELECT maMH, tenMH
             FROM MONHOC
             ORDER BY maMH ASC`
        );

        const [hocKy] = await pool.execute(
            `SELECT maHocKy, tenHocKy, maNamHoc
             FROM HOCKY
             ORDER BY maHocKy DESC`
        );

        return {
            monHoc,
            hocKy
        };
    }

    async getDebts() {
        const [rows] = await pool.execute(
            `SELECT sv.maSV, sv.hoTen, sv.maLop, hd.maHoaDon, hd.maHocKy, hd.soTienPhaiTra,
              COALESCE(SUM(tt.soTienTT), 0) AS daNop,
              GREATEST(hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0), 0) AS conNo,
              hd.hanThanhToan, hd.trangThai
       FROM HOADONHOCPHI hd
       INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
       LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
       GROUP BY sv.maSV, sv.hoTen, sv.maLop, hd.maHoaDon, hd.maHocKy, hd.soTienPhaiTra,
                hd.hanThanhToan, hd.trangThai
       HAVING GREATEST(hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0), 0) > 0
       ORDER BY conNo DESC, hd.hanThanhToan ASC`
        );
        return rows;
    }

    async getStudentFeeTotalsBySemester(maHocKy, loaiSinhVien) {
        const [rows] = await pool.execute(
            `SELECT dk.maSV,
              COUNT(DISTINCT dk.maMH) AS soMon,
              COALESCE(SUM(mh.soTinChi), 0) AS tongTinChi,
              COALESCE(SUM(mh.soTinChi * COALESCE(hp.giaPerTinChi, 0)), 0) AS tongTien
       FROM DANGKYHOC dk
       INNER JOIN MONHOC mh ON mh.maMH = dk.maMH
       LEFT JOIN MUCHOCPHI hp
         ON hp.maMH = dk.maMH
        AND hp.maHocKy = dk.maHocKy
        AND hp.loaiSinhVien = ?
       WHERE dk.maHocKy = ?
         AND dk.trangThai = 'ThanhCong'
       GROUP BY dk.maSV`, [loaiSinhVien, maHocKy]
        );
        return rows;
    }

    async getRegistrations(maHocKy, loaiSinhVien) {
        let sql = `SELECT dk.maDangKy, dk.maSV, sv.hoTen, sv.maLop, dk.maMH, mh.tenMH, mh.soTinChi,
                          dk.maHocKy, dk.ngayDangKy, dk.trangThai,
                          COALESCE(hp.giaPerTinChi, 0) AS giaPerTinChi,
                          COALESCE(mh.soTinChi * hp.giaPerTinChi, 0) AS hocPhiDuKien
                   FROM DANGKYHOC dk
                   INNER JOIN SINHVIEN sv ON sv.maSV = dk.maSV
                   INNER JOIN MONHOC mh ON mh.maMH = dk.maMH
                   LEFT JOIN MUCHOCPHI hp
                     ON hp.maMH = dk.maMH
                    AND hp.maHocKy = dk.maHocKy
                    AND hp.loaiSinhVien = ?
                   WHERE 1 = 1`;

        const params = [loaiSinhVien];

        if (maHocKy) {
            sql += ' AND dk.maHocKy = ?';
            params.push(maHocKy);
        }

        sql += ' ORDER BY dk.maHocKy DESC, dk.maSV ASC, dk.maMH ASC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async getInvoices(filters = {}) {
        let sql = `SELECT hd.maHoaDon, hd.maSV, sv.hoTen, sv.maLop, hd.maHocKy,
                          hd.tongTien, hd.soTienMienGiam, hd.soTienPhaiTra,
                          hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai,
                          COALESCE(SUM(tt.soTienTT), 0) AS daNop,
                          GREATEST(hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0), 0) AS conNo
                   FROM HOADONHOCPHI hd
                   INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
                   LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
                   WHERE 1 = 1`;

        const params = [];

        if (filters.maHocKy) {
            sql += ' AND hd.maHocKy = ?';
            params.push(filters.maHocKy);
        }

        if (filters.maSV) {
            sql += ' AND hd.maSV = ?';
            params.push(filters.maSV);
        }

        sql += ` GROUP BY hd.maHoaDon, hd.maSV, sv.hoTen, sv.maLop, hd.maHocKy,
                         hd.tongTien, hd.soTienMienGiam, hd.soTienPhaiTra,
                         hd.ngayTaoHD, hd.hanThanhToan, hd.trangThai`;

        if (filters.trangThaiNo === 'ConNo') {
            sql += ' HAVING GREATEST(hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0), 0) > 0';
        }

        if (filters.trangThaiNo === 'DaThanhToan') {
            sql += ' HAVING GREATEST(hd.soTienPhaiTra - COALESCE(SUM(tt.soTienTT), 0), 0) = 0';
        }

        sql += ' ORDER BY hd.ngayTaoHD DESC, hd.maHoaDon DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async findInvoiceSummary(maHoaDon) {
        const [rows] = await pool.execute(
            `SELECT hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam,
                    hd.soTienPhaiTra, hd.trangThai, hd.hanThanhToan,
                    COALESCE(SUM(tt.soTienTT), 0) AS daNop
             FROM HOADONHOCPHI hd
             LEFT JOIN THANHTOAN tt ON tt.maHoaDon = hd.maHoaDon
             WHERE hd.maHoaDon = ?
             GROUP BY hd.maHoaDon, hd.maSV, hd.maHocKy, hd.tongTien, hd.soTienMienGiam,
                      hd.soTienPhaiTra, hd.trangThai, hd.hanThanhToan`,
            [maHoaDon]
        );
        return rows[0] || null;
    }

    async updateInvoiceAmounts(maHoaDon, soTienMienGiam, soTienPhaiTra, trangThai) {
        const [result] = await pool.execute(
            `UPDATE HOADONHOCPHI
             SET soTienMienGiam = ?, soTienPhaiTra = ?, trangThai = ?
             WHERE maHoaDon = ?`,
            [soTienMienGiam, soTienPhaiTra, trangThai, maHoaDon]
        );
        return result;
    }

    async createPayment(data) {
        const [result] = await pool.execute(
            `INSERT INTO THANHTOAN (maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT, ghiChu)
             VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
            [
                data.maThanhToan,
                data.maHoaDon,
                data.maNguoiDung,
                data.soTienTT,
                data.phuongThucTT,
                data.ghiChu || null
            ]
        );
        return result;
    }

    async findPaymentById(maThanhToan) {
        const [rows] = await pool.execute(
            `SELECT maThanhToan, maHoaDon, maNguoiDung, soTienTT, ngayThanhToan, phuongThucTT, ghiChu
             FROM THANHTOAN
             WHERE maThanhToan = ?
             LIMIT 1`,
            [maThanhToan]
        );
        return rows[0] || null;
    }

    async getPaymentHistory(filters = {}) {
        let sql = `SELECT tt.maThanhToan, tt.maHoaDon, tt.maNguoiDung, tt.soTienTT, tt.ngayThanhToan,
                          tt.phuongThucTT, tt.ghiChu,
                          hd.maSV, hd.maHocKy, sv.hoTen, sv.maLop
                   FROM THANHTOAN tt
                   INNER JOIN HOADONHOCPHI hd ON hd.maHoaDon = tt.maHoaDon
                   INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
                   WHERE 1 = 1`;

        const params = [];

        if (filters.maHocKy) {
            sql += ' AND hd.maHocKy = ?';
            params.push(filters.maHocKy);
        }

        if (filters.maSV) {
            sql += ' AND hd.maSV = ?';
            params.push(filters.maSV);
        }

        sql += ' ORDER BY tt.ngayThanhToan DESC, tt.maThanhToan DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async getRevenueSummary(maNamHoc) {
        let sql = `SELECT COALESCE(hk.maNamHoc, 'N/A') AS maNamHoc,
                          hd.maHocKy,
                          COUNT(tt.maThanhToan) AS soGiaoDich,
                          COUNT(DISTINCT hd.maHoaDon) AS soHoaDon,
                          COALESCE(SUM(tt.soTienTT), 0) AS tongThu
                   FROM THANHTOAN tt
                   INNER JOIN HOADONHOCPHI hd ON hd.maHoaDon = tt.maHoaDon
                   LEFT JOIN HOCKY hk ON hk.maHocKy = hd.maHocKy
                   WHERE 1 = 1`;

        const params = [];
        if (maNamHoc) {
            sql += ' AND hk.maNamHoc = ?';
            params.push(maNamHoc);
        }

        sql += ' GROUP BY COALESCE(hk.maNamHoc, \"N/A\"), hd.maHocKy ORDER BY hd.maHocKy DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async getDebtByOrganization() {
        const [byKhoa] = await pool.execute(
            `SELECT k.maKhoa, k.tenKhoa,
                    SUM(GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0)) AS tongNo,
                    SUM(CASE WHEN GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0) > 0 THEN 1 ELSE 0 END) AS soHoaDonNo
             FROM HOADONHOCPHI hd
             INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
             INNER JOIN LOP l ON l.maLop = sv.maLop
             INNER JOIN NGANH n ON n.maNganh = l.maNganh
             INNER JOIN KHOA k ON k.maKhoa = n.maKhoa
             LEFT JOIN (
                SELECT maHoaDon, COALESCE(SUM(soTienTT), 0) AS daNop
                FROM THANHTOAN
                GROUP BY maHoaDon
             ) tt ON tt.maHoaDon = hd.maHoaDon
             GROUP BY k.maKhoa, k.tenKhoa
             HAVING tongNo > 0
             ORDER BY tongNo DESC`
        );

        const [byNganh] = await pool.execute(
            `SELECT n.maNganh, n.tenNganh, n.maKhoa,
                    SUM(GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0)) AS tongNo,
                    SUM(CASE WHEN GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0) > 0 THEN 1 ELSE 0 END) AS soHoaDonNo
             FROM HOADONHOCPHI hd
             INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
             INNER JOIN LOP l ON l.maLop = sv.maLop
             INNER JOIN NGANH n ON n.maNganh = l.maNganh
             LEFT JOIN (
                SELECT maHoaDon, COALESCE(SUM(soTienTT), 0) AS daNop
                FROM THANHTOAN
                GROUP BY maHoaDon
             ) tt ON tt.maHoaDon = hd.maHoaDon
             GROUP BY n.maNganh, n.tenNganh, n.maKhoa
             HAVING tongNo > 0
             ORDER BY tongNo DESC`
        );

        const [byLop] = await pool.execute(
            `SELECT l.maLop, l.tenLop, l.maNganh,
                    SUM(GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0)) AS tongNo,
                    SUM(CASE WHEN GREATEST(hd.soTienPhaiTra - COALESCE(tt.daNop, 0), 0) > 0 THEN 1 ELSE 0 END) AS soHoaDonNo
             FROM HOADONHOCPHI hd
             INNER JOIN SINHVIEN sv ON sv.maSV = hd.maSV
             INNER JOIN LOP l ON l.maLop = sv.maLop
             LEFT JOIN (
                SELECT maHoaDon, COALESCE(SUM(soTienTT), 0) AS daNop
                FROM THANHTOAN
                GROUP BY maHoaDon
             ) tt ON tt.maHoaDon = hd.maHoaDon
             GROUP BY l.maLop, l.tenLop, l.maNganh
             HAVING tongNo > 0
             ORDER BY tongNo DESC`
        );

        return {
            byKhoa,
            byNganh,
            byLop
        };
    }

    async getExistingInvoicesBySemester(maHocKy) {
        const [rows] = await pool.execute(
            'SELECT maSV FROM HOADONHOCPHI WHERE maHocKy = ?', [maHocKy]
        );
        return rows;
    }

    async createInvoices(invoices) {
        let inserted = 0;

        for (const invoice of invoices) {
            const [result] = await pool.execute(
                `INSERT INTO HOADONHOCPHI
          (maHoaDon, maSV, maHocKy, tongTien, soTienMienGiam, soTienPhaiTra, ngayTaoHD, hanThanhToan, trangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    invoice.maHoaDon,
                    invoice.maSV,
                    invoice.maHocKy,
                    invoice.tongTien,
                    invoice.soTienMienGiam,
                    invoice.soTienPhaiTra,
                    invoice.ngayTaoHD,
                    invoice.hanThanhToan,
                    invoice.trangThai
                ]
            );
            inserted += result.affectedRows || 0;
        }

        return inserted;
    }
}

export default new StaffDAO();