const APP_MARKER = '/fontend/';

function getAppBase() {
    const normalizedPath = window.location.pathname.replace(/\\/g, '/');
    const markerIndex = normalizedPath.indexOf(APP_MARKER);

    if (markerIndex === -1) {
        return '';
    }

    return normalizedPath.slice(0, markerIndex + APP_MARKER.length - 1);
}

function appPath(path) {
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${getAppBase()}${suffix}`;
}

function animateCount(element) {
    const finalValue = Number(element.dataset.count || 0);
    const duration = Number(element.dataset.duration || 1200);
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(finalValue * eased);
        element.textContent = new Intl.NumberFormat('vi-VN').format(current);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

function wireLandingActions() {
    const enterButton = document.getElementById('enter-dashboard');
    if (!enterButton) {
        return;
    }

    enterButton.addEventListener('click', () => {
        const sessionRaw = localStorage.getItem('hocphi_session');
        let session = null;

        if (sessionRaw) {
            try {
                session = JSON.parse(sessionRaw);
            } catch (error) {
                session = null;
            }
        }

        if (!session || !session.vaiTro) {
            window.location.href = appPath('/pages/auth/login.html');
            return;
        }

        if (session.vaiTro === 'SinhVien') {
            window.location.href = appPath('/pages/student/overview.html');
            return;
        }

        if (session.vaiTro === 'Admin') {
            window.location.href = appPath('/pages/admin/dashboard.html');
            return;
        }

        window.location.href = appPath('/pages/staff/rates.html');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-count]').forEach(animateCount);
    wireLandingActions();
});