import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Tạo connection pool để tái sử dụng kết nối, tối ưu hiệu năng
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'HocPhiSinhVien',
  waitForConnections: true,
  connectionLimit: 10,       // Số kết nối tối đa trong pool
  queueLimit: 0,             // Không giới hạn hàng đợi
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test kết nối khi khởi động
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối MySQL thành công!');
    connection.release();
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL:', error.message);
    process.exit(1);
  }
};

export { pool, testConnection };
