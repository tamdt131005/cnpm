(function initLoginPage() {
    function redirectAfterLogin(session) {
        const next = AppShell.getNextUrl();

        if (next && next.startsWith('/')) {
            window.location.href = next;
            return;
        }

        window.location.href = AppShell.roleHome(session.vaiTro);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const existingSession = AppShell.getSession();
        if (existingSession && existingSession.maNguoiDung) {
            redirectAfterLogin(existingSession);
            return;
        }

        const form = document.getElementById('login-form');
        const submitButton = document.getElementById('login-submit');

        form.addEventListener('submit', async(event) => {
            event.preventDefault();

            const tenDangNhap = form.tenDangNhap.value.trim();
            const matKhau = form.matKhau.value;

            if (!tenDangNhap || !matKhau) {
                AppShell.showToast('Vui lòng nhập đầy đủ tài khoản và mật khẩu', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Đang xác thực...';

            try {
                const response = await api.post('/auth/login', { tenDangNhap, matKhau });

                if (!response?.success || !response?.data) {
                    AppShell.showToast(response?.message || 'Đăng nhập thất bại', 'error');
                    return;
                }

                AppShell.setSession(response.data);
                AppShell.showToast('Đăng nhập thành công', 'info');

                setTimeout(() => {
                    redirectAfterLogin(response.data);
                }, 300);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Đăng nhập';
            }
        });
    });
})();