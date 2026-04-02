/**
 * Script hash lại mật khẩu plaintext trong DB
 * Chạy: npm run hash-passwords
 */
import bcrypt from 'bcryptjs';
import { pool, testConnection } from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const hashPasswords = async () => {
  await testConnection();

  const [users] = await pool.execute('SELECT maNguoiDung, matKhau FROM NGUOIDUNG');
  let count = 0;

  for (const user of users) {
    // Bỏ qua nếu đã hash (bắt đầu bằng $2)
    if (user.matKhau.startsWith('$2')) {
      console.log(`⏭️ ${user.maNguoiDung} - Đã hash rồi`);
      continue;
    }

    const hashed = await bcrypt.hash(user.matKhau, 10);
    await pool.execute(
      'UPDATE NGUOIDUNG SET matKhau = ? WHERE maNguoiDung = ?',
      [hashed, user.maNguoiDung]
    );
    console.log(`✅ ${user.maNguoiDung} - Hash thành công`);
    count++;
  }

  console.log(`\n🎉 Đã hash ${count}/${users.length} mật khẩu`);
  process.exit(0);
};

hashPasswords().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
