import hoaDonDAO from '../daos/hoadon.dao.js';
import dangKyHocDAO from '../daos/dangkyhoc.dao.js';
import mucHocPhiDAO from '../daos/muchocphi.dao.js';

class HoaDonService {
  async getAll(filters) {
    return await hoaDonDAO.findAll(filters);
  }

  async getById(maHoaDon) {
    const hd = await hoaDonDAO.findById(maHoaDon);
    if (!hd) {
      const error = new Error('Không tìm thấy hóa đơn');
      error.statusCode = 404;
      throw error;
    }
    return hd;
  }

  /**
   * Tạo hóa đơn tự động dựa trên đăng ký học
   * Luồng:
   * 1. Lấy DS đăng ký học thành công của SV trong học kỳ
   * 2. Với mỗi môn → tìm mức học phí → tính: soTinChi × giaPerTinChi
   * 3. Tổng hợp thành hóa đơn
   */
  async generateHoaDon(data) {
    const { maHoaDon, maSV, maHocKy, hanThanhToan } = data;

    // 1. Lấy DS đăng ký học đã thành công
    const dangKyList = await dangKyHocDAO.findBySVAndHocKy(maSV, maHocKy);
    if (dangKyList.length === 0) {
      const error = new Error('Sinh viên chưa đăng ký môn nào trong học kỳ này');
      error.statusCode = 400;
      throw error;
    }

    // 2. Tính tổng tiền
    let tongTien = 0;
    const chiTiet = [];

    for (const dk of dangKyList) {
      const mucHP = await mucHocPhiDAO.findByMonHocAndHocKy(dk.maMH, maHocKy);
      if (mucHP) {
        const thanhTien = dk.soTinChi * mucHP.giaPerTinChi;
        tongTien += thanhTien;
        chiTiet.push({
          maMH: dk.maMH,
          tenMH: dk.tenMH,
          soTinChi: dk.soTinChi,
          giaPerTinChi: mucHP.giaPerTinChi,
          thanhTien
        });
      }
    }

    // 3. Tạo hóa đơn
    const hoaDonData = {
      maHoaDon,
      maSV,
      maHocKy,
      tongTien,
      soTienMienGiam: 0,
      soTienPhaiTra: tongTien,
      ngayTaoHD: new Date(),
      hanThanhToan: hanThanhToan || null
    };

    await hoaDonDAO.create(hoaDonData);
    const hoaDon = await hoaDonDAO.findById(maHoaDon);

    return { hoaDon, chiTiet };
  }

  /**
   * Cập nhật miễn giảm, tự động tính lại soTienPhaiTra
   */
  async updateMienGiam(maHoaDon, soTienMienGiam) {
    const hd = await hoaDonDAO.findById(maHoaDon);
    if (!hd) {
      const error = new Error('Không tìm thấy hóa đơn');
      error.statusCode = 404;
      throw error;
    }

    if (soTienMienGiam > hd.tongTien) {
      const error = new Error('Số tiền miễn giảm không được lớn hơn tổng tiền');
      error.statusCode = 400;
      throw error;
    }

    await hoaDonDAO.updateMienGiam(maHoaDon, soTienMienGiam);
    return await hoaDonDAO.findById(maHoaDon);
  }
}

export default new HoaDonService();
