/**
 * Middleware xử lý lỗi tập trung
 * - Bắt tất cả lỗi từ các tầng Controller/Service/DAO
 * - Format response lỗi thống nhất
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Lỗi validation từ Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Lỗi JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }

  // Lỗi MySQL - Duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Dữ liệu đã tồn tại trong hệ thống'
    });
  }

  // Lỗi MySQL - Foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu tham chiếu không tồn tại'
    });
  }

  // Lỗi MySQL - Cannot delete (có dữ liệu phụ thuộc)
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Không thể xóa vì có dữ liệu liên quan phụ thuộc'
    });
  }

  // Lỗi chung - mặc định 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ'
  });
};

/**
 * Middleware validate dữ liệu đầu vào bằng Joi schema
 * @param {Object} schema - Joi schema
 * @param {string} source - Nguồn dữ liệu: 'body', 'params', 'query'
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      // Trả về tất cả lỗi, không dừng ở lỗi đầu tiên
      stripUnknown: true       // Loại bỏ field không được định nghĩa trong schema
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    // Gán lại dữ liệu đã được validate và strip
    req[source] = value;
    next();
  };
};
