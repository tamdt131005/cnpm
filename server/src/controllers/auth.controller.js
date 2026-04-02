import authService from '../services/auth.service.js';

class AuthController {
  // POST /api/v1/auth/login
  async login(req, res, next) {
    try {
      const { tenDangNhap, matKhau } = req.body;
      const result = await authService.login(tenDangNhap, matKhau);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/auth/change-password
  async changePassword(req, res, next) {
    try {
      const { matKhauCu, matKhauMoi } = req.body;
      const result = await authService.changePassword(req.user.maNguoiDung, matKhauCu, matKhauMoi);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/auth/me
  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.maNguoiDung);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
