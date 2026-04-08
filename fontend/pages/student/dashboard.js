(function initStudentDashboard() {
    let session = null;
    let invoices = [];
    let registrations = [];

    const refs = {
        status: null,
        maSV: null,
        hoTen: null,
        email: null,
        loai: null,
        invoiceBody: null,
        statTotalInvoice: null,
        statPaid: null,
        statDebt: null,
        statDebtAmount: null,
        statPaidAmount: null,
        statOverdue: null,
        statDiscount: null,
        statNearestDue: null,
        profileGreeting: null,
        jumpInvoice: null,
        jumpRegistration: null,
        regMaHocKy: null,
        regLoaiSV: null,
        regLoad: null,
        regBody: null,
        regTotalCourse: null,
        regTotalCredit: null,
        regTotalFee: null,
        modal: null,
        payForm: null,
        payMaHoaDon: null,
        paySoTien: null,
        payGhiChu: null,
        paySubmit: null,
        payCancel: null
    };

    function numberValue(value) {
        return Number(value || 0);
    }

    function isOverdueInvoice(invoice) {
        const conNo = numberValue(invoice.conNo);
        if (conNo <= 0) {
            return false;
        }

        const dueDate = invoice.hanThanhToan ? new Date(invoice.hanThanhToan) : null;
        if (!dueDate || Number.isNaN(dueDate.getTime())) {
            return false;
        }

        return dueDate.getTime() < Date.now();
    }

    function nearestDueLabel(items) {
        const candidateDates = items
            .filter((invoice) => numberValue(invoice.conNo) > 0)
            .map((invoice) => (invoice.hanThanhToan ? new Date(invoice.hanThanhToan) : null))
            .filter((date) => date && !Number.isNaN(date.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());

        if (!candidateDates.length) {
            return '-';
        }

        return AppShell.formatDate(candidateDates[0]);
    }

    function badgeForStatus(invoice) {
        if (invoice.conNo <= 0) {
            return '<span class="badge success">Đã thanh toán</span>';
        }

        if (isOverdueInvoice(invoice)) {
            return '<span class="badge danger">Quá hạn</span>';
        }

        return '<span class="badge warn">Còn nợ</span>';
    }

    function updateStats() {
        const total = invoices.length;
        const paid = invoices.filter((invoice) => numberValue(invoice.conNo) <= 0).length;
        const debt = total - paid;
        const debtAmount = invoices.reduce((sum, invoice) => sum + numberValue(invoice.conNo), 0);
        const paidAmount = invoices.reduce((sum, invoice) => sum + numberValue(invoice.daNop), 0);
        const discountAmount = invoices.reduce((sum, invoice) => sum + numberValue(invoice.soTienMienGiam), 0);
        const overdueCount = invoices.filter(isOverdueInvoice).length;

        refs.statTotalInvoice.textContent = total;
        refs.statPaid.textContent = paid;
        refs.statDebt.textContent = debt;
        refs.statDebtAmount.textContent = AppShell.formatCurrency(debtAmount);
        refs.statPaidAmount.textContent = AppShell.formatCurrency(paidAmount);
        refs.statDiscount.textContent = AppShell.formatCurrency(discountAmount);
        refs.statOverdue.textContent = overdueCount;
        refs.statNearestDue.textContent = nearestDueLabel(invoices);
    }

    function renderInvoices() {
        if (!invoices.length) {
            refs.invoiceBody.innerHTML = '<tr><td colspan="8" class="empty">Hiện chưa có hóa đơn học phí.</td></tr>';
            updateStats();
            return;
        }

        refs.invoiceBody.innerHTML = invoices
            .map((invoice) => {
                const conNo = numberValue(invoice.conNo);
                const canPay = conNo > 0;

                return `
          <tr>
            <td>#${invoice.maHoaDon}</td>
            <td>${invoice.maHocKy}</td>
            <td>${AppShell.formatCurrency(invoice.soTienPhaiTra || invoice.tongTien)}</td>
            <td>${AppShell.formatCurrency(invoice.daNop)}</td>
            <td>${AppShell.formatCurrency(conNo)}</td>
            <td>${AppShell.formatDate(invoice.hanThanhToan)}</td>
            <td>${badgeForStatus(invoice)}</td>
            <td>
              <button
                class="btn ${canPay ? 'btn-primary' : 'btn-ghost'}"
                type="button"
                data-action="pay"
                data-id="${invoice.maHoaDon}"
                data-debt="${conNo}"
                ${canPay ? '' : 'disabled'}
              >
                ${canPay ? 'Thanh toán' : 'Hoàn tất'}
              </button>
            </td>
          </tr>
        `;
            })
            .join('');

        updateStats();
    }

    function fillProfile(profile) {
        refs.maSV.textContent = profile.maSV || '-';
        refs.hoTen.textContent = profile.hoTen || '-';
        refs.email.textContent = profile.email || '-';
        refs.loai.textContent = profile.loaiSinhVien || profile.trangThai || 'Đang học';
        refs.profileGreeting.textContent = `Xin chào, ${profile.hoTen || profile.maSV || 'sinh viên'}`;
        refs.status.className = 'badge success';
        refs.status.textContent = 'Sẵn sàng giao dịch';
    }

    function renderRegistrationsSummary(payload) {
        refs.regTotalCourse.textContent = payload.tongMon || 0;
        refs.regTotalCredit.textContent = payload.tongTinChi || 0;
        refs.regTotalFee.textContent = AppShell.formatCurrency(payload.tongHocPhiDuKien || 0);
    }

    function renderRegistrationsRows(items) {
        if (!items.length) {
            refs.regBody.innerHTML = '<tr><td colspan="8" class="empty">Không có môn học đăng ký theo điều kiện lọc.</td></tr>';
            return;
        }

        refs.regBody.innerHTML = items
            .map(
                (item) => `
            <tr>
                <td>${item.maDangKy || '-'}</td>
                <td>${item.maMH || '-'}</td>
                <td>${item.tenMH || '-'}</td>
                <td>${item.maHocKy || '-'}</td>
                <td>${numberValue(item.soTinChi)}</td>
                <td>${AppShell.formatCurrency(item.giaPerTinChi)}</td>
                <td>${AppShell.formatCurrency(item.hocPhiDuKien)}</td>
                <td>${item.trangThai || '-'}</td>
            </tr>
        `
            )
            .join('');
    }

    async function loadProfile() {
        const response = await api.get(`/student/profile?maNguoiDung=${session.maNguoiDung}`);

        if (!response ?.success || !response ?.data) {
            throw new Error(response ?.message || 'Không thể tải hồ sơ sinh viên');
        }

        fillProfile(response.data);
    }

    async function loadInvoices() {
        const response = await api.get(`/student/invoices?maNguoiDung=${session.maNguoiDung}`);

        if (!response ?.success || !response ?.data) {
            throw new Error(response ?.message || 'Không thể tải danh sách hóa đơn');
        }

        invoices = Array.isArray(response.data.hoaDon) ? response.data.hoaDon : [];
        renderInvoices();
    }

    async function loadRegistrations() {
        const params = new URLSearchParams({
            maNguoiDung: session.maNguoiDung,
            loaiSinhVien: refs.regLoaiSV.value
        });

        const maHocKy = refs.regMaHocKy.value.trim();
        if (maHocKy) {
            params.set('maHocKy', maHocKy);
        }

        const response = await api.get(`/student/registrations?${params.toString()}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải danh sách đăng ký học');
        }

        registrations = Array.isArray(response.data.dangKy) ? response.data.dangKy : [];
        renderRegistrationsRows(registrations);
        renderRegistrationsSummary(response.data);
    }

    function openModal(invoiceId, debtAmount) {
        refs.payMaHoaDon.value = invoiceId;
        refs.paySoTien.value = debtAmount;
        refs.paySoTien.max = String(debtAmount);
        refs.modal.classList.add('open');
    }

    function closeModal() {
        refs.modal.classList.remove('open');
        refs.payForm.reset();
    }

    function wireTableEvents() {
        refs.invoiceBody.addEventListener('click', (event) => {
            const button = event.target.closest("button[data-action='pay']");
            if (!button) {
                return;
            }

            const invoiceId = String(button.dataset.id || '').trim();
            const debtAmount = Number(button.dataset.debt || 0);

            if (!invoiceId || debtAmount <= 0) {
                return;
            }

            openModal(invoiceId, debtAmount);
        });
    }

    function wireModalEvents() {
        refs.payCancel.addEventListener('click', closeModal);

        refs.modal.addEventListener('click', (event) => {
            if (event.target === refs.modal) {
                closeModal();
            }
        });

        refs.payForm.addEventListener('submit', async(event) => {
            event.preventDefault();

            const maHoaDon = String(refs.payMaHoaDon.value || '').trim();
            const soTienNop = Number(refs.paySoTien.value);
            const ghiChu = refs.payGhiChu.value.trim();

            if (!maHoaDon || !soTienNop || soTienNop <= 0) {
                AppShell.showToast('Vui lòng nhập số tiền hợp lệ', 'error');
                return;
            }

            refs.paySubmit.disabled = true;
            refs.paySubmit.textContent = 'Đang xử lý...';

            try {
                const response = await api.post('/student/pay', {
                    maNguoiDung: session.maNguoiDung,
                    maHoaDon,
                    soTienNop,
                    ghiChu
                });

                if (!response ?.success || !response ?.data) {
                    AppShell.showToast(response ?.message || 'Không thể tạo thanh toán MoMo', 'error');
                    return;
                }

                if (!response.data.payUrl) {
                    AppShell.showToast('Không nhận được đường dẫn thanh toán MoMo', 'error');
                    return;
                }

                AppShell.showToast('Đang chuyển đến cổng thanh toán MoMo...', 'info');
                closeModal();
                window.location.href = response.data.payUrl;
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.paySubmit.disabled = false;
                refs.paySubmit.textContent = 'Thanh toán với MoMo';
            }
        });
    }

    function wireQuickActions() {
        refs.jumpInvoice.addEventListener('click', () => {
            const section = document.getElementById('invoice-section');
            if (!section) {
                return;
            }

            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        refs.jumpRegistration.addEventListener('click', () => {
            const section = document.getElementById('registration-section');
            if (!section) {
                return;
            }

            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function wireRegistrationControls() {
        refs.regLoad.addEventListener('click', () => {
            loadRegistrations().catch((error) => {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            });
        });

        refs.regLoaiSV.addEventListener('change', () => {
            loadRegistrations().catch((error) => {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            });
        });
    }

    function bindElements() {
        refs.status = document.getElementById('profile-status');
        refs.maSV = document.getElementById('profile-ma-sv');
        refs.hoTen = document.getElementById('profile-ho-ten');
        refs.email = document.getElementById('profile-email');
        refs.loai = document.getElementById('profile-loai');
        refs.profileGreeting = document.getElementById('profile-greeting');
        refs.invoiceBody = document.getElementById('invoice-body');
        refs.statTotalInvoice = document.getElementById('stat-total-invoice');
        refs.statPaid = document.getElementById('stat-paid');
        refs.statDebt = document.getElementById('stat-debt');
        refs.statDebtAmount = document.getElementById('stat-debt-amount');
        refs.statPaidAmount = document.getElementById('stat-paid-amount');
        refs.statOverdue = document.getElementById('stat-overdue');
        refs.statDiscount = document.getElementById('stat-discount');
        refs.statNearestDue = document.getElementById('stat-nearest-due');
        refs.jumpInvoice = document.getElementById('jump-invoice');
        refs.jumpRegistration = document.getElementById('jump-registration');
        refs.regMaHocKy = document.getElementById('reg-ma-hoc-ky');
        refs.regLoaiSV = document.getElementById('reg-loai-sv');
        refs.regLoad = document.getElementById('reg-load');
        refs.regBody = document.getElementById('registration-body');
        refs.regTotalCourse = document.getElementById('reg-total-course');
        refs.regTotalCredit = document.getElementById('reg-total-credit');
        refs.regTotalFee = document.getElementById('reg-total-fee');
        refs.modal = document.getElementById('payment-modal');
        refs.payForm = document.getElementById('payment-form');
        refs.payMaHoaDon = document.getElementById('pay-ma-hoa-don');
        refs.paySoTien = document.getElementById('pay-so-tien');
        refs.payGhiChu = document.getElementById('pay-ghi-chu');
        refs.paySubmit = document.getElementById('pay-submit');
        refs.payCancel = document.getElementById('pay-cancel');
    }

    document.addEventListener('DOMContentLoaded', async() => {
        session = AppShell.requireRole(['SinhVien']);
        if (!session) {
            return;
        }

        bindElements();
        wireTableEvents();
        wireModalEvents();
        wireQuickActions();
        wireRegistrationControls();

        try {
            await Promise.all([loadProfile(), loadInvoices(), loadRegistrations()]);
        } catch (error) {
            refs.status.className = 'badge danger';
            refs.status.textContent = 'Lỗi tải dữ liệu';
            refs.invoiceBody.innerHTML = '<tr><td colspan="8" class="empty">Không thể tải dữ liệu học phí.</td></tr>';
            refs.regBody.innerHTML = '<tr><td colspan="8" class="empty">Không thể tải danh sách đăng ký học.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();