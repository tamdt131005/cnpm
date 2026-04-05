import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './src/config/db.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE GLOBAL =====
app.use(helmet());                          // Bảo mật HTTP headers
app.use(cors());                            // Cho phép cross-origin requests
app.use(express.json());                    // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// ===== ROUTES =====
app.use('/api/', routes);

// Route kiểm tra server hoạt động
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hệ thống Quản lý Học phí Sinh viên - API Server',
    version: '1.0.0'
  });
});

// ===== KHỞI ĐỘNG SERVER =====
const startServer = async () => {
  await testConnection(); // Test kết nối DB trước khi chạy
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/v1`);
  });
};

startServer();
