import adminDAO from '../daos/admin.dao.js';

const CATALOG_RESOURCES = new Set(['khoa', 'nganh', 'lop', 'monhoc', 'sinhvien', 'namhoc', 'hocky']);

function toSafeText(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function toNullableText(value) {
    const text = toSafeText(value);
    return text || null;
}

function toNullableNumber(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

class AdminService {
    async ensureAdmin(maNguoiDung) {
        const user = await adminDAO.findUserById(maNguoiDung);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        if (user.vaiTro !== 'Admin') {
            const error = new Error('Bạn không có quyền truy cập chức năng quản trị');
            error.statusCode = 403;
            throw error;
        }

        return user;
    }

    ensureResource(resource) {
        if (!CATALOG_RESOURCES.has(resource)) {
            const error = new Error('Loại danh mục không hợp lệ');
            error.statusCode = 400;
            throw error;
        }
    }

    handleDeleteConstraint(error, entityName) {
        if (error && (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451)) {
            const wrapped = new Error(`Không thể xóa ${entityName} vì đang có dữ liệu liên quan`);
            wrapped.statusCode = 400;
            throw wrapped;
        }

        throw error;
    }

    async getOverview(maNguoiDung) {
        await this.ensureAdmin(maNguoiDung);
        return adminDAO.getOverviewStats();
    }

    async listCatalog(maNguoiDung, resource) {
        await this.ensureAdmin(maNguoiDung);
        this.ensureResource(resource);

        switch (resource) {
            case 'khoa':
                return adminDAO.getKhoa();
            case 'nganh':
                return adminDAO.getNganh();
            case 'lop':
                return adminDAO.getLop();
            case 'monhoc':
                return adminDAO.getMonHoc();
            case 'sinhvien':
                return adminDAO.getSinhVien();
            case 'namhoc':
                return adminDAO.getNamHoc();
            case 'hocky':
                return adminDAO.getHocKy();
            default:
                return [];
        }
    }

    async createCatalog(maNguoiDung, resource, payload) {
        await this.ensureAdmin(maNguoiDung);
        this.ensureResource(resource);

        if (resource === 'khoa') {
            const data = {
                maKhoa: toSafeText(payload.maKhoa),
                tenKhoa: toSafeText(payload.tenKhoa),
                truongKhoa: toNullableText(payload.truongKhoa)
            };

            if (!data.maKhoa || !data.tenKhoa) {
                throw this.buildValidationError('Mã khoa và tên khoa là bắt buộc');
            }

            const existed = await adminDAO.findKhoaById(data.maKhoa);
            if (existed) {
                throw this.buildValidationError('Mã khoa đã tồn tại');
            }

            await adminDAO.createKhoa(data);
            return adminDAO.findKhoaById(data.maKhoa);
        }

        if (resource === 'nganh') {
            const data = {
                maNganh: toSafeText(payload.maNganh),
                tenNganh: toSafeText(payload.tenNganh),
                maKhoa: toSafeText(payload.maKhoa)
            };

            if (!data.maNganh || !data.tenNganh || !data.maKhoa) {
                throw this.buildValidationError('Mã ngành, tên ngành và mã khoa là bắt buộc');
            }

            const khoa = await adminDAO.findKhoaById(data.maKhoa);
            if (!khoa) {
                throw this.buildValidationError('Mã khoa không tồn tại');
            }

            const existed = await adminDAO.findNganhById(data.maNganh);
            if (existed) {
                throw this.buildValidationError('Mã ngành đã tồn tại');
            }

            await adminDAO.createNganh(data);
            return adminDAO.findNganhById(data.maNganh);
        }

        if (resource === 'lop') {
            const data = {
                maLop: toSafeText(payload.maLop),
                tenLop: toSafeText(payload.tenLop),
                nienKhoa: toNullableNumber(payload.nienKhoa),
                maNganh: toSafeText(payload.maNganh)
            };

            if (!data.maLop || !data.tenLop || !data.maNganh) {
                throw this.buildValidationError('Mã lớp, tên lớp và mã ngành là bắt buộc');
            }

            const nganh = await adminDAO.findNganhById(data.maNganh);
            if (!nganh) {
                throw this.buildValidationError('Mã ngành không tồn tại');
            }

            const existed = await adminDAO.findLopById(data.maLop);
            if (existed) {
                throw this.buildValidationError('Mã lớp đã tồn tại');
            }

            await adminDAO.createLop(data);
            return adminDAO.findLopById(data.maLop);
        }

        if (resource === 'monhoc') {
            const data = {
                maMH: toSafeText(payload.maMH),
                tenMH: toSafeText(payload.tenMH),
                soTinChi: toNullableNumber(payload.soTinChi),
                maKhoa: toSafeText(payload.maKhoa)
            };

            if (!data.maMH || !data.tenMH || !data.maKhoa || !data.soTinChi) {
                throw this.buildValidationError('Mã môn, tên môn, số tín chỉ và mã khoa là bắt buộc');
            }

            if (data.soTinChi <= 0) {
                throw this.buildValidationError('Số tín chỉ phải lớn hơn 0');
            }

            const khoa = await adminDAO.findKhoaById(data.maKhoa);
            if (!khoa) {
                throw this.buildValidationError('Mã khoa không tồn tại');
            }

            const existed = await adminDAO.findMonHocById(data.maMH);
            if (existed) {
                throw this.buildValidationError('Mã môn học đã tồn tại');
            }

            await adminDAO.createMonHoc(data);
            return adminDAO.findMonHocById(data.maMH);
        }

        if (resource === 'sinhvien') {
            const data = {
                maSV: toSafeText(payload.maSV),
                hoTen: toSafeText(payload.hoTen),
                ngaySinh: payload.ngaySinh || null,
                gioiTinh: payload.gioiTinh === undefined || payload.gioiTinh === null || payload.gioiTinh === '' ? null : Number(payload.gioiTinh),
                diaChi: toNullableText(payload.diaChi),
                email: toNullableText(payload.email),
                soDienThoai: toNullableText(payload.soDienThoai),
                maLop: toSafeText(payload.maLop),
                trangThai: toSafeText(payload.trangThai) || 'DangHoc'
            };

            if (!data.maSV || !data.hoTen || !data.maLop) {
                throw this.buildValidationError('Mã sinh viên, họ tên và mã lớp là bắt buộc');
            }

            const lop = await adminDAO.findLopById(data.maLop);
            if (!lop) {
                throw this.buildValidationError('Mã lớp không tồn tại');
            }

            const existed = await adminDAO.findSinhVienById(data.maSV);
            if (existed) {
                throw this.buildValidationError('Mã sinh viên đã tồn tại');
            }

            await adminDAO.createSinhVien(data);
            return adminDAO.findSinhVienById(data.maSV);
        }

        if (resource === 'namhoc') {
            const data = {
                maNamHoc: toSafeText(payload.maNamHoc),
                tenNamHoc: toSafeText(payload.tenNamHoc),
                namBatDau: toNullableNumber(payload.namBatDau),
                namKetThuc: toNullableNumber(payload.namKetThuc)
            };

            if (!data.maNamHoc || !data.tenNamHoc || !data.namBatDau || !data.namKetThuc) {
                throw this.buildValidationError('Mã năm học, tên năm học, năm bắt đầu và năm kết thúc là bắt buộc');
            }

            const existed = await adminDAO.findNamHocById(data.maNamHoc);
            if (existed) {
                throw this.buildValidationError('Mã năm học đã tồn tại');
            }

            await adminDAO.createNamHoc(data);
            return adminDAO.findNamHocById(data.maNamHoc);
        }

        const data = {
            maHocKy: toSafeText(payload.maHocKy),
            tenHocKy: toSafeText(payload.tenHocKy),
            hocKySo: toNullableNumber(payload.hocKySo),
            ngayBatDau: payload.ngayBatDau || null,
            ngayKetThuc: payload.ngayKetThuc || null,
            maNamHoc: toSafeText(payload.maNamHoc)
        };

        if (!data.maHocKy || !data.tenHocKy || !data.hocKySo || !data.maNamHoc) {
            throw this.buildValidationError('Mã học kỳ, tên học kỳ, số học kỳ và mã năm học là bắt buộc');
        }

        const namHoc = await adminDAO.findNamHocById(data.maNamHoc);
        if (!namHoc) {
            throw this.buildValidationError('Mã năm học không tồn tại');
        }

        const existed = await adminDAO.findHocKyById(data.maHocKy);
        if (existed) {
            throw this.buildValidationError('Mã học kỳ đã tồn tại');
        }

        await adminDAO.createHocKy(data);
        return adminDAO.findHocKyById(data.maHocKy);
    }

    async updateCatalog(maNguoiDung, resource, id, payload) {
        await this.ensureAdmin(maNguoiDung);
        this.ensureResource(resource);

        if (resource === 'khoa') {
            const existed = await adminDAO.findKhoaById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy khoa');
            }

            const data = {
                tenKhoa: toSafeText(payload.tenKhoa) || existed.tenKhoa,
                truongKhoa: payload.truongKhoa === undefined ? existed.truongKhoa : toNullableText(payload.truongKhoa)
            };

            await adminDAO.updateKhoa(id, data);
            return adminDAO.findKhoaById(id);
        }

        if (resource === 'nganh') {
            const existed = await adminDAO.findNganhById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy ngành');
            }

            const maKhoa = toSafeText(payload.maKhoa) || existed.maKhoa;
            const khoa = await adminDAO.findKhoaById(maKhoa);
            if (!khoa) {
                throw this.buildValidationError('Mã khoa không tồn tại');
            }

            const data = {
                tenNganh: toSafeText(payload.tenNganh) || existed.tenNganh,
                maKhoa
            };

            await adminDAO.updateNganh(id, data);
            return adminDAO.findNganhById(id);
        }

        if (resource === 'lop') {
            const existed = await adminDAO.findLopById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy lớp');
            }

            const maNganh = toSafeText(payload.maNganh) || existed.maNganh;
            const nganh = await adminDAO.findNganhById(maNganh);
            if (!nganh) {
                throw this.buildValidationError('Mã ngành không tồn tại');
            }

            const data = {
                tenLop: toSafeText(payload.tenLop) || existed.tenLop,
                nienKhoa: payload.nienKhoa === undefined ? existed.nienKhoa : toNullableNumber(payload.nienKhoa),
                maNganh
            };

            await adminDAO.updateLop(id, data);
            return adminDAO.findLopById(id);
        }

        if (resource === 'monhoc') {
            const existed = await adminDAO.findMonHocById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy môn học');
            }

            const maKhoa = toSafeText(payload.maKhoa) || existed.maKhoa;
            const khoa = await adminDAO.findKhoaById(maKhoa);
            if (!khoa) {
                throw this.buildValidationError('Mã khoa không tồn tại');
            }

            const soTinChi = payload.soTinChi === undefined ? Number(existed.soTinChi) : toNullableNumber(payload.soTinChi);
            if (!soTinChi || soTinChi <= 0) {
                throw this.buildValidationError('Số tín chỉ phải lớn hơn 0');
            }

            const data = {
                tenMH: toSafeText(payload.tenMH) || existed.tenMH,
                soTinChi,
                maKhoa
            };

            await adminDAO.updateMonHoc(id, data);
            return adminDAO.findMonHocById(id);
        }

        if (resource === 'sinhvien') {
            const existed = await adminDAO.findSinhVienById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy sinh viên');
            }

            const maLop = toSafeText(payload.maLop) || existed.maLop;
            const lop = await adminDAO.findLopById(maLop);
            if (!lop) {
                throw this.buildValidationError('Mã lớp không tồn tại');
            }

            const data = {
                hoTen: toSafeText(payload.hoTen) || existed.hoTen,
                ngaySinh: payload.ngaySinh === undefined ? existed.ngaySinh : (payload.ngaySinh || null),
                gioiTinh: payload.gioiTinh === undefined ? existed.gioiTinh : (payload.gioiTinh === '' ? null : Number(payload.gioiTinh)),
                diaChi: payload.diaChi === undefined ? existed.diaChi : toNullableText(payload.diaChi),
                email: payload.email === undefined ? existed.email : toNullableText(payload.email),
                soDienThoai: payload.soDienThoai === undefined ? existed.soDienThoai : toNullableText(payload.soDienThoai),
                maLop,
                trangThai: toSafeText(payload.trangThai) || existed.trangThai
            };

            await adminDAO.updateSinhVien(id, data);
            return adminDAO.findSinhVienById(id);
        }

        if (resource === 'namhoc') {
            const existed = await adminDAO.findNamHocById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy năm học');
            }

            const data = {
                tenNamHoc: toSafeText(payload.tenNamHoc) || existed.tenNamHoc,
                namBatDau: payload.namBatDau === undefined ? Number(existed.namBatDau) : toNullableNumber(payload.namBatDau),
                namKetThuc: payload.namKetThuc === undefined ? Number(existed.namKetThuc) : toNullableNumber(payload.namKetThuc)
            };

            await adminDAO.updateNamHoc(id, data);
            return adminDAO.findNamHocById(id);
        }

        const existed = await adminDAO.findHocKyById(id);
        if (!existed) {
            throw this.buildNotFoundError('Không tìm thấy học kỳ');
        }

        const maNamHoc = toSafeText(payload.maNamHoc) || existed.maNamHoc;
        const namHoc = await adminDAO.findNamHocById(maNamHoc);
        if (!namHoc) {
            throw this.buildValidationError('Mã năm học không tồn tại');
        }

        const data = {
            tenHocKy: toSafeText(payload.tenHocKy) || existed.tenHocKy,
            hocKySo: payload.hocKySo === undefined ? Number(existed.hocKySo) : toNullableNumber(payload.hocKySo),
            ngayBatDau: payload.ngayBatDau === undefined ? existed.ngayBatDau : (payload.ngayBatDau || null),
            ngayKetThuc: payload.ngayKetThuc === undefined ? existed.ngayKetThuc : (payload.ngayKetThuc || null),
            maNamHoc
        };

        await adminDAO.updateHocKy(id, data);
        return adminDAO.findHocKyById(id);
    }

    async deleteCatalog(maNguoiDung, resource, id) {
        await this.ensureAdmin(maNguoiDung);
        this.ensureResource(resource);

        try {
            if (resource === 'khoa') {
                const existed = await adminDAO.findKhoaById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy khoa');
                }
                await adminDAO.deleteKhoa(id);
                return { deleted: true, id };
            }

            if (resource === 'nganh') {
                const existed = await adminDAO.findNganhById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy ngành');
                }
                await adminDAO.deleteNganh(id);
                return { deleted: true, id };
            }

            if (resource === 'lop') {
                const existed = await adminDAO.findLopById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy lớp');
                }
                await adminDAO.deleteLop(id);
                return { deleted: true, id };
            }

            if (resource === 'monhoc') {
                const existed = await adminDAO.findMonHocById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy môn học');
                }
                await adminDAO.deleteMonHoc(id);
                return { deleted: true, id };
            }

            if (resource === 'sinhvien') {
                const existed = await adminDAO.findSinhVienById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy sinh viên');
                }
                await adminDAO.deleteSinhVien(id);
                return { deleted: true, id };
            }

            if (resource === 'namhoc') {
                const existed = await adminDAO.findNamHocById(id);
                if (!existed) {
                    throw this.buildNotFoundError('Không tìm thấy năm học');
                }
                await adminDAO.deleteNamHoc(id);
                return { deleted: true, id };
            }

            const existed = await adminDAO.findHocKyById(id);
            if (!existed) {
                throw this.buildNotFoundError('Không tìm thấy học kỳ');
            }
            await adminDAO.deleteHocKy(id);
            return { deleted: true, id };
        } catch (error) {
            this.handleDeleteConstraint(error, resource);
        }
    }

    buildValidationError(message) {
        const error = new Error(message);
        error.statusCode = 400;
        return error;
    }

    buildNotFoundError(message) {
        const error = new Error(message);
        error.statusCode = 404;
        return error;
    }
}

export default new AdminService();
