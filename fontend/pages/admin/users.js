(function initAdminUsersPage() {
    let session = null;
    let users = [];

    const refs = {
        tbody: null,
        roleFilter: null,
        userForm: null,
        userSubmit: null,
        reloadUsers: null,
        statTotal: null,
        statAdmin: null,
        statStaff: null,
        statLocked: null
    };

    function roleLabel(role) {
        if (role === 'Admin') {
            return 'Admin';
        }

        if (role === 'KeToan') {
            return 'Kế toán';
        }

        return 'Sinh viên';
    }

    function updateStats(items) {
        refs.statTotal.textContent = items.length;
        refs.statAdmin.textContent = items.filter((item) => item.vaiTro === 'Admin').length;
        refs.statStaff.textContent = items.filter((item) => item.vaiTro === 'KeToan').length;
        refs.statLocked.textContent = items.filter((item) => Number(item.biKhoa || 0) === 1).length;
    }

    function renderRows(items) {
        if (!items.length) {
            refs.tbody.innerHTML = '<tr><td colspan="7" class="empty">Không có tài khoản phù hợp.</td></tr>';
            updateStats(items);
            return;
        }

        refs.tbody.innerHTML = items
            .map((item) => {
                const isLocked = Number(item.biKhoa || 0) === 1;

                return `
                    <tr>
                        <td>${item.maNguoiDung}</td>
                        <td>${item.tenDangNhap}</td>
                        <td>${item.hoTen || '-'}</td>
                        <td>${item.email || '-'}</td>
                        <td>${roleLabel(item.vaiTro)}</td>
                        <td>
                            <span class="${isLocked ? 'locked-label' : 'active-label'}">
                                ${isLocked ? 'Đang khóa' : 'Hoạt động'}
                            </span>
                        </td>
                        <td>
                            <div class="user-action-row">
                                <button type="button" class="btn btn-ghost" data-action="edit" data-id="${item.maNguoiDung}">Sửa</button>
                                <button type="button" class="btn btn-ghost" data-action="password" data-id="${item.maNguoiDung}">Đổi mật khẩu</button>
                                <button type="button" class="btn ${isLocked ? 'btn-primary' : 'btn-danger'}" data-action="lock" data-id="${item.maNguoiDung}" data-locked="${isLocked ? '1' : '0'}">
                                    ${isLocked ? 'Mở khóa' : 'Khóa'}
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join('');

        updateStats(items);
    }

    function findUserById(maNguoiDung) {
        return users.find((item) => item.maNguoiDung === maNguoiDung) || null;
    }

    async function loadUsers() {
        const roleFilter = refs.roleFilter.value;
        const params = new URLSearchParams({
            maNguoiDung: session.maNguoiDung
        });

        if (roleFilter) {
            params.set('locVaiTro', roleFilter);
        }

        const response = await api.get(`/nguoidung?${params.toString()}`);
        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Không thể tải danh sách tài khoản');
        }

        users = response.data;
        renderRows(users);
    }

    function resetForm() {
        refs.userForm.reset();
        refs.userForm.vaiTro.value = 'SinhVien';
    }

    function wireCreateForm() {
        refs.userForm.addEventListener('submit', async(event) => {
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
                AppShell.showToast('Vui lòng nhập đầy đủ mã người dùng, tên đăng nhập và mật khẩu', 'error');
                return;
            }

            refs.userSubmit.disabled = true;
            refs.userSubmit.textContent = 'Đang tạo...';

            try {
                const response = await api.post('/nguoidung', payload);
                if (!response?.success) {
                    AppShell.showToast(response?.message || 'Không thể tạo tài khoản', 'error');
                    return;
                }

                AppShell.showToast('Tạo tài khoản thành công', 'info');
                resetForm();
                await loadUsers();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                refs.userSubmit.disabled = false;
                refs.userSubmit.textContent = 'Tạo tài khoản';
            }
        });
    }

    async function handleEditUser(maNguoiDung) {
        const user = findUserById(maNguoiDung);
        if (!user) {
            return;
        }

        const hoTen = window.prompt('Họ tên mới', user.hoTen || '');
        if (hoTen === null) {
            return;
        }

        const email = window.prompt('Email mới', user.email || '');
        if (email === null) {
            return;
        }

        const soDienThoai = window.prompt('Số điện thoại mới', user.soDienThoai || '');
        if (soDienThoai === null) {
            return;
        }

        const vaiTro = window.prompt('Vai trò mới (Admin | KeToan | SinhVien)', user.vaiTro || 'SinhVien');
        if (vaiTro === null) {
            return;
        }

        try {
            const response = await api.put(`/nguoidung/${maNguoiDung}`, {
                maNguoiDungThucHien: session.maNguoiDung,
                hoTen: hoTen.trim(),
                email: email.trim(),
                soDienThoai: soDienThoai.trim(),
                vaiTro: vaiTro.trim()
            });

            if (!response?.success) {
                AppShell.showToast(response?.message || 'Không thể cập nhật tài khoản', 'error');
                return;
            }

            AppShell.showToast('Cập nhật tài khoản thành công', 'info');
            await loadUsers();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    async function handleChangePassword(maNguoiDung) {
        const matKhauMoi = window.prompt('Nhập mật khẩu mới (tối thiểu 6 ký tự)');
        if (matKhauMoi === null) {
            return;
        }

        if (matKhauMoi.trim().length < 6) {
            AppShell.showToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
            return;
        }

        try {
            const response = await api.patch(`/nguoidung/${maNguoiDung}/password`, {
                maNguoiDungThucHien: session.maNguoiDung,
                matKhauMoi: matKhauMoi.trim()
            });

            if (!response?.success) {
                AppShell.showToast(response?.message || 'Không thể đổi mật khẩu', 'error');
                return;
            }

            AppShell.showToast('Đổi mật khẩu thành công', 'info');
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    async function handleLockToggle(maNguoiDung, isLocked) {
        const nextState = !isLocked;
        const lyDo = nextState ? window.prompt('Nhập lý do khóa tài khoản', 'Khóa theo yêu cầu quản trị') : '';

        if (nextState && lyDo === null) {
            return;
        }

        try {
            const response = await api.patch(`/nguoidung/${maNguoiDung}/lock`, {
                maNguoiDungThucHien: session.maNguoiDung,
                biKhoa: nextState ? 1 : 0,
                lyDo: nextState ? (lyDo || '').trim() : ''
            });

            if (!response?.success) {
                AppShell.showToast(response?.message || 'Không thể cập nhật trạng thái khóa', 'error');
                return;
            }

            AppShell.showToast(nextState ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', 'info');
            await loadUsers();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    function wireTableActions() {
        refs.tbody.addEventListener('click', async(event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) {
                return;
            }

            const action = button.dataset.action;
            const maNguoiDung = button.dataset.id;

            if (!maNguoiDung) {
                return;
            }

            if (action === 'edit') {
                await handleEditUser(maNguoiDung);
                return;
            }

            if (action === 'password') {
                await handleChangePassword(maNguoiDung);
                return;
            }

            if (action === 'lock') {
                await handleLockToggle(maNguoiDung, button.dataset.locked === '1');
            }
        });
    }

    function bindElements() {
        refs.tbody = document.getElementById('users-body');
        refs.roleFilter = document.getElementById('user-role-filter');
        refs.userForm = document.getElementById('user-form');
        refs.userSubmit = document.getElementById('user-submit');
        refs.reloadUsers = document.getElementById('reload-users');
        refs.statTotal = document.getElementById('user-stat-total');
        refs.statAdmin = document.getElementById('user-stat-admin');
        refs.statStaff = document.getElementById('user-stat-staff');
        refs.statLocked = document.getElementById('user-stat-locked');
    }

    document.addEventListener('DOMContentLoaded', async() => {
        session = AppShell.requireRole(['Admin']);
        if (!session) {
            return;
        }

        bindElements();
        wireCreateForm();
        wireTableActions();

        refs.roleFilter.addEventListener('change', () => {
            loadUsers().catch((error) => {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            });
        });

        refs.reloadUsers.addEventListener('click', () => {
            loadUsers().catch((error) => {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            });
        });

        try {
            await loadUsers();
        } catch (error) {
            refs.tbody.innerHTML = '<tr><td colspan="7" class="empty">Không thể tải danh sách tài khoản.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
