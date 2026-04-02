import baoCaoDAO from '../daos/baocao.dao.js';

class BaoCaoService {
  async tongThu(query) {
    const { maHocKy, maNamHoc } = query;
    if (maHocKy) {
      return await baoCaoDAO.tongThuTheoHocKy(maHocKy);
    }
    if (maNamHoc) {
      return await baoCaoDAO.tongThuTheoNamHoc(maNamHoc);
    }
    const error = new Error('Vui lòng cung cấp maHocKy hoặc maNamHoc');
    error.statusCode = 400;
    throw error;
  }

  async dsSVChuaDong(query) {
    return await baoCaoDAO.dsSVChuaDong(query.maHocKy);
  }

  async thongKeTheoKhoa(query) {
    return await baoCaoDAO.thongKeTheoKhoa(query.maHocKy);
  }

  async traCuuCaNhan(maSV) {
    return await baoCaoDAO.traCuuCaNhan(maSV);
  }
}

export default new BaoCaoService();
