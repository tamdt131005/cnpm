(function initAdminUsersManagePage() {
    let session = null;
    let users = [];

    const refs = {
        tbody: null,
        roleFilter: null,
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
            return 'Ke toan';
        }

        return 'Sinh vien';
    }

    function updateStats(items) {
        refs.statTotal.textContent = items.length;
        refs.statAdmin.textContent = items.filter((item) => item.vaiTro === 'Admin').length;
        refs.statStaff.textContent = items.filter((item) => item.vaiTro === 'KeToan').length;
        refs.statLocked.textContent = items.filter((item) => Number(item.biKhoa || 0) === 1).length;
    }

    function renderRows(items) {
        if (!items.length) {
            refs.tbody.innerHTML = '<tr><td colspan="7" class="empty">Khong co tai khoan phu hop.</td></tr>';
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
                                ${isLocked ? 'Dang khoa' : 'Hoat dong'}
                            </span>
                        </td>
                        <td>
                            <div class="user-action-row">
                                <button type="button" class="btn btn-ghost" data-action="edit" data-id="${item.maNguoiDung}">Sua</button>
                                <button type="button" class="btn btn-ghost" data-action="password" data-id="${item.maNguoiDung}">Doi mat khau</button>
                                <button type="button" class="btn ${isLocked ? 'btn-primary' : 'btn-danger'}" data-action="lock" data-id="${item.maNguoiDung}" data-locked="${isLocked ? '1' : '0'}">
                                    ${isLocked ? 'Mo khoa' : 'Khoa'}
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
        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });

        if (roleFilter) {
            params.set('locVaiTro', roleFilter);
        }

        const response = await api.get(`/nguoidung?${params.toString()}`);
        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Khong the tai danh sach tai khoan');
        }

        users = response.data;
        renderRows(users);
    }

    async function handleEditUser(maNguoiDung) {
        const user = findUserById(maNguoiDung);
        if (!user) {
            return;
        }

        const hoTen = window.prompt('Ho ten moi', user.hoTen || '');
        if (hoTen === null) {
            return;
        }

        const email = window.prompt('Email moi', user.email || '');
        if (email === null) {
            return;
        }

        const soDienThoai = window.prompt('So dien thoai moi', user.soDienThoai || '');
        if (soDienThoai === null) {
            return;
        }

        const vaiTro = window.prompt('Vai tro moi (Admin | KeToan | SinhVien)', user.vaiTro || 'SinhVien');
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
                AppShell.showToast(response?.message || 'Khong the cap nhat tai khoan', 'error');
                return;
            }

            AppShell.showToast('Cap nhat tai khoan thanh cong', 'info');
            await loadUsers();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    async function handleChangePassword(maNguoiDung) {
        const matKhauMoi = window.prompt('Nhap mat khau moi (toi thieu 6 ky tu)');
        if (matKhauMoi === null) {
            return;
        }

        if (matKhauMoi.trim().length < 6) {
            AppShell.showToast('Mat khau moi phai co it nhat 6 ky tu', 'error');
            return;
        }

        try {
            const response = await api.patch(`/nguoidung/${maNguoiDung}/password`, {
                maNguoiDungThucHien: session.maNguoiDung,
                matKhauMoi: matKhauMoi.trim()
            });

            if (!response?.success) {
                AppShell.showToast(response?.message || 'Khong the doi mat khau', 'error');
                return;
            }

            AppShell.showToast('Doi mat khau thanh cong', 'info');
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    async function handleLockToggle(maNguoiDung, isLocked) {
        const nextState = !isLocked;
        const lyDo = nextState ? window.prompt('Nhap ly do khoa tai khoan', 'Khoa theo yeu cau quan tri') : '';

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
                AppShell.showToast(response?.message || 'Khong the cap nhat trang thai khoa', 'error');
                return;
            }

            AppShell.showToast(nextState ? 'Da khoa tai khoan' : 'Da mo khoa tai khoan', 'info');
            await loadUsers();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    function wireTableActions() {
        refs.tbody.addEventListener('click', async (event) => {
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
        refs.reloadUsers = document.getElementById('reload-users');
        refs.statTotal = document.getElementById('user-stat-total');
        refs.statAdmin = document.getElementById('user-stat-admin');
        refs.statStaff = document.getElementById('user-stat-staff');
        refs.statLocked = document.getElementById('user-stat-locked');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['Admin']);
        if (!session) {
            return;
        }

        bindElements();
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
            refs.tbody.innerHTML = '<tr><td colspan="7" class="empty">Khong the tai danh sach tai khoan.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
