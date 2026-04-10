(function initStudentRegistrations() {
    let session = null;

    const refs = {
        regMaHocKy: null,
        regLoaiSV: null,
        regLoad: null,
        regBody: null,
        statTotalCourse: null,
        statTotalCredit: null,
        statTotalFee: null,
        statSemester: null
    };

    function numberValue(value) {
        return Number(value || 0);
    }

    function renderStats(items, payload) {
        const uniqueSemesters = new Set(items.map((item) => item.maHocKy).filter(Boolean));

        refs.statTotalCourse.textContent = numberValue(payload.tongMon || payload.tongDangKy || items.length);
        refs.statTotalCredit.textContent = numberValue(payload.tongTinChi || 0);
        refs.statTotalFee.textContent = AppShell.formatCurrency(payload.tongHocPhiDuKien || 0);
        refs.statSemester.textContent = uniqueSemesters.size;
    }

    function renderRows(items) {
        if (!items.length) {
            refs.regBody.innerHTML = '<tr><td colspan="8" class="empty">Không có Môn học đăng ký theo dieu kien loc.</td></tr>';
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
            throw new Error(response?.message || 'Không thể Tải danh sách đăng ký hoc');
        }

        const rows = Array.isArray(response.data.dangKy) ? response.data.dangKy : [];
        renderRows(rows);
        renderStats(rows, response.data);
    }

    function bindElements() {
        refs.regMaHocKy = document.getElementById('reg-ma-hoc-ky');
        refs.regLoaiSV = document.getElementById('reg-loai-sv');
        refs.regLoad = document.getElementById('reg-load');
        refs.regBody = document.getElementById('registration-body');
        refs.statTotalCourse = document.getElementById('reg-stat-total-course');
        refs.statTotalCredit = document.getElementById('reg-stat-total-credit');
        refs.statTotalFee = document.getElementById('reg-stat-total-fee');
        refs.statSemester = document.getElementById('reg-stat-semester');
    }

    function wireActions() {
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

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['SinhVien']);
        if (!session) {
            return;
        }

        bindElements();
        wireActions();

        try {
            await loadRegistrations();
        } catch (error) {
            refs.regBody.innerHTML = '<tr><td colspan="8" class="empty">Không thể Tải danh sách đăng ký hoc.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();

