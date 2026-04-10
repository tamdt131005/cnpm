(function initStaffReport() {
    const PAYMENT_METHOD_LABELS = {
        TienMat: 'Tien mat',
        ChuyenKhoan: 'Chuyen khoan',
        The: 'The',
        ViDienTu: 'Vi dien tu'
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
        orgLopBody: null
    };

    function numberValue(value) {
        return Number(value || 0);
    }

    function buildSelectOptions(items, valueKey, labelBuilder, emptyText, firstOptionLabel = 'Chọn mã') {
        if (!items.length) {
            return `<option value="">${emptyText}</option>`;
        }

        return [
            `<option value="">${firstOptionLabel}</option>`,
            ...items.map((item) => `<option value="${item[valueKey]}">${labelBuilder(item)}</option>`)
        ].join('');
    }

    async function loadReportFormOptions() {
        const invoiceHocKySelect = refs.invoiceForm?.maHocKy;
        const registrationHocKySelect = refs.registrationMaHocKy;
        const filterHocKySelect = refs.filterMaHocKy;
        const summaryNamHocSelect = refs.summaryMaNamHoc;
        const allSelects = [
            invoiceHocKySelect,
            registrationHocKySelect,
            filterHocKySelect,
            summaryNamHocSelect
        ].filter(Boolean);

        if (!allSelects.length) {
            return;
        }

        const prevInvoiceHocKy = invoiceHocKySelect?.value || '';
        const prevRegistrationHocKy = registrationHocKySelect?.value || '';
        const prevFilterHocKy = filterHocKySelect?.value || '';
        const prevSummaryNamHoc = summaryNamHocSelect?.value || '';

        allSelects.forEach((select) => {
            select.disabled = true;
        });

        try {
            const response = await api.get(`/staff/fee-rate-options?maNguoiDung=${session.maNguoiDung}`);
            if (!response?.success || !response?.data) {
                throw new Error(response?.message || 'Không thể tải danh sách học kỳ');
            }

            const hocKy = Array.isArray(response.data.hocKy) ? response.data.hocKy : [];
            const namHocMap = new Map();

            hocKy.forEach((item) => {
                const key = item.maNamHoc;
                if (!key || namHocMap.has(key)) {
                    return;
                }

                namHocMap.set(key, {
                    maNamHoc: key
                });
            });

            const namHoc = Array.from(namHocMap.values()).sort((a, b) =>
                String(b.maNamHoc).localeCompare(String(a.maNamHoc))
            );

            if (invoiceHocKySelect) {
                invoiceHocKySelect.innerHTML = buildSelectOptions(
                    hocKy,
                    'maHocKy',
                    (item) => {
                        const tenHocKy = item.tenHocKy ? ` - ${item.tenHocKy}` : '';
                        const namHocLabel = item.maNamHoc ? ` (${item.maNamHoc})` : '';
                        return `${item.maHocKy}${tenHocKy}${namHocLabel}`;
                    },
                    'Không có dữ liệu học kỳ',
                    'Chọn mã học kỳ'
                );

                if (prevInvoiceHocKy && hocKy.some((item) => item.maHocKy === prevInvoiceHocKy)) {
                    invoiceHocKySelect.value = prevInvoiceHocKy;
                }
            }

            if (registrationHocKySelect) {
                registrationHocKySelect.innerHTML = buildSelectOptions(
                    hocKy,
                    'maHocKy',
                    (item) => {
                        const tenHocKy = item.tenHocKy ? ` - ${item.tenHocKy}` : '';
                        return `${item.maHocKy}${tenHocKy}`;
                    },
                    'Không có dữ liệu học kỳ',
                    'Tất cả học kỳ'
                );

                if (prevRegistrationHocKy && hocKy.some((item) => item.maHocKy === prevRegistrationHocKy)) {
                    registrationHocKySelect.value = prevRegistrationHocKy;
                }
            }

            if (filterHocKySelect) {
                filterHocKySelect.innerHTML = buildSelectOptions(
                    hocKy,
                    'maHocKy',
                    (item) => {
                        const tenHocKy = item.tenHocKy ? ` - ${item.tenHocKy}` : '';
                        return `${item.maHocKy}${tenHocKy}`;
                    },
                    'Không có dữ liệu học kỳ',
                    'Tất cả học kỳ'
                );

                if (prevFilterHocKy && hocKy.some((item) => item.maHocKy === prevFilterHocKy)) {
                    filterHocKySelect.value = prevFilterHocKy;
                }
            }

            if (summaryNamHocSelect) {
                summaryNamHocSelect.innerHTML = buildSelectOptions(
                    namHoc,
                    'maNamHoc',
                    (item) => item.maNamHoc,
                    'Không có dữ liệu năm học',
                    'Tất cả năm học'
                );

                if (prevSummaryNamHoc && namHoc.some((item) => item.maNamHoc === prevSummaryNamHoc)) {
                    summaryNamHocSelect.value = prevSummaryNamHoc;
                }
            }
        } finally {
            allSelects.forEach((select) => {
                select.disabled = false;
            });
        }
    }

    function renderStudentFilterOptions(items) {
        const studentSelect = refs.filterMaSV;
        if (!studentSelect) {
            return;
        }

        const currentValue = studentSelect.value;
        const studentMap = new Map();

        (Array.isArray(items) ? items : []).forEach((item) => {
            if (!item?.maSV || studentMap.has(item.maSV)) {
                return;
            }

            studentMap.set(item.maSV, {
                maSV: item.maSV,
                hoTen: item.hoTen || ''
            });
        });

        const students = Array.from(studentMap.values()).sort((a, b) =>
            String(a.maSV).localeCompare(String(b.maSV))
        );

        studentSelect.innerHTML = [
            '<option value="">Tất cả sinh viên</option>',
            ...students.map((item) => `<option value="${item.maSV}">${item.maSV} - ${item.hoTen || '-'}</option>`)
        ].join('');

        if (currentValue && students.some((item) => item.maSV === currentValue)) {
            studentSelect.value = currentValue;
        }

        studentSelect.disabled = false;
    }

    function renderManualPaymentInvoiceOptions() {
        const invoiceSelect = refs.manualPaymentForm?.maHoaDon;
        if (!invoiceSelect) {
            return;
        }

        const currentValue = invoiceSelect.value;
        const debtInvoices = invoiceRows.filter((item) => numberValue(item.conNo) > 0);

        if (!debtInvoices.length) {
            invoiceSelect.innerHTML = '<option value="">Không có hóa đơn còn nợ</option>';
            invoiceSelect.disabled = true;
            return;
        }

        invoiceSelect.innerHTML = [
            '<option value="">Chọn mã hóa đơn</option>',
            ...debtInvoices.map(
                (item) =>
                    `<option value="${item.maHoaDon}">${item.maHoaDon} - ${item.maSV || '-'} - ${AppShell.formatCurrency(item.conNo)}</option>`
            )
        ].join('');

        if (currentValue && debtInvoices.some((item) => item.maHoaDon === currentValue)) {
            invoiceSelect.value = currentValue;
        }

        invoiceSelect.disabled = false;
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
            return '<span class="badge danger">Qua han</span>';
        }

        if (numberValue(item.conNo) > 0) {
            return '<span class="badge warn">Con no</span>';
        }

        return '<span class="badge success">Da thu du</span>';
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
            refs.debtBody.innerHTML = '<tr><td colspan="10" class="empty">Không có dữ liệu cong no dang mo.</td></tr>';
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
            throw new Error(response?.message || 'Không thể tai dữ liệu cong no');
        }

        debts = response.data;
        renderDebtRows(debts);
        renderStudentFilterOptions(debts);
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
                '<tr><td colspan="11" class="empty">Không có dữ liệu đăng ký hoc theo dieu kien loc.</td></tr>';
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
            throw new Error(response?.message || 'Không thể Tải danh sách đăng ký hoc');
        }

        renderRegistrationRows(response.data);
    }

    function invoiceStatusFromItem(item) {
        if (numberValue(item.conNo) <= 0) {
            return '<span class="badge success">Da thanh toán</span>';
        }

        if (isOverdue(item)) {
            return '<span class="badge danger">Qua han</span>';
        }

        if (numberValue(item.daNop) > 0) {
            return '<span class="badge warn">thanh toán mot phan</span>';
        }

        return '<span class="badge warn">Chua thanh toán</span>';
    }

    function renderInvoiceRows(items) {
        if (!items.length) {
            refs.invoiceManageBody.innerHTML =
                '<tr><td colspan="12" class="empty">Không tìm thấy hóa đơn theo dieu kien loc.</td></tr>';
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
            throw new Error(response?.message || 'Không thể Tải danh sách hóa đơn');
        }

        invoiceRows = Array.isArray(response.data.danhSach) ? response.data.danhSach : [];
        renderInvoiceRows(invoiceRows);
        renderManualPaymentInvoiceOptions();
    }

    function renderPaymentRows(items) {
        if (!items.length) {
            refs.paymentHistoryBody.innerHTML =
                '<tr><td colspan="7" class="empty">Không có giao dịch thanh toán phu hop.</td></tr>';
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
            throw new Error(response?.message || 'Không thể tai lịch sử thanh toán');
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
            refs.summaryBody.innerHTML = '<tr><td colspan="5" class="empty">Chua co dữ liệu Tổng hợp.</td></tr>';
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
            throw new Error(response?.message || 'Không thể tai báo cáo Tổng hợp');
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
            throw new Error(response?.message || 'Không thể tai báo cáo cong no theo don vi');
        }

        renderOrgRows(refs.orgKhoaBody, Array.isArray(response.data.byKhoa) ? response.data.byKhoa : [], 'maKhoa');
        renderOrgRows(refs.orgNganhBody, Array.isArray(response.data.byNganh) ? response.data.byNganh : [], 'maNganh');
        renderOrgRows(refs.orgLopBody, Array.isArray(response.data.byLop) ? response.data.byLop : [], 'maLop');
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
                AppShell.showToast('Vui lòng nhap Thông tin hợp lệ de tao hóa đơn', 'error');
                return;
            }

            refs.invoiceSubmit.disabled = true;
            refs.invoiceSubmit.textContent = 'Đang tạo...';

            try {
                const response = await api.post('/staff/generate-invoices', payload);

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể tao hóa đơn', 'error');
                    return;
                }

                const summary = response.data || {};
                AppShell.showToast(
                    `Da tao ${summary.daTao || 0} hóa đơn, bỏ qua ${summary.boQuaDaTonTai || 0} da ton tai`,
                    'info'
                );

                await Promise.all([loadDebts(), loadRegistrations(), loadInvoices(), loadSummary(), loadDebtByOrg()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.invoiceSubmit.disabled = false;
                refs.invoiceSubmit.textContent = 'Tao hóa đơn';
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
            const rawValue = window.prompt('Nhap so tien miễn giảm moi', String(currentDiscount));

            if (rawValue === null) {
                return;
            }

            const soTienMienGiam = Number(rawValue);
            if (!Number.isFinite(soTienMienGiam) || soTienMienGiam < 0) {
                AppShell.showToast('So tien miễn giảm khong hợp lệ', 'error');
                return;
            }

            try {
                const response = await api.patch(`/staff/invoices/${maHoaDon}/discount`, {
                    maNguoiDung: session.maNguoiDung,
                    soTienMienGiam
                });

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể Cập nhật miễn giảm', 'error');
                    return;
                }

                AppShell.showToast('Cập nhật miễn giảm thanh cong', 'info');
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
                AppShell.showToast('Vui lòng nhap ma hóa đơn va so tien hợp lệ', 'error');
                return;
            }

            refs.paymentSubmit.disabled = true;
            refs.paymentSubmit.textContent = 'Đang ghi nhận...';

            try {
                const response = await api.post('/staff/payments', payload);

                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể ghi nhan thanh toán', 'error');
                    return;
                }

                AppShell.showToast('Ghi nhan thanh toán thanh cong', 'info');
                refs.manualPaymentForm.reset();

                await Promise.all([loadDebts(), loadInvoices(), loadPaymentHistory(), loadSummary(), loadDebtByOrg()]);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.paymentSubmit.disabled = false;
                refs.paymentSubmit.textContent = 'Ghi nhan thanh toán';
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
            await loadReportFormOptions();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }

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
            refs.debtBody.innerHTML = '<tr><td colspan="10" class="empty">Không thể tai báo cáo cong no.</td></tr>';
            refs.registrationBody.innerHTML = '<tr><td colspan="11" class="empty">Không thể tai đăng ký Học kỳ.</td></tr>';
            refs.invoiceManageBody.innerHTML = '<tr><td colspan="12" class="empty">Không thể Tải danh sách hóa đơn.</td></tr>';
            refs.paymentHistoryBody.innerHTML = '<tr><td colspan="7" class="empty">Không thể tai lịch sử thanh toán.</td></tr>';
            refs.summaryBody.innerHTML = '<tr><td colspan="5" class="empty">Không thể tai báo cáo Tổng hợp.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();

