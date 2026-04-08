import studentDAO from '../daos/student.dao.js';
import momoService from './momo.service.js';

const MOMO_DB_METHOD = 'ViDienTu';

const toNumber = (value) => Number(value || 0);

const buildPaymentOrderId = (maHoaDon) => {
    const safeInvoiceId = String(maHoaDon || '')
        .replace(/[^a-zA-Z0-9_\-]/g, '')
        .slice(-24);

    const now = new Date();
    const y = String(now.getFullYear()).slice(-2);
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const t = String(now.getTime()).slice(-6);
    return `MOMO_${safeInvoiceId}_${y}${m}${d}${t}`;
};

const encodeExtraData = (payload) => {
    const jsonText = JSON.stringify(payload || {});
    return Buffer.from(jsonText, 'utf8').toString('base64');
};

const decodeExtraData = (extraData) => {
    try {
        const text = Buffer.from(String(extraData || ''), 'base64').toString('utf8');
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
};

const normalizeMomoTransactionCode = (transId, orderId) => {
    const safeTransId = String(transId || '').replace(/[^a-zA-Z0-9_\-]/g, '');
    if (safeTransId) {
        return `MOMO_${safeTransId}`.slice(0, 50);
    }

    const fallback = String(orderId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(-40);
    return `MOMO_${fallback || Date.now()}`.slice(0, 50);
};

class StudentService {
    async ensureStudent(maNguoiDung) {
        const user = await studentDAO.findUserById(maNguoiDung);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        if (user.vaiTro !== 'SinhVien') {
            const error = new Error('Bạn không có quyền truy cập chức năng sinh viên');
            error.statusCode = 403;
            throw error;
        }

        const profile = await studentDAO.findStudentProfileByUserId(maNguoiDung);
        if (!profile) {
            const error = new Error('Không tìm thấy hồ sơ sinh viên tương ứng với tài khoản');
            error.statusCode = 404;
            throw error;
        }

        return profile;
    }

    async getProfile(maNguoiDung) {
        return this.ensureStudent(maNguoiDung);
    }

    async getInvoices(maNguoiDung) {
        const profile = await this.ensureStudent(maNguoiDung);
        const invoices = await studentDAO.getInvoicesByMaSV(profile.maSV);

        const normalizedInvoices = invoices.map((invoice) => {
            const soTienPhaiTra = toNumber(invoice.soTienPhaiTra);
            const daNop = toNumber(invoice.daNop);
            const conNo = Math.max(soTienPhaiTra - daNop, 0);

            let trangThai = 'ChuaThanhToan';
            if (conNo === 0) {
                trangThai = 'DaThanhToan';
            } else if (daNop > 0) {
                trangThai = 'ThanhToanMotPhan';
            }

            return {
                ...invoice,
                tongTien: toNumber(invoice.tongTien),
                soTienMienGiam: toNumber(invoice.soTienMienGiam),
                soTienPhaiTra,
                daNop,
                conNo,
                trangThai
            };
        });

        const tongNo = normalizedInvoices.reduce((sum, invoice) => sum + invoice.conNo, 0);

        return {
            sinhVien: {
                maSV: profile.maSV,
                hoTen: profile.hoTen,
                maLop: profile.maLop
            },
            tongNo,
            hoaDon: normalizedInvoices
        };
    }

    async getTransactions(maNguoiDung) {
        const profile = await this.ensureStudent(maNguoiDung);
        const transactions = await studentDAO.getTransactionsByMaSV(profile.maSV);

        return transactions.map((transaction) => ({
            ...transaction,
            soTienTT: toNumber(transaction.soTienTT)
        }));
    }

    async getRegistrations(maNguoiDung, maHocKy, loaiSinhVien = 'ChinhQuy') {
        const profile = await this.ensureStudent(maNguoiDung);
        const rows = await studentDAO.getRegisteredCoursesByMaSV(profile.maSV, maHocKy, loaiSinhVien);

        const normalizedRows = rows.map((item) => ({
            ...item,
            soTinChi: toNumber(item.soTinChi),
            giaPerTinChi: toNumber(item.giaPerTinChi),
            hocPhiDuKien: toNumber(item.hocPhiDuKien)
        }));

        return {
            sinhVien: {
                maSV: profile.maSV,
                hoTen: profile.hoTen,
                maLop: profile.maLop
            },
            maHocKy: maHocKy || null,
            loaiSinhVien,
            tongMon: normalizedRows.length,
            tongTinChi: normalizedRows.reduce((sum, item) => sum + item.soTinChi, 0),
            tongHocPhiDuKien: normalizedRows.reduce((sum, item) => sum + item.hocPhiDuKien, 0),
            dangKy: normalizedRows
        };
    }

    buildInvoiceSummary(invoice) {
        if (!invoice) {
            return null;
        }

        const soTienPhaiTra = toNumber(invoice.soTienPhaiTra);
        const daNop = toNumber(invoice.daNop);
        const conNo = Math.max(soTienPhaiTra - daNop, 0);

        let trangThai = 'ChuaThanhToan';
        if (conNo === 0) {
            trangThai = 'DaThanhToan';
        } else if (daNop > 0) {
            trangThai = 'ThanhToanMotPhan';
        }

        return {
            maHoaDon: invoice.maHoaDon,
            soTienPhaiTra,
            daNop,
            conNo,
            trangThai
        };
    }

    async validateInvoicePayment(payload) {
        const { maNguoiDung, maHoaDon, soTienNop } = payload;
        const profile = await this.ensureStudent(maNguoiDung);

        const invoice = await studentDAO.findInvoiceById(maHoaDon);
        if (!invoice) {
            const error = new Error('Không tìm thấy hóa đơn');
            error.statusCode = 404;
            throw error;
        }

        if (invoice.maSV !== profile.maSV) {
            const error = new Error('Bạn không có quyền thanh toán hóa đơn này');
            error.statusCode = 403;
            throw error;
        }

        const amount = Math.round(toNumber(soTienNop));
        const invoiceSummary = this.buildInvoiceSummary(invoice);

        if (invoiceSummary.conNo <= 0) {
            const error = new Error('Hóa đơn đã được thanh toán đủ');
            error.statusCode = 400;
            throw error;
        }

        if (amount <= 0) {
            const error = new Error('Số tiền nộp phải lớn hơn 0');
            error.statusCode = 400;
            throw error;
        }

        if (amount > invoiceSummary.conNo) {
            const error = new Error(`Số tiền nộp vượt quá công nợ còn lại (${invoiceSummary.conNo})`);
            error.statusCode = 400;
            throw error;
        }

        return {
            profile,
            amount,
            invoice,
            invoiceSummary
        };
    }

    buildPaymentNote(ghiChu, ipnData) {
        const notes = [];

        if (ghiChu) {
            notes.push(String(ghiChu));
        }

        if (ipnData ?.orderId) {
            notes.push(`MoMo order: ${ipnData.orderId}`);
        }

        if (ipnData ?.transId) {
            notes.push(`MoMo trans: ${ipnData.transId}`);
        }

        return notes.join(' | ').slice(0, 500);
    }

    async payInvoice(payload) {
        const { maNguoiDung, maHoaDon, soTienNop, ghiChu } = payload;
        const paymentContext = await this.validateInvoicePayment({ maNguoiDung, maHoaDon, soTienNop });

        const orderId = buildPaymentOrderId(maHoaDon);
        const orderInfo = `Thanh toan hoc phi ${maHoaDon}`;
        const extraData = encodeExtraData({
            maNguoiDung,
            maHoaDon,
            soTienNop: paymentContext.amount,
            ghiChu: ghiChu || ''
        });

        const momoResponse = await momoService.createPayment({
            orderId,
            amount: paymentContext.amount,
            orderInfo,
            extraData
        });

        if (Number(momoResponse.resultCode) !== 0) {
            const error = new Error(momoResponse.message || 'Không thể khởi tạo thanh toán MoMo');
            error.statusCode = 400;
            throw error;
        }

        return {
            orderId: momoResponse.orderId || orderId,
            amount: paymentContext.amount,
            payUrl: momoResponse.payUrl || null,
            qrCodeUrl: momoResponse.qrCodeUrl || null,
            deeplink: momoResponse.deeplink || momoResponse.deeplinkMiniApp || null,
            expiresAt: momoResponse.expiredTime || null,
            hoaDon: paymentContext.invoiceSummary
        };
    }

    async finalizeMomoSuccess(ipnData) {
        const parsedExtra = decodeExtraData(ipnData.extraData);
        if (!parsedExtra || !parsedExtra.maNguoiDung || !parsedExtra.maHoaDon) {
            const error = new Error('Du lieu thanh toan MoMo khong hop le');
            error.statusCode = 400;
            throw error;
        }

        const maThanhToan = normalizeMomoTransactionCode(ipnData.transId, ipnData.orderId);
        const existedTransaction = await studentDAO.findTransactionById(maThanhToan);
        if (existedTransaction) {
            const invoice = await studentDAO.findInvoiceById(parsedExtra.maHoaDon);
            return {
                duplicate: true,
                giaoDich: {
                    ...existedTransaction,
                    soTienTT: toNumber(existedTransaction.soTienTT)
                },
                hoaDon: this.buildInvoiceSummary(invoice)
            };
        }

        const paymentContext = await this.validateInvoicePayment({
            maNguoiDung: parsedExtra.maNguoiDung,
            maHoaDon: parsedExtra.maHoaDon,
            soTienNop: parsedExtra.soTienNop
        });

        await studentDAO.createTransaction({
            maThanhToan,
            maHoaDon: parsedExtra.maHoaDon,
            maNguoiDung: parsedExtra.maNguoiDung,
            soTienTT: paymentContext.amount,
            phuongThucTT: MOMO_DB_METHOD,
            ghiChu: this.buildPaymentNote(parsedExtra.ghiChu, ipnData)
        });

        const tongDaNopMoi = paymentContext.invoiceSummary.daNop + paymentContext.amount;
        const conNoMoi = Math.max(paymentContext.invoiceSummary.soTienPhaiTra - tongDaNopMoi, 0);
        const trangThaiMoi = conNoMoi === 0 ? 'DaThanhToan' : 'ThanhToanMotPhan';
        await studentDAO.updateInvoiceStatus(parsedExtra.maHoaDon, trangThaiMoi);

        const transaction = await studentDAO.findTransactionById(maThanhToan);

        return {
            duplicate: false,
            giaoDich: {
                ...transaction,
                soTienTT: toNumber(transaction ?.soTienTT)
            },
            hoaDon: {
                maHoaDon: parsedExtra.maHoaDon,
                soTienPhaiTra: paymentContext.invoiceSummary.soTienPhaiTra,
                daNop: tongDaNopMoi,
                conNo: conNoMoi,
                trangThai: trangThaiMoi
            }
        };
    }

    async handleMomoIpn(ipnData = {}) {
        if (!momoService.verifyIpnSignature(ipnData)) {
            const error = new Error('Chữ ký MoMo không hợp lệ');
            error.statusCode = 400;
            throw error;
        }

        const resultCode = Number(ipnData.resultCode);
        if (resultCode !== 0) {
            return {
                acknowledged: true,
                paid: false,
                resultCode,
                message: ipnData.message || 'Giao dịch không thành công'
            };
        }

        const finalized = await this.finalizeMomoSuccess(ipnData);
        return {
            acknowledged: true,
            paid: true,
            resultCode: 0,
            ...finalized
        };
    }
}

export default new StudentService();