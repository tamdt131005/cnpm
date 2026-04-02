import thanhToanDAO from '../daos/thanhtoan.dao.js';
import hoaDonDAO from '../daos/hoadon.dao.js';

class ThanhToanService {
  async getAll(filters) {
    return await thanhToanDAO.findAll(filters);
  }

  async getById(maThanhToan) {
    const tt = await thanhToanDAO.findById(maThanhToan);
    if (!tt) {
      const error = new Error('Không tìm thấy thanh toán');
      error.statusCode = 404;
      throw error;
    }
    return tt;
  }

  async getByHoaDon(maHoaDon) {
    return await thanhToanDAO.findAll({ maHoaDon });
  }

  /**
   * Ghi nhận thanh toán
   * Luồng:
   * 1. Kiểm tra hóa đơn tồn tại
   * 2. Tính tổng đã thanh toán + thanh toán mới
   * 3. So sánh với soTienPhaiTra → cập nhật trạng thái hóa đơn
   * 4. Lưu thanh toán
   */
  async create(data, maNguoiDung) {
    const { maThanhToan, maHoaDon, soTienTT, phuongThucTT, ghiChu } = data;

    // 1. Kiểm tra hóa đơn
    const hoaDon = await hoaDonDAO.findById(maHoaDon);
    if (!hoaDon) {
      const error = new Error('Không tìm thấy hóa đơn');
      error.statusCode = 404;
      throw error;
    }

    if (hoaDon.trangThai === 'DaThanhToan') {
      const error = new Error('Hóa đơn đã được thanh toán đầy đủ');
      error.statusCode = 400;
      throw error;
    }

    // 2. Tính tổng đã trả
    const totalPaid = await thanhToanDAO.getTotalPaidByHoaDon(maHoaDon);
    const totalAfterPayment = totalPaid + soTienTT;

    // 3. Kiểm tra không thanh toán quá số tiền phải trả
    if (totalAfterPayment > parseFloat(hoaDon.soTienPhaiTra)) {
      const error = new Error(
        `Số tiền thanh toán vượt quá. Còn lại: ${parseFloat(hoaDon.soTienPhaiTra) - totalPaid} VNĐ`
      );
      error.statusCode = 400;
      throw error;
    }

    // 4. Lưu thanh toán
    await thanhToanDAO.create({
      maThanhToan,
      maHoaDon,
      maNguoiDung,
      soTienTT,
      phuongThucTT,
      ghiChu
    });

    // 5. Cập nhật trạng thái hóa đơn
    if (totalAfterPayment >= parseFloat(hoaDon.soTienPhaiTra)) {
      await hoaDonDAO.updateStatus(maHoaDon, 'DaThanhToan');
    } else {
      await hoaDonDAO.updateStatus(maHoaDon, 'ThanhToanMotPhan');
    }

    return await thanhToanDAO.findById(maThanhToan);
  }
}

export default new ThanhToanService();
