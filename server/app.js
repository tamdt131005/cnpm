import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/config/db.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const frontendStaticPath = path.resolve(__dirname, '../fontend');

// ===== MIDDLEWARE GLOBAL =====
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use('/fontend', express.static(frontendStaticPath)); // Serve frontend static pages

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

// ===== ERROR HANDLER =====
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Đã xảy ra lỗi máy chủ'
    });
});

// ===== KHỞI ĐỘNG SERVER =====
const startServer = async() => {
    await testConnection(); // Test kết nối DB trước khi chạy
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    });
};

startServer();