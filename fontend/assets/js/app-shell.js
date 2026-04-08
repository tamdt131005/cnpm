(function initAppShell(global) {
    const SESSION_KEY = "hocphi_session";
    const APP_MARKER = "/fontend/";

    function getAppBase() {
        const normalizedPath = window.location.pathname.replace(/\\/g, "/");
        const markerIndex = normalizedPath.indexOf(APP_MARKER);

        if (markerIndex === -1) {
            return "";
        }

        return normalizedPath.slice(0, markerIndex + APP_MARKER.length - 1);
    }

    function appPath(path) {
        const suffix = path.startsWith("/") ? path : `/${path}`;
        return `${getAppBase()}${suffix}`;
    }

    function safeParse(raw) {
        try {
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    }

    function getSession() {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? safeParse(raw) : null;
    }

    function setSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    function roleHome(role) {
        if (role === "SinhVien") {
            return appPath("/pages/student/overview.html");
        }

        if (role === "Admin") {
            return appPath("/pages/admin/dashboard.html");
        }

        if (role === "KeToan") {
            return appPath("/pages/staff/rates.html");
        }

        return appPath("/index.html");
    }

    function redirectLogin() {
        const current = `${window.location.pathname}${window.location.search}`;
        window.location.href = `${appPath("/pages/auth/login.html")}?next=${encodeURIComponent(current)}`;
    }

    function requireRole(roles) {
        const session = getSession();

        if (!session || !session.maNguoiDung) {
            redirectLogin();
            return null;
        }

        if (Array.isArray(roles) && roles.length && !roles.includes(session.vaiTro)) {
            window.location.href = roleHome(session.vaiTro);
            return null;
        }

        return session;
    }

    function getNextUrl() {
        const next = new URLSearchParams(window.location.search).get("next");
        return next || null;
    }

    function formatCurrency(value) {
        const numeric = Number(value || 0);
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numeric);
    }

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("vi-VN").format(date);
    }

    function showToast(message, type) {
        const toast = document.createElement("div");
        toast.className = `toast ${type === "error" ? "error" : "info"}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2600);
    }

    function resolveApiError(error) {
        if (!error) {
            return "Đã xảy ra lỗi không xác định";
        }

        if (typeof error === "string") {
            return error;
        }

        if (error.message) {
            return error.message;
        }

        if (error.error && typeof error.error === "string") {
            return error.error;
        }

        return "Không thể xử lý yêu cầu";
    }

    global.AppShell = {
        SESSION_KEY,
        appPath,
        getSession,
        setSession,
        clearSession,
        requireRole,
        roleHome,
        getNextUrl,
        formatCurrency,
        formatDate,
        showToast,
        resolveApiError
    };
})(window);