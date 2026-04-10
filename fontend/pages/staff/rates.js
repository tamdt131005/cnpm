(function initStaffRates() {
    let session = null;
    let rates = [];

    function buildOptionMarkup(items, valueKey, labelBuilder, emptyText) {
        if (!items.length) {
            return `<option value="">${emptyText}</option>`;
        }

        return [
            '<option value="">Chọn mã</option>',
            ...items.map((item) => `<option value="${item[valueKey]}">${labelBuilder(item)}</option>`)
        ].join('');
    }

    async function loadFeeRateOptions() {
        const maMHSelect = document.getElementById('maMH');
        const maHocKySelect = document.getElementById('maHocKy');
        const prevMaMH = maMHSelect.value;
        const prevMaHocKy = maHocKySelect.value;

        maMHSelect.disabled = true;
        maHocKySelect.disabled = true;

        try {
            const response = await api.get(`/staff/fee-rate-options?maNguoiDung=${session.maNguoiDung}`);
            if (!response?.success || !response?.data) {
                throw new Error(response?.message || 'Không thể tải danh sách mã môn và học kỳ');
            }

            const monHoc = Array.isArray(response.data.monHoc) ? response.data.monHoc : [];
            const hocKy = Array.isArray(response.data.hocKy) ? response.data.hocKy : [];

            maMHSelect.innerHTML = buildOptionMarkup(
                monHoc,
                'maMH',
                (item) => `${item.maMH} - ${item.tenMH || 'Chưa có tên môn'}`,
                'Không có dữ liệu môn học'
            );

            maHocKySelect.innerHTML = buildOptionMarkup(
                hocKy,
                'maHocKy',
                (item) => {
                    const tenHocKy = item.tenHocKy ? ` - ${item.tenHocKy}` : '';
                    const namHoc = item.maNamHoc ? ` (${item.maNamHoc})` : '';
                    return `${item.maHocKy}${tenHocKy}${namHoc}`;
                },
                'Không có dữ liệu học kỳ'
            );

            if (prevMaMH && monHoc.some((item) => item.maMH === prevMaMH)) {
                maMHSelect.value = prevMaMH;
            }

            if (prevMaHocKy && hocKy.some((item) => item.maHocKy === prevMaHocKy)) {
                maHocKySelect.value = prevMaHocKy;
            }
        } finally {
            maMHSelect.disabled = false;
            maHocKySelect.disabled = false;
        }
    }

    function computeStats(items) {
        const semesters = new Set(items.map((item) => item.maHocKy));
        const subjects = new Set(items.map((item) => item.maMH));
        const studentTypes = new Set(items.map((item) => item.loaiSinhVien));

        return {
            total: items.length,
            semesters: semesters.size,
            subjects: subjects.size,
            studentTypes: studentTypes.size
        };
    }

    function renderStats(stats) {
        document.getElementById('rate-total').textContent = stats.total;
        document.getElementById('rate-semester').textContent = stats.semesters;
        document.getElementById('rate-subject').textContent = stats.subjects;
        document.getElementById('rate-type').textContent = stats.studentTypes;
    }

    function renderRows(items) {
        const tbody = document.getElementById('rate-body');

        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Chua co định mức Học phí nao.</td></tr>';
            renderStats(computeStats(items));
            return;
        }

        tbody.innerHTML = items
            .map((item) => `
        <tr>
          <td>${item.maMucHP}</td>
          <td>${item.maMH}</td>
          <td>${item.tenMH || '-'}</td>
          <td>${item.maHocKy}</td>
          <td>${item.tenHocKy || '-'}</td>
          <td>${item.loaiSinhVien}</td>
          <td>${AppShell.formatCurrency(item.giaPerTinChi)}</td>
        </tr>
      `)
            .join('');

        renderStats(computeStats(items));
    }

    async function loadRates() {
        const response = await api.get(`/staff/fee-rates?maNguoiDung=${session.maNguoiDung}`);

        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Không thể tai định mức Học phí');
        }

        rates = response.data;
        renderRows(rates);
    }

    function wireForm() {
        const form = document.getElementById('rate-form');
        const submitButton = document.getElementById('rate-submit');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                maNguoiDung: session.maNguoiDung,
                maMH: form.maMH.value.trim(),
                maHocKy: form.maHocKy.value.trim(),
                giaPerTinChi: Number(form.giaPerTinChi.value),
                loaiSinhVien: form.loaiSinhVien.value
            };

            if (!payload.maMH || !payload.maHocKy || payload.giaPerTinChi <= 0) {
                AppShell.showToast('Vui lòng nhap đầy đủ dữ liệu hợp lệ', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Đang lưu...';

            try {
                const response = await api.post('/staff/fee-rates', payload);
                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể tao định mức', 'error');
                    return;
                }

                AppShell.showToast('Tao định mức thanh cong', 'info');
                form.reset();
                await loadRates();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Luu định mức';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['KeToan', 'Admin']);
        if (!session) {
            return;
        }

        wireForm();

        try {
            await loadFeeRateOptions();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }

        try {
            await loadRates();
        } catch (error) {
            document.getElementById('rate-body').innerHTML =
                '<tr><td colspan="7" class="empty">Không thể tai dữ liệu định mức.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();

