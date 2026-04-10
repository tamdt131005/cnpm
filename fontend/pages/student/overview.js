(function initStudentOverview() {
    let session = null;

    const refs = {
        statusBadge: null,
        statusText: null,
        profileGreeting: null,
        maSV: null,
        hoTen: null,
        email: null,
        loai: null,
        statTotalInvoice: null,
        statDebt: null,
        statDebtAmount: null,
        statPaidAmount: null,
        statOverdue: null,
        statNearestDue: null
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

    function fillProfile(profile) {
        refs.maSV.textContent = profile.maSV || '-';
        refs.hoTen.textContent = profile.hoTen || '-';
        refs.email.textContent = profile.email || '-';
        refs.loai.textContent = profile.loaiSinhVien || profile.trangThai || 'Dang hoc';
        refs.profileGreeting.textContent = `Xin chao, ${profile.hoTen || profile.maSV || 'Sinh viên'}`;

        refs.statusBadge.className = 'badge success';
        refs.statusBadge.textContent = 'San sang giao dịch';
        refs.statusText.textContent = profile.trangThai || 'Dang hoc';
    }

    function fillInvoiceStats(items) {
        const total = items.length;
        const debt = items.filter((invoice) => numberValue(invoice.conNo) > 0).length;
        const debtAmount = items.reduce((sum, invoice) => sum + numberValue(invoice.conNo), 0);
        const paidAmount = items.reduce((sum, invoice) => sum + numberValue(invoice.daNop), 0);
        const overdue = items.filter(isOverdueInvoice).length;

        refs.statTotalInvoice.textContent = total;
        refs.statDebt.textContent = debt;
        refs.statDebtAmount.textContent = AppShell.formatCurrency(debtAmount);
        refs.statPaidAmount.textContent = AppShell.formatCurrency(paidAmount);
        refs.statOverdue.textContent = overdue;
        refs.statNearestDue.textContent = nearestDueLabel(items);
    }

    async function loadProfile() {
        const response = await api.get(`/student/profile?maNguoiDung=${session.maNguoiDung}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tai ho so Sinh viên');
        }

        fillProfile(response.data);
    }

    async function loadInvoices() {
        const response = await api.get(`/student/invoices?maNguoiDung=${session.maNguoiDung}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể Tải danh sách hóa đơn');
        }

        const invoices = Array.isArray(response.data.hoaDon) ? response.data.hoaDon : [];
        fillInvoiceStats(invoices);
    }

    function bindElements() {
        refs.statusBadge = document.getElementById('profile-status');
        refs.statusText = document.getElementById('profile-status-text');
        refs.profileGreeting = document.getElementById('profile-greeting');
        refs.maSV = document.getElementById('profile-ma-sv');
        refs.hoTen = document.getElementById('profile-ho-ten');
        refs.email = document.getElementById('profile-email');
        refs.loai = document.getElementById('profile-loai');
        refs.statTotalInvoice = document.getElementById('stat-total-invoice');
        refs.statDebt = document.getElementById('stat-debt');
        refs.statDebtAmount = document.getElementById('stat-debt-amount');
        refs.statPaidAmount = document.getElementById('stat-paid-amount');
        refs.statOverdue = document.getElementById('stat-overdue');
        refs.statNearestDue = document.getElementById('stat-nearest-due');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['SinhVien']);
        if (!session) {
            return;
        }

        bindElements();

        try {
            await Promise.all([loadProfile(), loadInvoices()]);
        } catch (error) {
            refs.statusBadge.className = 'badge danger';
            refs.statusBadge.textContent = 'Loi tai dữ liệu';
            refs.statusText.textContent = 'Khong kha dung';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();

