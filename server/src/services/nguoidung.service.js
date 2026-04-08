import bcrypt from 'bcryptjs';
import nguoiDungDAO from '../daos/nguoidung.dao.js';

const USER_ROLES = new Set(['Admin', 'KeToan', 'SinhVien']);

class NguoiDungService {
    async ensureActor(maNguoiDungThucHien) {
        if (!maNguoiDungThucHien) {
            const error = new Error('Thiếu thông tin người dùng thực hiện');
            error.statusCode = 400;
            throw error;
        }

        const actor = await nguoiDungDAO.findById(maNguoiDungThucHien);
        if (!actor) {
            const error = new Error('Người dùng thực hiện không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        return actor;
    }

    async ensureAdminActor(maNguoiDungThucHien, vaiTroThucHien) {
        if (maNguoiDungThucHien) {
            const actor = await this.ensureActor(maNguoiDungThucHien);
            if (actor.vaiTro !== 'Admin') {
                const error = new Error('Bạn không có quyền quản lý tài khoản người dùng');
                error.statusCode = 403;
                throw error;
            }
            return actor;
        }

        if (vaiTroThucHien !== 'Admin') {
            const error = new Error('Bạn không có quyền xem danh sách người dùng');
            error.statusCode = 403;
            throw error;
        }

        return null;
    }

    async getAll(vaiTroThucHien, maNguoiDungThucHien, locVaiTro) {
        await this.ensureAdminActor(maNguoiDungThucHien, vaiTroThucHien);

        const users = await nguoiDungDAO.findAll();
        if (locVaiTro && USER_ROLES.has(locVaiTro)) {
            return users.filter((user) => user.vaiTro === locVaiTro);
        }

        return users;
    }

    async getById(maNguoiDung, maNguoiDungThucHien, vaiTroThucHien) {
        if (maNguoiDungThucHien) {
            const actor = await this.ensureActor(maNguoiDungThucHien);
            if (actor.vaiTro !== 'Admin' && actor.maNguoiDung !== maNguoiDung) {
                const error = new Error('Bạn không có quyền xem thông tin người dùng này');
                error.statusCode = 403;
                throw error;
            }
        } else if (vaiTroThucHien && vaiTroThucHien !== 'Admin') {
            const error = new Error('Bạn không có quyền xem thông tin người dùng này');
            error.statusCode = 403;
            throw error;
        }

        const user = await nguoiDungDAO.findById(maNguoiDung);
        if (!user) {
            const error = new Error('Không tìm thấy người dùng');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async create(data) {
        const { maNguoiDungThucHien, ...payload } = data;

        if (maNguoiDungThucHien) {
            await this.ensureAdminActor(maNguoiDungThucHien, 'Admin');
        }

        if (!payload.maNguoiDung || !payload.tenDangNhap || !payload.matKhau) {
            const error = new Error('Thiếu thông tin bắt buộc để tạo tài khoản');
            error.statusCode = 400;
            throw error;
        }

        const existed = await nguoiDungDAO.findById(payload.maNguoiDung);
        if (existed) {
            const error = new Error('Mã người dùng đã tồn tại');
            error.statusCode = 400;
            throw error;
        }

        payload.matKhau = await this.hashPassword(payload.matKhau);
        await nguoiDungDAO.create(payload);
        return await nguoiDungDAO.findById(payload.maNguoiDung);
    }

    async update(maNguoiDung, data) {
        const { maNguoiDungThucHien, ...payload } = data;

        if (maNguoiDungThucHien) {
            await this.ensureAdminActor(maNguoiDungThucHien, 'Admin');
        }

        const existing = await nguoiDungDAO.findById(maNguoiDung);
        if (!existing) {
            const error = new Error('Không tìm thấy người dùng');
            error.statusCode = 404;
            throw error;
        }

        const cleanData = { ...payload };
        delete cleanData.maNguoiDung;
        delete cleanData.matKhau;
        delete cleanData.biKhoa;
        delete cleanData.lyDoKhoa;

        if (!Object.keys(cleanData).length) {
            return existing;
        }

        await nguoiDungDAO.update(maNguoiDung, cleanData);
        return await nguoiDungDAO.findById(maNguoiDung);
    }

    async changePassword(maNguoiDung, payload) {
        const { maNguoiDungThucHien, matKhauMoi } = payload;

        if (!matKhauMoi || String(matKhauMoi).length < 6) {
            const error = new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
            error.statusCode = 400;
            throw error;
        }

        let actor = null;
        if (maNguoiDungThucHien) {
            actor = await this.ensureActor(maNguoiDungThucHien);
        }

        if (actor && actor.vaiTro !== 'Admin' && actor.maNguoiDung !== maNguoiDung) {
            const error = new Error('Bạn không có quyền đổi mật khẩu người dùng này');
            error.statusCode = 403;
            throw error;
        }

        const target = await nguoiDungDAO.findByIdWithPassword(maNguoiDung);
        if (!target) {
            const error = new Error('Không tìm thấy người dùng');
            error.statusCode = 404;
            throw error;
        }

        const hashedPassword = await this.hashPassword(matKhauMoi);
        await nguoiDungDAO.updatePassword(maNguoiDung, hashedPassword);

        return {
            maNguoiDung,
            doiMatKhauThanhCong: true
        };
    }

    async setLockStatus(maNguoiDung, payload) {
        const { maNguoiDungThucHien, biKhoa, lyDo } = payload;

        const actor = await this.ensureActor(maNguoiDungThucHien);
        if (actor.vaiTro !== 'Admin') {
            const error = new Error('Bạn không có quyền khóa hoặc mở khóa tài khoản');
            error.statusCode = 403;
            throw error;
        }

        if (actor.maNguoiDung === maNguoiDung && Number(Boolean(biKhoa)) === 1) {
            const error = new Error('Không thể tự khóa tài khoản quản trị hiện tại');
            error.statusCode = 400;
            throw error;
        }

        const target = await nguoiDungDAO.findById(maNguoiDung);
        if (!target) {
            const error = new Error('Không tìm thấy người dùng');
            error.statusCode = 404;
            throw error;
        }

        await nguoiDungDAO.setAccountLockStatus(maNguoiDung, biKhoa, lyDo || null);
        return nguoiDungDAO.findById(maNguoiDung);
    }

    async hashPassword(plainPassword) {
        return bcrypt.hash(plainPassword, 10);
    }

    async hashAllPlaintextPasswords() {
        const users = await nguoiDungDAO.findAllPasswordEntries();
        let hashedCount = 0;

        for (const user of users) {
            if (!user.matKhau || user.matKhau.startsWith('$2')) {
                continue;
            }

            const hashed = await this.hashPassword(user.matKhau);
            await nguoiDungDAO.updatePassword(user.maNguoiDung, hashed);
            hashedCount += 1;
        }

        return {
            total: users.length,
            hashed: hashedCount,
            skipped: users.length - hashedCount
        };
    }
}

export default new NguoiDungService();