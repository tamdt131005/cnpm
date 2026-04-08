(function initStaffReport() {
    const PAYMENT_METHOD_LABELS = {
        TienMat: 'Tiền mặt',
        ChuyenKhoan: 'Chuyển khoản',
        The: 'Thẻ',
        ViDienTu: 'Ví điện tử'
    };

    let session = null;
    let debts = [];
    let invoiceRows = [];

    const refs = {
        debtCount: null,
        debtTotal: null,
        debtOverdue: null,
        debtTopClass: null,
        debtBody: null,
        invoiceForm: null,
        invoiceSubmit: null,
        registrationFilterForm: null,
        registrationMaHocKy: null,
        registrationLoaiSinhVien: null,
        registrationTotalCount: null,
        registrationTotalFee: null,
        registrationStudentType: null,
        registrationBody: null,
        invoiceFilterForm: null,
        filterMaHocKy: null,
        filterMaSV: null,
        filterTrangThaiNo: null,
        clearInvoiceFilter: null,
        invoiceManageBody: null,
        manualPaymentForm: null,
        paymentSubmit: null,
        reloadPayments: null,
        paymentHistoryBody: null,
        summaryMaNamHoc: null,
        summaryLoad: null,
        summaryTotalRevenue: null,
        summaryTotalTransactions: null,
        summaryTotalInvoices: null,
        summaryBody: null,
        orgKhoaBody: null,
        orgNganhBody: null,
        orgLopBody: null,
        exportButtons: []
    };

    function numberValue(value) {
        return Number(value || 0);
    }

    function isOverdue(item) {
        const dueDate = item.hanThanhToan ? new Date(item.hanThanhToan) : null;
        if (!dueDate || Number.isNaN(dueDate.getTime())) {
            return false;
        }

        return numberValue(item.conNo) > 0 && dueDate.getTime() < Date.now();
    }

    function statusBadge(item) {
        if (isOverdue(item)) {
            return '<span class="badge danger">Quá hạn</span>';
        }

        if (numberValue(item.conNo) > 0) {
            return '<span class="badge warn">Còn nợ</span>';
        }

        return '<span class="badge success">Đã thu đủ</span>';
    }

    function computeDebtStats(items) {
        const debtCount = items.length;
        const totalDebt = items.reduce((sum, item) => sum + numberValue(item.conNo), 0);
        const overdue = items.filter(isOverdue).length;

        const byClass = new Map();
        items.forEach((item) => {
            const key = item.maLop || 'N/A';
            byClass.set(key, (byClass.get(key) || 0) + numberValue(item.conNo));
        });

        let topClass = '-';
        let topDebt = -1;
        byClass.forEach((value, key) => {
            if (value > topDebt) {
                topDebt = value;
                topClass = key;
            }
        });

        return {
            debtCount,
            totalDebt,
            overdue,
            topClass
        };
    }

    function renderDebtStats(stats) {
        refs.debtCount.textContent = stats.debtCount;
        refs.debtTotal.textContent = AppShell.formatCurrency(stats.totalDebt);
        refs.debtOverdue.textContent = stats.overdue;
        refs.debtTopClass.textContent = stats.topClass;
    }

    function renderDebtRows(items) {
        if (!items.length) {
            refs.debtBody.innerHTML = '<tr><td colspan="10" class="empty">Không có dữ liệu công nợ đang mở.</td></tr>';
            renderDebtStats(computeDebtStats(items));
            return;
        }

        refs.debtBody.innerHTML = items
            .map(
                (item) => `
        <tr>
          <td>${item.maSV}</td>
          <td>${item.hoTen}</td>
          <td>${item.maLop || '-'}</td>
          <td>${item.maHoaDon}</td>
          <td>${item.maHocKy}</td>
          <td>${AppShell.formatCurrency(item.soTienPhaiTra)}</td>
          <td>${AppShell.formatCurrency(item.daNop)}</td>
          <td>${AppShell.formatCurrency(item.conNo)}</td>
          <td>${AppShell.formatDate(item.hanThanhToan)}</td>
          <td>${statusBadge(item)}</td>
        </tr>
      `
            )
            .join('');

        renderDebtStats(computeDebtStats(items));
    }

    function buildQuery(extra = {}) {
        const params = new URLSearchParams({
            maNguoiDung: session.maNguoiDung
        });

        Object.entries(extra).forEach(([key, value]) => {
            const raw = value === null || value === undefined ? '' : String(value).trim();
            if (!raw) {
                return;
            }

            params.set(key, raw);
        });

        return params;
    }

    async function loadDebts() {
        const response = await api.get(`/staff/debts?${buildQuery().toString()}`);

        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Không thể tải dữ liệu công nợ');
        }

        debts = response.data;
        renderDebtRows(debts);
    }

    function studentTypeLabel(type) {
        if (type === 'LienThong') {
            return 'Liên thông';
        }

        if (type === 'VanBang2') {
            return 'Văn bằng 2';
        }

        return 'Chính quy';
    }

    function renderRegistrationRows(payload) {
        const rows = Array.isArray(payload?.danhSach) ? payload.danhSach : [];
        refs.registrationTotalCount.textContent = numberValue(payload?.tongDangKy);
        refs.registrationTotalFee.textContent = AppShell.formatCurrency(payload?.tongHocPhiDuKien || 0);
        refs.registrationStudentType.textContent = studentTypeLabel(payload?.loaiSinhVien || 'ChinhQuy');

        if (!rows.length) {
            refs.registrationBody.innerHTML =
                '<tr><td colspan="11" class="empty">Không có dữ liệu đăng ký học theo điều kiện lọc.</td></tr>';
            return;
        }

        refs.registrationBody.innerHTML = rows
            .map(
                (item) => `
            <tr>
                <td>${item.maDangKy}</td>
                <td>${item.maSV}</td>
                <td>${item.hoTen || '-'}</td>
                <td>${item.maLop || '-'}</td>
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

    async function loadRegistrations() {
        const response = await api.get(
            `/staff/registrations?${
                buildQuery({
                    maHocKy: refs.registrationMaHocKy.value,
                    loaiSinhVien: refs.registrationLoaiSinhVien.value
                }).toString()
            }`
        );

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải danh sách đăng ký học');
        }

        renderRegistrationRows(response.data);
    }

    function invoiceStatusFromItem(item) {
        if (numberValue(item.conNo) <= 0) {
            return '<span class="badge success">Đã thanh toán</span>';
        }

        if (isOverdue(item)) {
            return '<span class="badge danger">Quá hạn</span>';
        }

        if (numberValue(item.daNop) > 0) {
            return '<span class="badge warn">Thanh toán một phần</span>';
        }

        return '<span class="badge warn">Chưa thanh toán</span>';
    }

    function renderInvoiceRows(items) {
        if (!items.length) {
            refs.invoiceManageBody.innerHTML =
                '<tr><td colspan="12" class="empty">Không tìm thấy hóa đơn theo điều kiện lọc.</td></tr>';
            return;
        }

        refs.invoiceManageBody.innerHTML = items
            .map(
                (item) => `
            <tr>
                <td>${item.maHoaDon}</td>
                <td>${item.maSV}</td>
                <td>${item.hoTen || '-'}</td>
                <td>${item.maHocKy || '-'}</td>
                <td>${AppShell.formatCurrency(item.tongTien)}</td>
                <td>${AppShell.formatCurrency(item.soTienMienGiam)}</td>
                <td>${AppShell.formatCurrency(item.soTienPhaiTra)}</td>
                <td>${AppShell.formatCurrency(item.daNop)}</td>
                <td>${AppShell.formatCurrency(item.conNo)}</td>
                <td>${AppShell.formatDate(item.hanThanhToan)}</td>
                <td>${invoiceStatusFromItem(item)}</td>
                <td>
                    <div class="invoice-action-row">
                        <button type="button" class="btn btn-ghost" data-action="discount" data-id="${item.maHoaDon}">
                            Cập nhật miễn giảm
                        </button>
                    </div>
                </td>
            </tr>
        `
            )
            .join('');
    }

    async function loadInvoices() {
        const response = await api.get(
            `/staff/invoices?${
                buildQuery({
                    maHocKy: refs.filterMaHocKy.value,
                    maSV: refs.filterMaSV.value,
                    trangThaiNo: refs.filterTrangThaiNo.value
                }).toString()
            }`
        );

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải danh sách hóa đơn');
        }

        invoiceRows = Array.isArray(response.data.danhSach) ? response.data.danhSach : [];
        renderInvoiceRows(invoiceRows);
    }

    function renderPaymentRows(items) {
        if (!items.length) {
            refs.paymentHistoryBody.innerHTML =
                '<tr><td colspan="7" class="empty">Không có giao dịch thanh toán phù hợp.</td></tr>';
            return;
        }

        refs.paymentHistoryBody.innerHTML = items
            .map(
                (item) => `
            <tr>
                <td>${item.maThanhToan}</td>
                <td>${item.maHoaDon}</td>
                <td>${item.maSV || '-'}</td>
                <td>${item.maHocKy || '-'}</td>
                <td>${AppShell.formatCurrency(item.soTienTT)}</td>
                <td>${PAYMENT_METHOD_LABELS[item.phuongThucTT] || item.phuongThucTT}</td>
                <td>${AppShell.formatDate(item.ngayThanhToan)}</td>
            </tr>
        `
            )
            .join('');
    }

    async function loadPaymentHistory() {
        const response = await api.get(
            `/staff/payments/history?${
                buildQuery({
                    maHocKy: refs.filterMaHocKy.value,
                    maSV: refs.filterMaSV.value
                }).toString()
            }`
        );

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải lịch sử thanh toán');
        }

        const rows = Array.isArray(response.data.danhSach) ? response.data.danhSach : [];
        renderPaymentRows(rows);
    }

    function renderSummary(data) {
        refs.summaryTotalRevenue.textContent = AppShell.formatCurrency(data?.tongThu || 0);
        refs.summaryTotalTransactions.textContent = numberValue(data?.tongGiaoDich);
        refs.summaryTotalInvoices.textContent = numberValue(data?.tongHoaDon);

        const rows = Array.isArray(data?.danhSach) ? data.danhSach : [];
        if (!rows.length) {
            refs.summaryBody.innerHTML = '<tr><td colspan="5" class="empty">Chưa có dữ liệu tổng hợp.</td></tr>';
            return;
        }

        refs.summaryBody.innerHTML = rows
            .map(
                (item) => `
            <tr>
                <td>${item.maNamHoc || '-'}</td>
                <td>${item.maHocKy || '-'}</td>
                <td>${numberValue(item.soGiaoDich)}</td>
                <td>${numberValue(item.soHoaDon)}</td>
                <td>${AppShell.formatCurrency(item.tongThu)}</td>
            </tr>
        `
            )
            .join('');
    }

    async function loadSummary() {
        const response = await api.get(
            `/staff/reports/summary?${
                buildQuery({
                    maNamHoc: refs.summaryMaNamHoc.value
                }).toString()
            }`
        );

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải báo cáo tổng hợp');
        }

        renderSummary(response.data);
    }

    function renderOrgRows(tbody, rows, keyName) {
        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty">Không có dữ liệu.</td></tr>';
            return;
        }

        tbody.innerHTML = rows
            .slice(0, 8)
            .map(
                (item) => `
            <tr>
                <td>${item[keyName] || '-'}</td>
                <td>${AppShell.formatCurrency(item.tongNo)}</td>
                <td>${numberValue(item.soHoaDonNo)}</td>
            </tr>
        `
            )
            .join('');
    }

    async function loadDebtByOrg() {
        const response = await api.get(`/staff/reports/debt-org?${buildQuery().toString()}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Không thể tải báo cáo công nợ theo đơn vị');
        }

        renderOrgRows(refs.orgKhoaBody, Array.isArray(response.data.byKhoa) ? response.data.byKhoa : [], 'maKhoa');
        renderOrgRows(refs.orgNganhBody, Array.isArray(response.data.byNganh) ? response.data.byNganh : [], 'maNganh');
        renderOrgRows(refs.orgLopBody, Array.isArray(response.data.byLop) ? response.data.byLop : [], 'maLop');
    }

    async function exportReport(type, format) {
        const response = await api.download(
            `/staff/reports/export?${
                buildQuery({
                    type,
                    format,
                    maNamHoc: refs.summaryMaNamHoc.value
                }).toString()
            }`
        );

        if (!response?.success || !response?.blob) {
            AppShell.showToast(response?.message || 'Không thể xuất báo cáo', 'error');
            return;
        }

        const defaultName = `${type}_${Date.now()}.${format === 'excel' ? 'csv' : 'html'}`;
        const fileName = response.fileName || defaultName;
        const blobUrl = URL.createObjectURL(response.blob);

        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(blobUrl);
        AppShell.showToast('Đã tải báo cáo xuống máy', 'info');
    }

    function wireGenerateInvoiceForm() {
        refs.invoiceForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                maNguoiDung: session.maNguoiDung,
                maHocKy: refs.invoiceForm.maHocKy.value.trim(),
                hanThanhToan: refs.invoiceForm.hanThanhToan.value,
                loaiSinhVien: refs.invoiceForm.loaiSinhVien.value,
                soTienMienGiamMacDinh: Number(refs.invoiceForm.soTienMienGiamMacDinh.value || 0)
            };

            if (!payload.maHocKy || !payload.hanThanhToan || payload.soTienMienGiamMacDinh < 0) {
                AppShell.showToast('Vui lòng nhập thông tin hợp lệ để tạo hóa đơn', 'error');
                return;
            }

            refs.invoiceSubmit.disabled = true;
            refs.invoiceSubmit.textContent = 'Đang tạo...';

            try {
                const response = await api.post('/staff/generate-invoices', payload);

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể tạo hóa đơn', 'error');
                    return;
                }

                const summary = response.data || {};
                AppShell.showToast(
                    `Đã tạo ${summary.daTao || 0} hóa đơn, bỏ qua ${summary.boQuaDaTonTai || 0} đã tồn tại`,
                    'info'
                );

                await Promise.all([loadDebts(), loadRegistrations(), loadInvoices(), loadSummary(), loadDebtByOrg()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.invoiceSubmit.disabled = false;
                refs.invoiceSubmit.textContent = 'Tạo hóa đơn';
            }
        });
    }

    function wireRegistrationFilters() {
        refs.registrationFilterForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                await loadRegistrations();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });
    }

    function wireInvoiceFilters() {
        refs.invoiceFilterForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                await Promise.all([loadInvoices(), loadPaymentHistory()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });

        refs.clearInvoiceFilter.addEventListener('click', async () => {
            refs.invoiceFilterForm.reset();

            try {
                await Promise.all([loadInvoices(), loadPaymentHistory()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });
    }

    function wireInvoiceActions() {
        refs.invoiceManageBody.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-action="discount"]');
            if (!button) {
                return;
            }

            const maHoaDon = button.dataset.id;
            if (!maHoaDon) {
                return;
            }

            const item = invoiceRows.find((invoice) => invoice.maHoaDon === maHoaDon);
            const currentDiscount = numberValue(item?.soTienMienGiam);
            const rawValue = window.prompt('Nhập số tiền miễn giảm mới', String(currentDiscount));

            if (rawValue === null) {
                return;
            }

            const soTienMienGiam = Number(rawValue);
            if (!Number.isFinite(soTienMienGiam) || soTienMienGiam < 0) {
                AppShell.showToast('Số tiền miễn giảm không hợp lệ', 'error');
                return;
            }

            try {
                const response = await api.patch(`/staff/invoices/${maHoaDon}/discount`, {
                    maNguoiDung: session.maNguoiDung,
                    soTienMienGiam
                });

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể cập nhật miễn giảm', 'error');
                    return;
                }

                AppShell.showToast('Cập nhật miễn giảm thành công', 'info');
                await Promise.all([loadInvoices(), loadDebts(), loadDebtByOrg()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });
    }

    function wireManualPaymentForm() {
        refs.manualPaymentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                maNguoiDung: session.maNguoiDung,
                maHoaDon: refs.manualPaymentForm.maHoaDon.value.trim(),
                soTienTT: Number(refs.manualPaymentForm.soTienTT.value || 0),
                phuongThucTT: refs.manualPaymentForm.phuongThucTT.value,
                ghiChu: refs.manualPaymentForm.ghiChu.value.trim()
            };

            if (!payload.maHoaDon || payload.soTienTT <= 0) {
                AppShell.showToast('Vui lòng nhập mã hóa đơn và số tiền hợp lệ', 'error');
                return;
            }

            refs.paymentSubmit.disabled = true;
            refs.paymentSubmit.textContent = 'Đang ghi nhận...';

            try {
                const response = await api.post('/staff/payments', payload);

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể ghi nhận thanh toán', 'error');
                    return;
                }

                AppShell.showToast('Ghi nhận thanh toán thành công', 'info');
                refs.manualPaymentForm.reset();

                await Promise.all([loadDebts(), loadInvoices(), loadPaymentHistory(), loadSummary(), loadDebtByOrg()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.paymentSubmit.disabled = false;
                refs.paymentSubmit.textContent = 'Ghi nhận thanh toán';
            }
        });

        refs.reloadPayments.addEventListener('click', async () => {
            try {
                await loadPaymentHistory();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });
    }

    function wireSummaryControls() {
        refs.summaryLoad.addEventListener('click', async () => {
            try {
                await loadSummary();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });

        refs.exportButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const token = button.dataset.export || '';
                const [type, format] = token.split(':');

                if (!type || !format) {
                    return;
                }

                try {
                    await exportReport(type, format);
                } catch (error) {
                    AppShell.showToast(AppShell.resolveApiError(error), 'error');
                }
            });
        });
    }

    function bindElements() {
        refs.debtCount = document.getElementById('debt-count');
        refs.debtTotal = document.getElementById('debt-total');
        refs.debtOverdue = document.getElementById('debt-overdue');
        refs.debtTopClass = document.getElementById('debt-top-class');
        refs.debtBody = document.getElementById('debt-body');

        refs.invoiceForm = document.getElementById('invoice-form');
        refs.invoiceSubmit = document.getElementById('invoice-submit');
        refs.registrationFilterForm = document.getElementById('registration-filter-form');
        refs.registrationMaHocKy = document.getElementById('registration-maHocKy');
        refs.registrationLoaiSinhVien = document.getElementById('registration-loaiSinhVien');
        refs.registrationTotalCount = document.getElementById('registration-total-count');
        refs.registrationTotalFee = document.getElementById('registration-total-fee');
        refs.registrationStudentType = document.getElementById('registration-student-type');
        refs.registrationBody = document.getElementById('registration-body');
        refs.invoiceFilterForm = document.getElementById('invoice-filter-form');
        refs.filterMaHocKy = document.getElementById('filter-maHocKy');
        refs.filterMaSV = document.getElementById('filter-maSV');
        refs.filterTrangThaiNo = document.getElementById('filter-trangThaiNo');
        refs.clearInvoiceFilter = document.getElementById('clear-invoice-filter');
        refs.invoiceManageBody = document.getElementById('invoice-manage-body');

        refs.manualPaymentForm = document.getElementById('manual-payment-form');
        refs.paymentSubmit = document.getElementById('payment-submit');
        refs.reloadPayments = document.getElementById('reload-payments');
        refs.paymentHistoryBody = document.getElementById('payment-history-body');

        refs.summaryMaNamHoc = document.getElementById('summary-maNamHoc');
        refs.summaryLoad = document.getElementById('summary-load');
        refs.summaryTotalRevenue = document.getElementById('summary-total-revenue');
        refs.summaryTotalTransactions = document.getElementById('summary-total-transactions');
        refs.summaryTotalInvoices = document.getElementById('summary-total-invoices');
        refs.summaryBody = document.getElementById('summary-body');
        refs.orgKhoaBody = document.getElementById('org-khoa-body');
        refs.orgNganhBody = document.getElementById('org-nganh-body');
        refs.orgLopBody = document.getElementById('org-lop-body');
        refs.exportButtons = Array.from(document.querySelectorAll('[data-export]'));
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['KeToan', 'Admin']);
        if (!session) {
            return;
        }

        bindElements();
        wireGenerateInvoiceForm();
        wireRegistrationFilters();
        wireInvoiceFilters();
        wireInvoiceActions();
        wireManualPaymentForm();
        wireSummaryControls();

        try {
            await Promise.all([
                loadDebts(),
                loadRegistrations(),
                loadInvoices(),
                loadPaymentHistory(),
                loadSummary(),
                loadDebtByOrg()
            ]);
        } catch (error) {
            refs.debtBody.innerHTML = '<tr><td colspan="10" class="empty">Không thể tải báo cáo công nợ.</td></tr>';
            refs.registrationBody.innerHTML = '<tr><td colspan="11" class="empty">Không thể tải đăng ký học kỳ.</td></tr>';
            refs.invoiceManageBody.innerHTML = '<tr><td colspan="12" class="empty">Không thể tải danh sách hóa đơn.</td></tr>';
            refs.paymentHistoryBody.innerHTML = '<tr><td colspan="7" class="empty">Không thể tải lịch sử thanh toán.</td></tr>';
            refs.summaryBody.innerHTML = '<tr><td colspan="5" class="empty">Không thể tải báo cáo tổng hợp.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
