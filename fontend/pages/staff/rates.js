(function initStaffRates() {
    let session = null;
    let rates = [];

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
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Chưa có định mức học phí nào.</td></tr>';
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
            throw new Error(response?.message || 'Không thể tải định mức học phí');
        }

        rates = response.data;
        renderRows(rates);
    }

    function wireForm() {
        const form = document.getElementById('rate-form');
        const submitButton = document.getElementById('rate-submit');

        form.addEventListener('submit', async(event) => {
            event.preventDefault();

            const payload = {
                maNguoiDung: session.maNguoiDung,
                maMH: form.maMH.value.trim(),
                maHocKy: form.maHocKy.value.trim(),
                giaPerTinChi: Number(form.giaPerTinChi.value),
                loaiSinhVien: form.loaiSinhVien.value
            };

            if (!payload.maMH || !payload.maHocKy || payload.giaPerTinChi <= 0) {
                AppShell.showToast('Vui lòng nhập đầy đủ dữ liệu hợp lệ', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Đang lưu...';

            try {
                const response = await api.post('/staff/fee-rates', payload);
                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể tạo định mức', 'error');
                    return;
                }

                AppShell.showToast('Tạo định mức thành công', 'info');
                form.reset();
                await loadRates();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Lưu định mức';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', async() => {
        session = AppShell.requireRole(['KeToan', 'Admin']);
        if (!session) {
            return;
        }

        wireForm();

        try {
            await loadRates();
        } catch (error) {
            document.getElementById('rate-body').innerHTML =
                '<tr><td colspan="7" class="empty">Không thể tải dữ liệu định mức.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();