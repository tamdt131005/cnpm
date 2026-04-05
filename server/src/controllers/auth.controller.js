import authService from '../services/auth.service.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { tenDangNhap, matKhau } = req.body;
      const result = await authService.login(tenDangNhap, matKhau);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

}

export default new AuthController();
