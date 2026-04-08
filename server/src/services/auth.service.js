import bcrypt from 'bcryptjs';
import nguoiDungDAO from '../daos/nguoidung.dao.js';

class AuthService {
    async login(tenDangNhap, matKhau) {
        const user = await nguoiDungDAO.findByUsername(tenDangNhap);
        if (!user) {
            const error = new Error('Tên đăng nhập không tồn tại');
            error.statusCode = 401;
            throw error;
        }

        if (Number(user.biKhoa || 0) === 1) {
            const error = new Error(user.lyDoKhoa || 'Tài khoản đang bị khóa');
            error.statusCode = 403;
            throw error;
        }

        const storedPassword = user.matKhau || '';
        const isHashedPassword = storedPassword.startsWith('$2');
        const isValidPassword = isHashedPassword ?
            await bcrypt.compare(matKhau, storedPassword) :
            matKhau === storedPassword;

        if (!isValidPassword) {
            const error = new Error('Mật khẩu không chính xác');
            error.statusCode = 401;
            throw error;
        }

        // Nâng cấp mật khẩu cũ dạng plaintext lên bcrypt sau lần đăng nhập thành công.
        if (!isHashedPassword) {
            const hashed = await bcrypt.hash(matKhau, 10);
            await nguoiDungDAO.updatePassword(user.maNguoiDung, hashed);
        }

        return {
            maNguoiDung: user.maNguoiDung,
            tenDangNhap: user.tenDangNhap,
            hoTen: user.hoTen,
            vaiTro: user.vaiTro
        };
    }

    async getMe(maNguoiDung) {
        const user = await nguoiDungDAO.findById(maNguoiDung);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

export default new AuthService();