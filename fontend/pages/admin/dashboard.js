(function initAdminDashboardPage() {
    let session = null;

    const refs = {
        totalUsers: null,
        totalStudents: null,
        totalDepartments: null,
        activeRates: null
    };

    function bindElements() {
        refs.totalUsers = document.getElementById('stat-total-users');
        refs.totalStudents = document.getElementById('stat-total-students');
        refs.totalDepartments = document.getElementById('stat-total-departments');
        refs.activeRates = document.getElementById('stat-active-rates');
    }

    async function loadOverview() {
        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });
        const response = await api.get(`/admin/overview?${params.toString()}`);

        if (!response?.success || !response?.data) {
            throw new Error(response?.message || 'Khong the tai tong quan admin');
        }

        refs.totalUsers.textContent = response.data.totalUsers ?? 0;
        refs.totalStudents.textContent = response.data.totalStudents ?? 0;
        refs.totalDepartments.textContent = response.data.totalDepartments ?? 0;
        refs.activeRates.textContent = response.data.activeRates ?? 0;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['Admin']);
        if (!session) {
            return;
        }

        bindElements();

        try {
            await loadOverview();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
