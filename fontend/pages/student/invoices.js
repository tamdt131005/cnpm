(function initStudentInvoices() {
    let session = null;
    let invoices = [];

    const refs = {
        invoiceBody: null,
        statTotal: null,
        statPaid: null,
        statDebt: null,
        statDebtAmount: null,
        statPaidAmount: null,
        statOverdue: null,
        statNearestDue: null,
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
        if (numberValue(invoice.conNo) <= 0) {
            return '<span class="badge success">Da thanh toan</span>';
        }

        if (isOverdueInvoice(invoice)) {
            return '<span class="badge danger">Qua han</span>';
        }

        return '<span class="badge warn">Con no</span>';
    }

    function updateStats() {
        const total = invoices.length;
        const paid = invoices.filter((invoice) => numberValue(invoice.conNo) <= 0).length;
        const debt = total - paid;
        const debtAmount = invoices.reduce((sum, invoice) => sum + numberValue(invoice.conNo), 0);
        const paidAmount = invoices.reduce((sum, invoice) => sum + numberValue(invoice.daNop), 0);
        const overdue = invoices.filter(isOverdueInvoice).length;

        refs.statTotal.textContent = total;
        refs.statPaid.textContent = paid;
        refs.statDebt.textContent = debt;
        refs.statDebtAmount.textContent = AppShell.formatCurrency(debtAmount);
        refs.statPaidAmount.textContent = AppShell.formatCurrency(paidAmount);
        refs.statOverdue.textContent = overdue;
        refs.statNearestDue.textContent = nearestDueLabel(invoices);
    }

    function renderInvoices() {
        if (!invoices.length) {
            refs.invoiceBody.innerHTML = '<tr><td colspan="8" class="empty">Hien chua co hoa don hoc phi.</td></tr>';
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
                                ${canPay ? 'Thanh toan' : 'Hoan tat'}
                            </button>
                        </td>
                    </tr>
                `;
            })
            .join('');

        updateStats();
    }

    async function loadInvoices() {
        const response = await api.get(`/student/invoices?maNguoiDung=${session.maNguoiDung}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Khong the tai danh sach hoa don');
        }

        invoices = Array.isArray(response.data.hoaDon) ? response.data.hoaDon : [];
        renderInvoices();
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

        refs.payForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const maHoaDon = String(refs.payMaHoaDon.value || '').trim();
            const soTienNop = Number(refs.paySoTien.value);
            const ghiChu = refs.payGhiChu.value.trim();

            if (!maHoaDon || !soTienNop || soTienNop <= 0) {
                AppShell.showToast('Vui long nhap so tien hop le', 'error');
                return;
            }

            refs.paySubmit.disabled = true;
            refs.paySubmit.textContent = 'Dang xu ly...';

            try {
                const response = await api.post('/student/pay', {
                    maNguoiDung: session.maNguoiDung,
                    maHoaDon,
                    soTienNop,
                    ghiChu
                });

                if (!response?.success || !response?.data) {
                    AppShell.showToast(response?.message || 'Khong the tao thanh toan MoMo', 'error');
                    return;
                }

                if (!response.data.payUrl) {
                    AppShell.showToast('Khong nhan duoc duong dan thanh toan MoMo', 'error');
                    return;
                }

                AppShell.showToast('Dang chuyen den cong thanh toan MoMo...', 'info');
                closeModal();
                window.location.href = response.data.payUrl;
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.paySubmit.disabled = false;
                refs.paySubmit.textContent = 'Thanh toan voi MoMo';
            }
        });
    }

    function bindElements() {
        refs.invoiceBody = document.getElementById('invoice-body');
        refs.statTotal = document.getElementById('inv-stat-total');
        refs.statPaid = document.getElementById('inv-stat-paid');
        refs.statDebt = document.getElementById('inv-stat-debt');
        refs.statDebtAmount = document.getElementById('inv-stat-debt-amount');
        refs.statPaidAmount = document.getElementById('inv-stat-paid-amount');
        refs.statOverdue = document.getElementById('inv-stat-overdue');
        refs.statNearestDue = document.getElementById('inv-stat-nearest-due');
        refs.modal = document.getElementById('payment-modal');
        refs.payForm = document.getElementById('payment-form');
        refs.payMaHoaDon = document.getElementById('pay-ma-hoa-don');
        refs.paySoTien = document.getElementById('pay-so-tien');
        refs.payGhiChu = document.getElementById('pay-ghi-chu');
        refs.paySubmit = document.getElementById('pay-submit');
        refs.payCancel = document.getElementById('pay-cancel');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['SinhVien']);
        if (!session) {
            return;
        }

        bindElements();
        wireTableEvents();
        wireModalEvents();

        try {
            await loadInvoices();
        } catch (error) {
            refs.invoiceBody.innerHTML = '<tr><td colspan="8" class="empty">Khong the tai du lieu hoa don.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
