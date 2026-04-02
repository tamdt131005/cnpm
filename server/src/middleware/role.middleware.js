/**
 * Middleware phân quyền theo vai trò
 * @param  {...string} allowedRoles - Danh sách vai trò được phép truy cập
 * @returns middleware function
 *
 * Ví dụ sử dụng:
 *   router.get('/users', verifyToken, authorize('Admin'), controller.getAll)
 *   router.get('/hoadon', verifyToken, authorize('Admin', 'KeToan'), controller.getAll)
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user đã được gán bởi auth.middleware (verifyToken)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực. Vui lòng đăng nhập.'
      });
    }

    // Kiểm tra vai trò của user có nằm trong danh sách cho phép không
    if (!allowedRoles.includes(req.user.vaiTro)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập. Yêu cầu vai trò: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};
