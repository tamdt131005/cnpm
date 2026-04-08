import staffDAO from '../daos/staff.dao.js';

const STAFF_ROLES = new Set(['KeToan', 'Admin']);
const PAYMENT_METHODS = new Set(['TienMat', 'ChuyenKhoan', 'The', 'ViDienTu']);
const toNumber = (value) => Number(value || 0);

const buildInvoiceCode = (maHocKy, maSV) => {
    const cleanHocKy = String(maHocKy).replace(/[^a-zA-Z0-9]/g, '');
    return `HD_${cleanHocKy}_${maSV}`;
};

const buildPaymentCode = (maHoaDon) => {
    const invoicePart = String(maHoaDon || '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(-18);
    const timePart = Date.now().toString().slice(-9);
    const randomPart = Math.floor(Math.random() * 900 + 100).toString();
    return `TT_${invoicePart}_${timePart}${randomPart}`.slice(0, 50);
};

const toCsv = (rows) => {
    if (!rows.length) {
        return '\uFEFF';
    }

    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(',')];

    rows.forEach((row) => {
        const values = headers.map((header) => {
            const raw = row[header] === null || row[header] === undefined ? '' : String(row[header]);
            const escaped = raw.replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    });

    return `\uFEFF${csvRows.join('\n')}`;
};

const toHtmlTable = (title, rows) => {
    if (!rows.length) {
        return `
            <h2>${title}</h2>
            <p>Không có dữ liệu.</p>
        `;
    }

    const headers = Object.keys(rows[0]);
    const thead = headers.map((header) => `<th>${header}</th>`).join('');
    const tbody = rows
        .map((row) => {
            const cells = headers
                .map((header) => `<td>${row[header] === null || row[header] === undefined ? '' : row[header]}</td>`)
                .join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');

    return `
        <h2>${title}</h2>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse; width:100%; margin-bottom:16px;">
            <thead><tr>${thead}</tr></thead>
            <tbody>${tbody}</tbody>
        </table>
    `;
};

const resolveInvoiceStatus = (soTienPhaiTra, daNop, hanThanhToan) => {
    const conNo = Math.max(soTienPhaiTra - daNop, 0);
    if (conNo === 0) {
        return { conNo, trangThai: 'DaThanhToan' };
    }

    const dueDate = hanThanhToan ? new Date(hanThanhToan) : null;
    if (dueDate && !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < Date.now()) {
        return { conNo, trangThai: 'QuaHan' };
    }

    if (daNop > 0) {
        return { conNo, trangThai: 'ThanhToanMotPhan' };
    }

    return { conNo, trangThai: 'ChuaThanhToan' };
};

class StaffService {
    async ensureStaff(maNguoiDung) {
        const user = await staffDAO.findUserById(maNguoiDung);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        if (!STAFF_ROLES.has(user.vaiTro)) {
            const error = new Error('Bạn không có quyền truy cập chức năng tài vụ');
            error.statusCode = 403;
            throw error;
        }

        return user;
    }

    async createFeeRate(payload) {
        const { maNguoiDung, maMH, maHocKy, giaPerTinChi, loaiSinhVien } = payload;
        await this.ensureStaff(maNguoiDung);

        const existed = await staffDAO.findFeeRate(maMH, maHocKy, loaiSinhVien);
        if (existed) {
            const error = new Error('Định mức học phí cho môn và học kỳ này đã tồn tại');
            error.statusCode = 400;
            throw error;
        }

        const result = await staffDAO.createFeeRate({
            maMH,
            maHocKy,
            giaPerTinChi,
            loaiSinhVien
        });

        return staffDAO.findFeeRateById(result.insertId);
    }

    async getFeeRates(maNguoiDung) {
        await this.ensureStaff(maNguoiDung);
        const feeRates = await staffDAO.getFeeRates();
        return feeRates.map((feeRate) => ({
            ...feeRate,
            giaPerTinChi: toNumber(feeRate.giaPerTinChi)
        }));
    }

    async getDebts(maNguoiDung) {
        await this.ensureStaff(maNguoiDung);
        const debts = await staffDAO.getDebts();

        return debts.map((debt) => ({
            ...debt,
            soTienPhaiTra: toNumber(debt.soTienPhaiTra),
            daNop: toNumber(debt.daNop),
            conNo: toNumber(debt.conNo)
        }));
    }

    async getRegistrations(maNguoiDung, maHocKy, loaiSinhVien = 'ChinhQuy') {
        await this.ensureStaff(maNguoiDung);

        const registrations = await staffDAO.getRegistrations(maHocKy, loaiSinhVien);
        const normalized = registrations.map((item) => ({
            ...item,
            soTinChi: toNumber(item.soTinChi),
            giaPerTinChi: toNumber(item.giaPerTinChi),
            hocPhiDuKien: toNumber(item.hocPhiDuKien)
        }));

        return {
            loaiSinhVien,
            maHocKy: maHocKy || null,
            tongDangKy: normalized.length,
            tongHocPhiDuKien: normalized.reduce((sum, item) => sum + item.hocPhiDuKien, 0),
            danhSach: normalized
        };
    }

    async getInvoices(maNguoiDung, filters = {}) {
        await this.ensureStaff(maNguoiDung);

        const invoices = await staffDAO.getInvoices(filters);
        const normalized = invoices.map((invoice) => {
            const soTienPhaiTra = toNumber(invoice.soTienPhaiTra);
            const daNop = toNumber(invoice.daNop);
            const { conNo, trangThai } = resolveInvoiceStatus(soTienPhaiTra, daNop, invoice.hanThanhToan);

            return {
                ...invoice,
                tongTien: toNumber(invoice.tongTien),
                soTienMienGiam: toNumber(invoice.soTienMienGiam),
                soTienPhaiTra,
                daNop,
                conNo,
                trangThaiTinhToan: trangThai
            };
        });

        return {
            tongHoaDon: normalized.length,
            tongConNo: normalized.reduce((sum, item) => sum + item.conNo, 0),
            tongDaThu: normalized.reduce((sum, item) => sum + item.daNop, 0),
            danhSach: normalized
        };
    }

    async updateInvoiceDiscount(payload) {
        const { maNguoiDung, maHoaDon, soTienMienGiam } = payload;
        await this.ensureStaff(maNguoiDung);

        const invoice = await staffDAO.findInvoiceSummary(maHoaDon);
        if (!invoice) {
            const error = new Error('Không tìm thấy hóa đơn cần cập nhật miễn giảm');
            error.statusCode = 404;
            throw error;
        }

        const tongTien = toNumber(invoice.tongTien);
        const daNop = toNumber(invoice.daNop);
        const discount = toNumber(soTienMienGiam);

        if (discount < 0 || discount > tongTien) {
            const error = new Error('Số tiền miễn giảm không hợp lệ');
            error.statusCode = 400;
            throw error;
        }

        const soTienPhaiTra = Math.max(tongTien - discount, 0);
        const { conNo, trangThai } = resolveInvoiceStatus(soTienPhaiTra, daNop, invoice.hanThanhToan);

        await staffDAO.updateInvoiceAmounts(maHoaDon, discount, soTienPhaiTra, trangThai);

        return {
            maHoaDon,
            tongTien,
            soTienMienGiam: discount,
            soTienPhaiTra,
            daNop,
            conNo,
            trangThai
        };
    }

    async recordPayment(payload) {
        const { maNguoiDung, maHoaDon, soTienTT, phuongThucTT, ghiChu } = payload;
        await this.ensureStaff(maNguoiDung);

        if (!PAYMENT_METHODS.has(phuongThucTT)) {
            const error = new Error('Phương thức thanh toán không hợp lệ');
            error.statusCode = 400;
            throw error;
        }

        const invoice = await staffDAO.findInvoiceSummary(maHoaDon);
        if (!invoice) {
            const error = new Error('Không tìm thấy hóa đơn để ghi nhận thanh toán');
            error.statusCode = 404;
            throw error;
        }

        const amount = Math.round(toNumber(soTienTT));
        const soTienPhaiTra = toNumber(invoice.soTienPhaiTra);
        const daNop = toNumber(invoice.daNop);
        const conNoHienTai = Math.max(soTienPhaiTra - daNop, 0);

        if (amount <= 0 || amount > conNoHienTai) {
            const error = new Error('Số tiền thanh toán không hợp lệ so với công nợ còn lại');
            error.statusCode = 400;
            throw error;
        }

        const maThanhToan = buildPaymentCode(maHoaDon);
        await staffDAO.createPayment({
            maThanhToan,
            maHoaDon,
            maNguoiDung,
            soTienTT: amount,
            phuongThucTT,
            ghiChu
        });

        const daNopMoi = daNop + amount;
        const { conNo, trangThai } = resolveInvoiceStatus(soTienPhaiTra, daNopMoi, invoice.hanThanhToan);
        await staffDAO.updateInvoiceAmounts(maHoaDon, toNumber(invoice.soTienMienGiam), soTienPhaiTra, trangThai);

        return {
            giaoDich: await staffDAO.findPaymentById(maThanhToan),
            hoaDon: {
                maHoaDon,
                soTienPhaiTra,
                daNop: daNopMoi,
                conNo,
                trangThai
            }
        };
    }

    async getPaymentHistory(maNguoiDung, filters = {}) {
        await this.ensureStaff(maNguoiDung);
        const rows = await staffDAO.getPaymentHistory(filters);

        return {
            tongGiaoDich: rows.length,
            tongTienDaThu: rows.reduce((sum, row) => sum + toNumber(row.soTienTT), 0),
            danhSach: rows.map((row) => ({
                ...row,
                soTienTT: toNumber(row.soTienTT)
            }))
        };
    }

    async getReportSummary(maNguoiDung, maNamHoc) {
        await this.ensureStaff(maNguoiDung);

        const rows = await staffDAO.getRevenueSummary(maNamHoc);
        return {
            boLoc: {
                maNamHoc: maNamHoc || null
            },
            tongThu: rows.reduce((sum, row) => sum + toNumber(row.tongThu), 0),
            tongGiaoDich: rows.reduce((sum, row) => sum + toNumber(row.soGiaoDich), 0),
            tongHoaDon: rows.reduce((sum, row) => sum + toNumber(row.soHoaDon), 0),
            danhSach: rows.map((row) => ({
                ...row,
                soGiaoDich: toNumber(row.soGiaoDich),
                soHoaDon: toNumber(row.soHoaDon),
                tongThu: toNumber(row.tongThu)
            }))
        };
    }

    async getDebtByOrganization(maNguoiDung) {
        await this.ensureStaff(maNguoiDung);

        const data = await staffDAO.getDebtByOrganization();
        return {
            byKhoa: data.byKhoa.map((item) => ({
                ...item,
                tongNo: toNumber(item.tongNo),
                soHoaDonNo: toNumber(item.soHoaDonNo)
            })),
            byNganh: data.byNganh.map((item) => ({
                ...item,
                tongNo: toNumber(item.tongNo),
                soHoaDonNo: toNumber(item.soHoaDonNo)
            })),
            byLop: data.byLop.map((item) => ({
                ...item,
                tongNo: toNumber(item.tongNo),
                soHoaDonNo: toNumber(item.soHoaDonNo)
            }))
        };
    }

    async exportReport(payload) {
        const { maNguoiDung, type = 'summary', format = 'excel', maNamHoc } = payload;

        await this.ensureStaff(maNguoiDung);

        let rows = [];
        let title = 'Bao cao';

        if (type === 'summary') {
            const summary = await this.getReportSummary(maNguoiDung, maNamHoc);
            rows = summary.danhSach;
            title = 'Tong thu theo hoc ky';
        } else if (type === 'debts') {
            rows = await this.getDebts(maNguoiDung);
            title = 'Danh sach cong no';
        } else if (type === 'org') {
            const org = await this.getDebtByOrganization(maNguoiDung);
            rows = [
                ...org.byKhoa.map((item) => ({ nhom: 'Khoa', ...item })),
                ...org.byNganh.map((item) => ({ nhom: 'Nganh', ...item })),
                ...org.byLop.map((item) => ({ nhom: 'Lop', ...item }))
            ];
            title = 'Thong ke cong no theo to chuc';
        } else {
            const error = new Error('Loại báo cáo không hợp lệ');
            error.statusCode = 400;
            throw error;
        }

        if (format === 'excel') {
            return {
                fileName: `${type}_${Date.now()}.csv`,
                mimeType: 'text/csv; charset=utf-8',
                content: toCsv(rows)
            };
        }

        if (format === 'pdf') {
            return {
                fileName: `${type}_${Date.now()}.html`,
                mimeType: 'text/html; charset=utf-8',
                content: `
                    <html>
                      <head>
                        <meta charset="UTF-8" />
                        <title>${title}</title>
                      </head>
                      <body style="font-family: Arial, sans-serif; padding: 16px;">
                        <h1>${title}</h1>
                        ${toHtmlTable('Du lieu bao cao', rows)}
                        <p>Thoi gian tao: ${new Date().toLocaleString('vi-VN')}</p>
                      </body>
                    </html>
                `
            };
        }

        const error = new Error('Định dạng xuất báo cáo không hợp lệ');
        error.statusCode = 400;
        throw error;
    }

    async generateInvoices(payload) {
        const {
            maNguoiDung,
            maHocKy,
            hanThanhToan,
            loaiSinhVien = 'ChinhQuy',
            soTienMienGiamMacDinh = 0
        } = payload;

        await this.ensureStaff(maNguoiDung);

        const registrations = await staffDAO.getStudentFeeTotalsBySemester(maHocKy, loaiSinhVien);
        if (!registrations.length) {
            const error = new Error('Không có đăng ký học hợp lệ để tạo hóa đơn');
            error.statusCode = 400;
            throw error;
        }

        const existingInvoices = await staffDAO.getExistingInvoicesBySemester(maHocKy);
        const existingStudentSet = new Set(existingInvoices.map((item) => item.maSV));

        const discount = toNumber(soTienMienGiamMacDinh);
        const today = new Date();

        const toCreate = [];
        let skippedExisting = 0;
        let skippedNoFee = 0;

        for (const registration of registrations) {
            const maSV = registration.maSV;
            if (existingStudentSet.has(maSV)) {
                skippedExisting += 1;
                continue;
            }

            const tongTien = toNumber(registration.tongTien);
            if (tongTien <= 0) {
                skippedNoFee += 1;
                continue;
            }

            const soTienPhaiTra = Math.max(tongTien - discount, 0);
            const trangThai = soTienPhaiTra === 0 ? 'DaThanhToan' : 'ChuaThanhToan';

            toCreate.push({
                maHoaDon: buildInvoiceCode(maHocKy, maSV),
                maSV,
                maHocKy,
                tongTien,
                soTienMienGiam: discount,
                soTienPhaiTra,
                ngayTaoHD: today,
                hanThanhToan,
                trangThai
            });
        }

        if (!toCreate.length) {
            return {
                maHocKy,
                tongDangKyHopLe: registrations.length,
                daTao: 0,
                boQuaDaTonTai: skippedExisting,
                boQuaKhongPhi: skippedNoFee
            };
        }

        const inserted = await staffDAO.createInvoices(toCreate);

        return {
            maHocKy,
            tongDangKyHopLe: registrations.length,
            daTao: inserted,
            boQuaDaTonTai: skippedExisting,
            boQuaKhongPhi: skippedNoFee
        };
    }
}

export default new StaffService();