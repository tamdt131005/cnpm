import { pool } from '../config/db.js';

class AdminDAO {
    async findUserById(maNguoiDung) {
        const [rows] = await pool.execute(
            'SELECT maNguoiDung, tenDangNhap, vaiTro FROM NGUOIDUNG WHERE maNguoiDung = ? LIMIT 1',
            [maNguoiDung]
        );
        return rows[0] || null;
    }

    async getOverviewStats() {
        const [rows] = await pool.execute(
            `SELECT
                (SELECT COUNT(*) FROM NGUOIDUNG) AS tongNguoiDung,
                (SELECT COUNT(*) FROM NGUOIDUNG WHERE vaiTro = 'Admin') AS tongAdmin,
                (SELECT COUNT(*) FROM NGUOIDUNG WHERE vaiTro = 'KeToan') AS tongKeToan,
                (SELECT COUNT(*) FROM NGUOIDUNG WHERE vaiTro = 'SinhVien') AS tongTaiKhoanSinhVien,
                (SELECT COUNT(*) FROM SINHVIEN) AS tongSinhVien,
                (SELECT COUNT(*) FROM KHOA) AS tongKhoa,
                (SELECT COUNT(*) FROM NGANH) AS tongNganh,
                (SELECT COUNT(*) FROM LOP) AS tongLop,
                (SELECT COUNT(*) FROM MONHOC) AS tongMonHoc,
                (SELECT COUNT(*) FROM NAMHOC) AS tongNamHoc,
                (SELECT COUNT(*) FROM HOCKY) AS tongHocKy`
        );
        return rows[0] || {};
    }

    async getKhoa() {
        const [rows] = await pool.execute(
            'SELECT maKhoa, tenKhoa, truongKhoa FROM KHOA ORDER BY maKhoa ASC'
        );
        return rows;
    }

    async findKhoaById(maKhoa) {
        const [rows] = await pool.execute(
            'SELECT maKhoa, tenKhoa, truongKhoa FROM KHOA WHERE maKhoa = ? LIMIT 1',
            [maKhoa]
        );
        return rows[0] || null;
    }

    async createKhoa(data) {
        const [result] = await pool.execute(
            'INSERT INTO KHOA (maKhoa, tenKhoa, truongKhoa) VALUES (?, ?, ?)',
            [data.maKhoa, data.tenKhoa, data.truongKhoa]
        );
        return result;
    }

    async updateKhoa(maKhoa, data) {
        const [result] = await pool.execute(
            'UPDATE KHOA SET tenKhoa = ?, truongKhoa = ? WHERE maKhoa = ?',
            [data.tenKhoa, data.truongKhoa, maKhoa]
        );
        return result;
    }

    async deleteKhoa(maKhoa) {
        const [result] = await pool.execute(
            'DELETE FROM KHOA WHERE maKhoa = ?',
            [maKhoa]
        );
        return result;
    }

    async getNganh() {
        const [rows] = await pool.execute(
            `SELECT n.maNganh, n.tenNganh, n.maKhoa, k.tenKhoa
             FROM NGANH n
             LEFT JOIN KHOA k ON k.maKhoa = n.maKhoa
             ORDER BY n.maNganh ASC`
        );
        return rows;
    }

    async findNganhById(maNganh) {
        const [rows] = await pool.execute(
            'SELECT maNganh, tenNganh, maKhoa FROM NGANH WHERE maNganh = ? LIMIT 1',
            [maNganh]
        );
        return rows[0] || null;
    }

    async createNganh(data) {
        const [result] = await pool.execute(
            'INSERT INTO NGANH (maNganh, tenNganh, maKhoa) VALUES (?, ?, ?)',
            [data.maNganh, data.tenNganh, data.maKhoa]
        );
        return result;
    }

    async updateNganh(maNganh, data) {
        const [result] = await pool.execute(
            'UPDATE NGANH SET tenNganh = ?, maKhoa = ? WHERE maNganh = ?',
            [data.tenNganh, data.maKhoa, maNganh]
        );
        return result;
    }

    async deleteNganh(maNganh) {
        const [result] = await pool.execute(
            'DELETE FROM NGANH WHERE maNganh = ?',
            [maNganh]
        );
        return result;
    }

    async getLop() {
        const [rows] = await pool.execute(
            `SELECT l.maLop, l.tenLop, l.nienKhoa, l.maNganh, n.tenNganh, n.maKhoa, k.tenKhoa
             FROM LOP l
             LEFT JOIN NGANH n ON n.maNganh = l.maNganh
             LEFT JOIN KHOA k ON k.maKhoa = n.maKhoa
             ORDER BY l.maLop ASC`
        );
        return rows;
    }

    async findLopById(maLop) {
        const [rows] = await pool.execute(
            'SELECT maLop, tenLop, nienKhoa, maNganh FROM LOP WHERE maLop = ? LIMIT 1',
            [maLop]
        );
        return rows[0] || null;
    }

    async createLop(data) {
        const [result] = await pool.execute(
            'INSERT INTO LOP (maLop, tenLop, nienKhoa, maNganh) VALUES (?, ?, ?, ?)',
            [data.maLop, data.tenLop, data.nienKhoa, data.maNganh]
        );
        return result;
    }

    async updateLop(maLop, data) {
        const [result] = await pool.execute(
            'UPDATE LOP SET tenLop = ?, nienKhoa = ?, maNganh = ? WHERE maLop = ?',
            [data.tenLop, data.nienKhoa, data.maNganh, maLop]
        );
        return result;
    }

    async deleteLop(maLop) {
        const [result] = await pool.execute(
            'DELETE FROM LOP WHERE maLop = ?',
            [maLop]
        );
        return result;
    }

    async getMonHoc() {
        const [rows] = await pool.execute(
            `SELECT mh.maMH, mh.tenMH, mh.soTinChi, mh.maKhoa, k.tenKhoa
             FROM MONHOC mh
             LEFT JOIN KHOA k ON k.maKhoa = mh.maKhoa
             ORDER BY mh.maMH ASC`
        );
        return rows;
    }

    async findMonHocById(maMH) {
        const [rows] = await pool.execute(
            'SELECT maMH, tenMH, soTinChi, maKhoa FROM MONHOC WHERE maMH = ? LIMIT 1',
            [maMH]
        );
        return rows[0] || null;
    }

    async createMonHoc(data) {
        const [result] = await pool.execute(
            'INSERT INTO MONHOC (maMH, tenMH, soTinChi, maKhoa) VALUES (?, ?, ?, ?)',
            [data.maMH, data.tenMH, data.soTinChi, data.maKhoa]
        );
        return result;
    }

    async updateMonHoc(maMH, data) {
        const [result] = await pool.execute(
            'UPDATE MONHOC SET tenMH = ?, soTinChi = ?, maKhoa = ? WHERE maMH = ?',
            [data.tenMH, data.soTinChi, data.maKhoa, maMH]
        );
        return result;
    }

    async deleteMonHoc(maMH) {
        const [result] = await pool.execute(
            'DELETE FROM MONHOC WHERE maMH = ?',
            [maMH]
        );
        return result;
    }

    async getSinhVien() {
        const [rows] = await pool.execute(
            `SELECT sv.maSV, sv.hoTen, sv.ngaySinh, sv.gioiTinh, sv.diaChi, sv.email, sv.soDienThoai,
                    sv.maLop, sv.trangThai, l.tenLop, n.maNganh, n.tenNganh, k.maKhoa, k.tenKhoa
             FROM SINHVIEN sv
             LEFT JOIN LOP l ON l.maLop = sv.maLop
             LEFT JOIN NGANH n ON n.maNganh = l.maNganh
             LEFT JOIN KHOA k ON k.maKhoa = n.maKhoa
             ORDER BY sv.maSV ASC`
        );
        return rows;
    }

    async findSinhVienById(maSV) {
        const [rows] = await pool.execute(
            `SELECT maSV, hoTen, ngaySinh, gioiTinh, diaChi, email, soDienThoai, maLop, trangThai
             FROM SINHVIEN
             WHERE maSV = ?
             LIMIT 1`,
            [maSV]
        );
        return rows[0] || null;
    }

    async createSinhVien(data) {
        const [result] = await pool.execute(
            `INSERT INTO SINHVIEN (maSV, hoTen, ngaySinh, gioiTinh, diaChi, email, soDienThoai, maLop, trangThai)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.maSV,
                data.hoTen,
                data.ngaySinh,
                data.gioiTinh,
                data.diaChi,
                data.email,
                data.soDienThoai,
                data.maLop,
                data.trangThai
            ]
        );
        return result;
    }

    async updateSinhVien(maSV, data) {
        const [result] = await pool.execute(
            `UPDATE SINHVIEN
             SET hoTen = ?, ngaySinh = ?, gioiTinh = ?, diaChi = ?, email = ?, soDienThoai = ?, maLop = ?, trangThai = ?
             WHERE maSV = ?`,
            [
                data.hoTen,
                data.ngaySinh,
                data.gioiTinh,
                data.diaChi,
                data.email,
                data.soDienThoai,
                data.maLop,
                data.trangThai,
                maSV
            ]
        );
        return result;
    }

    async deleteSinhVien(maSV) {
        const [result] = await pool.execute(
            'DELETE FROM SINHVIEN WHERE maSV = ?',
            [maSV]
        );
        return result;
    }

    async getNamHoc() {
        const [rows] = await pool.execute(
            'SELECT maNamHoc, tenNamHoc, namBatDau, namKetThuc FROM NAMHOC ORDER BY namBatDau DESC'
        );
        return rows;
    }

    async findNamHocById(maNamHoc) {
        const [rows] = await pool.execute(
            'SELECT maNamHoc, tenNamHoc, namBatDau, namKetThuc FROM NAMHOC WHERE maNamHoc = ? LIMIT 1',
            [maNamHoc]
        );
        return rows[0] || null;
    }

    async createNamHoc(data) {
        const [result] = await pool.execute(
            'INSERT INTO NAMHOC (maNamHoc, tenNamHoc, namBatDau, namKetThuc) VALUES (?, ?, ?, ?)',
            [data.maNamHoc, data.tenNamHoc, data.namBatDau, data.namKetThuc]
        );
        return result;
    }

    async updateNamHoc(maNamHoc, data) {
        const [result] = await pool.execute(
            'UPDATE NAMHOC SET tenNamHoc = ?, namBatDau = ?, namKetThuc = ? WHERE maNamHoc = ?',
            [data.tenNamHoc, data.namBatDau, data.namKetThuc, maNamHoc]
        );
        return result;
    }

    async deleteNamHoc(maNamHoc) {
        const [result] = await pool.execute(
            'DELETE FROM NAMHOC WHERE maNamHoc = ?',
            [maNamHoc]
        );
        return result;
    }

    async getHocKy() {
        const [rows] = await pool.execute(
            `SELECT hk.maHocKy, hk.tenHocKy, hk.hocKySo, hk.ngayBatDau, hk.ngayKetThuc, hk.maNamHoc, nh.tenNamHoc
             FROM HOCKY hk
             LEFT JOIN NAMHOC nh ON nh.maNamHoc = hk.maNamHoc
             ORDER BY hk.maHocKy DESC`
        );
        return rows;
    }

    async findHocKyById(maHocKy) {
        const [rows] = await pool.execute(
            `SELECT maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc
             FROM HOCKY
             WHERE maHocKy = ?
             LIMIT 1`,
            [maHocKy]
        );
        return rows[0] || null;
    }

    async createHocKy(data) {
        const [result] = await pool.execute(
            `INSERT INTO HOCKY (maHocKy, tenHocKy, hocKySo, ngayBatDau, ngayKetThuc, maNamHoc)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [data.maHocKy, data.tenHocKy, data.hocKySo, data.ngayBatDau, data.ngayKetThuc, data.maNamHoc]
        );
        return result;
    }

    async updateHocKy(maHocKy, data) {
        const [result] = await pool.execute(
            `UPDATE HOCKY
             SET tenHocKy = ?, hocKySo = ?, ngayBatDau = ?, ngayKetThuc = ?, maNamHoc = ?
             WHERE maHocKy = ?`,
            [data.tenHocKy, data.hocKySo, data.ngayBatDau, data.ngayKetThuc, data.maNamHoc, maHocKy]
        );
        return result;
    }

    async deleteHocKy(maHocKy) {
        const [result] = await pool.execute(
            'DELETE FROM HOCKY WHERE maHocKy = ?',
            [maHocKy]
        );
        return result;
    }
}

export default new AdminDAO();
