(function initMomoResultPage() {
    function decodeExtraData(extraData) {
        if (!extraData) {
            return null;
        }

        try {
            const text = atob(extraData);
            return JSON.parse(text);
        } catch (error) {
            return null;
        }
    }

    function parseResult() {
        const params = new URLSearchParams(window.location.search);
        const resultCodeRaw = params.get('resultCode');
        const resultCode = Number(resultCodeRaw);

        const payload = {
            success: resultCode === 0,
            orderId: params.get('orderId') || '',
            resultCode: Number.isNaN(resultCode) ? resultCodeRaw : resultCode,
            message: params.get('message') || ''
        };

        const extraData = decodeExtraData(params.get('extraData'));
        if (extraData) {
            payload.extraData = extraData;
        }

        return payload;
    }

    function render(payload) {
        const title = document.getElementById('result-title');
        const hint = document.getElementById('result-hint');
        const viewOrderId = document.getElementById('view-order-id');
        const viewResultCode = document.getElementById('view-result-code');
        const viewMessage = document.getElementById('view-message');
        const viewSuccess = document.getElementById('view-success');
        const jsonBox = document.getElementById('result-json');

        title.textContent = payload.success ? 'Thanh toán MoMo thành công' : 'Thanh toán MoMo thất bại';
        title.style.color = payload.success ? '#157347' : '#b42318';

        hint.textContent = payload.success ?
            'Hệ thống đã nhận phản hồi thành công. Bạn có thể quay về bảng điều khiển để kiểm tra công nợ.' :
            'Giao dịch chưa thành công. Bạn có thể quay về bảng điều khiển để thực hiện lại.';

        viewOrderId.textContent = payload.orderId || '-';
        viewResultCode.textContent = payload.resultCode ?? '-';
        viewMessage.textContent = payload.message || '-';
        viewSuccess.textContent = String(payload.success);
        viewSuccess.style.fontWeight = '700';
        viewSuccess.style.color = payload.success ? '#157347' : '#b42318';

        jsonBox.textContent = JSON.stringify(payload, null, 2);
    }

    document.addEventListener('DOMContentLoaded', () => {
        render(parseResult());
    });
})();