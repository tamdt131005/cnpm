(function initStudentHistory() {
    const PAYMENT_LABEL = {
        TienMat: 'Tiền mặt',
        ChuyenKhoan: 'Chuyển khoản',
        ViDienTu: 'Ví điện tử',
        The: 'Thẻ'
    };

    function paymentLabel(value) {
        return PAYMENT_LABEL[value] || value || '-';
    }

    function computeStats(items) {
        const total = items.reduce((sum, row) => sum + Number(row.soTienTT || 0), 0);
        const uniqueInvoiceCount = new Set(items.map((row) => row.maHoaDon)).size;
        const latest = items[0] ?.ngayThanhToan || null;

        return {
            count: items.length,
            total,
            uniqueInvoiceCount,
            latest
        };
    }

    function renderRows(items, tbody) {
        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Bạn chưa có giao dịch thanh toán nào.</td></tr>';
            return;
        }

        tbody.innerHTML = items
            .map((item) => `
        <tr>
          <td>${item.maThanhToan}</td>
          <td>#${item.maHoaDon}</td>
          <td>${AppShell.formatCurrency(item.soTienTT)}</td>
          <td>${AppShell.formatDate(item.ngayThanhToan)}</td>
          <td>${paymentLabel(item.phuongThucTT)}</td>
          <td>${item.ghiChu || '-'}</td>
        </tr>
      `)
            .join('');
    }

    function renderStats(stats) {
        document.getElementById('history-count').textContent = stats.count;
        document.getElementById('history-total').textContent = AppShell.formatCurrency(stats.total);
        document.getElementById('history-invoices').textContent = stats.uniqueInvoiceCount;
        document.getElementById('history-latest').textContent = stats.latest ?
            AppShell.formatDate(stats.latest) :
            '-';
    }

    document.addEventListener('DOMContentLoaded', async() => {
        const session = AppShell.requireRole(['SinhVien']);
        if (!session) {
            return;
        }

        const tbody = document.getElementById('history-body');

        try {
            const response = await api.get(`/student/transactions?maNguoiDung=${session.maNguoiDung}`);
            if (!response ?.success || !Array.isArray(response ?.data)) {
                throw new Error(response ?.message || 'Không thể tải lịch sử thanh toán');
            }

            const transactions = response.data;
            renderRows(transactions, tbody);
            renderStats(computeStats(transactions));
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Không thể tải lịch sử thanh toán.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();