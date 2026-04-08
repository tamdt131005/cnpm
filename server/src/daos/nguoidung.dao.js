import { pool } from '../config/db.js';

class NguoiDungDAO {
    async ensureLockTable() {
        await pool.execute(
            `CREATE TABLE IF NOT EXISTS TAIKHOAN_KHOA (
                maNguoiDung VARCHAR(50) PRIMARY KEY,
                biKhoa TINYINT(1) NOT NULL DEFAULT 0,
                lyDo VARCHAR(255) NULL,
                ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_taikhoankhoa_nguoidung
                    FOREIGN KEY (maNguoiDung) REFERENCES NGUOIDUNG(maNguoiDung)
                    ON DELETE CASCADE
            )`
        );
    }

    // Tìm người dùng theo tên đăng nhập (dùng cho login)
    async findByUsername(tenDangNhap) {
        await this.ensureLockTable();

        const [rows] = await pool.execute(
            `SELECT nd.maNguoiDung, nd.tenDangNhap, nd.matKhau, nd.hoTen, nd.email, nd.soDienThoai, nd.vaiTro, nd.ngayTao,
                    COALESCE(tk.biKhoa, 0) AS biKhoa,
                    tk.lyDo AS lyDoKhoa
             FROM NGUOIDUNG nd
             LEFT JOIN TAIKHOAN_KHOA tk ON tk.maNguoiDung = nd.maNguoiDung
             WHERE nd.tenDangNhap = ? OR nd.email = ?`,
            [tenDangNhap, tenDangNhap]
        );
        return rows[0] || null;
    }

    async findById(maNguoiDung) {
        await this.ensureLockTable();

        const [rows] = await pool.execute(
            `SELECT nd.maNguoiDung, nd.tenDangNhap, nd.hoTen, nd.email, nd.soDienThoai, nd.vaiTro, nd.ngayTao,
                    COALESCE(tk.biKhoa, 0) AS biKhoa,
                    tk.lyDo AS lyDoKhoa
             FROM NGUOIDUNG nd
             LEFT JOIN TAIKHOAN_KHOA tk ON tk.maNguoiDung = nd.maNguoiDung
             WHERE nd.maNguoiDung = ?`,
            [maNguoiDung]
        );
        return rows[0] || null;
    }

    async findByIdWithPassword(maNguoiDung) {
        await this.ensureLockTable();

        const [rows] = await pool.execute(
            `SELECT nd.maNguoiDung, nd.tenDangNhap, nd.matKhau, nd.hoTen, nd.email, nd.soDienThoai, nd.vaiTro, nd.ngayTao,
                    COALESCE(tk.biKhoa, 0) AS biKhoa,
                    tk.lyDo AS lyDoKhoa
             FROM NGUOIDUNG nd
             LEFT JOIN TAIKHOAN_KHOA tk ON tk.maNguoiDung = nd.maNguoiDung
             WHERE nd.maNguoiDung = ?`,
            [maNguoiDung]
        );
        return rows[0] || null;
    }

    async findAll() {
        await this.ensureLockTable();

        const [rows] = await pool.execute(
            `SELECT nd.maNguoiDung, nd.tenDangNhap, nd.hoTen, nd.email, nd.soDienThoai, nd.vaiTro, nd.ngayTao,
                    COALESCE(tk.biKhoa, 0) AS biKhoa,
                    tk.lyDo AS lyDoKhoa
             FROM NGUOIDUNG nd
             LEFT JOIN TAIKHOAN_KHOA tk ON tk.maNguoiDung = nd.maNguoiDung
             ORDER BY nd.ngayTao DESC`
        );
        return rows;
    }

    async findAllPasswordEntries() {
        const [rows] = await pool.execute(
            'SELECT maNguoiDung, matKhau FROM NGUOIDUNG'
        );
        return rows;
    }

    async create(data) {
        const { maNguoiDung, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro } = data;
        const [result] = await pool.execute(
            'INSERT INTO NGUOIDUNG (maNguoiDung, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [maNguoiDung, tenDangNhap, matKhau, hoTen || null, email || null, soDienThoai || null, vaiTro || 'SinhVien']
        );

        await this.setAccountLockStatus(maNguoiDung, 0, null);
        return result;
    }

    async update(maNguoiDung, data) {
        const allowedFields = new Set(['tenDangNhap', 'hoTen', 'email', 'soDienThoai', 'vaiTro']);
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            if (!allowedFields.has(key)) {
                continue;
            }
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (!fields.length) {
            return { affectedRows: 0 };
        }

        values.push(maNguoiDung);
        const [result] = await pool.execute(
            `UPDATE NGUOIDUNG SET ${fields.join(', ')} WHERE maNguoiDung = ?`,
            values
        );
        return result;
    }

    async updatePassword(maNguoiDung, hashedPassword) {
        const [result] = await pool.execute(
            'UPDATE NGUOIDUNG SET matKhau = ? WHERE maNguoiDung = ?', [hashedPassword, maNguoiDung]
        );
        return result;
    }

    async getAccountLockStatus(maNguoiDung) {
        await this.ensureLockTable();

        const [rows] = await pool.execute(
            'SELECT maNguoiDung, biKhoa, lyDo, ngayCapNhat FROM TAIKHOAN_KHOA WHERE maNguoiDung = ? LIMIT 1',
            [maNguoiDung]
        );
        return rows[0] || null;
    }

    async setAccountLockStatus(maNguoiDung, biKhoa, lyDo) {
        await this.ensureLockTable();

        const [result] = await pool.execute(
            `INSERT INTO TAIKHOAN_KHOA (maNguoiDung, biKhoa, lyDo)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE biKhoa = VALUES(biKhoa), lyDo = VALUES(lyDo)`,
            [maNguoiDung, Number(Boolean(biKhoa)), lyDo || null]
        );
        return result;
    }
}

export default new NguoiDungDAO();