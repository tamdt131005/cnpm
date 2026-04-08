(function initAdminUserCreatePage() {
    let session = null;

    const refs = {
        userForm: null,
        userSubmit: null,
        statTotal: null,
        statAdmin: null,
        statStaff: null,
        statStudent: null
    };

    function updateStats(items) {
        refs.statTotal.textContent = items.length;
        refs.statAdmin.textContent = items.filter((item) => item.vaiTro === 'Admin').length;
        refs.statStaff.textContent = items.filter((item) => item.vaiTro === 'KeToan').length;
        refs.statStudent.textContent = items.filter((item) => item.vaiTro === 'SinhVien').length;
    }

    async function loadUserStats() {
        const response = await api.get(`/nguoidung?maNguoiDung=${session.maNguoiDung}`);

        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Khong the tai thong ke tai khoan');
        }

        updateStats(response.data);
    }

    function resetForm() {
        refs.userForm.reset();
        refs.userForm.vaiTro.value = 'SinhVien';
    }

    function wireCreateForm() {
        refs.userForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                maNguoiDungThucHien: session.maNguoiDung,
                maNguoiDung: refs.userForm.maNguoiDung.value.trim(),
                tenDangNhap: refs.userForm.tenDangNhap.value.trim(),
                matKhau: refs.userForm.matKhau.value,
                hoTen: refs.userForm.hoTen.value.trim(),
                email: refs.userForm.email.value.trim(),
                soDienThoai: refs.userForm.soDienThoai.value.trim(),
                vaiTro: refs.userForm.vaiTro.value
            };

            if (!payload.maNguoiDung || !payload.tenDangNhap || !payload.matKhau) {
                AppShell.showToast('Vui long nhap day du ma nguoi dung, ten dang nhap va mat khau', 'error');
                return;
            }

            refs.userSubmit.disabled = true;
            refs.userSubmit.textContent = 'Dang tao...';

            try {
                const response = await api.post('/nguoidung', payload);
                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Khong the tao tai khoan', 'error');
                    return;
                }

                AppShell.showToast('Tao tai khoan thanh cong', 'info');
                resetForm();
                await loadUserStats();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.userSubmit.disabled = false;
                refs.userSubmit.textContent = 'Tao tai khoan';
            }
        });
    }

    function bindElements() {
        refs.userForm = document.getElementById('user-form');
        refs.userSubmit = document.getElementById('user-submit');
        refs.statTotal = document.getElementById('user-stat-total');
        refs.statAdmin = document.getElementById('user-stat-admin');
        refs.statStaff = document.getElementById('user-stat-staff');
        refs.statStudent = document.getElementById('user-stat-student');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['Admin']);
        if (!session) {
            return;
        }

        bindElements();
        wireCreateForm();

        try {
            await loadUserStats();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
