const BASE_URL = 'http://localhost:3000/api';

function normalizeEndpoint(endpoint) {
    if (!endpoint) {
        return '';
    }

    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

function getHeaders(extraHeaders = {}) {
    return {
        'Content-Type': 'application/json',
        ...extraHeaders
    };
}

function extractFileName(disposition) {
    if (!disposition) {
        return null;
    }

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
        try {
            return decodeURIComponent(utf8Match[1]);
        } catch (error) {
            return utf8Match[1];
        }
    }

    const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
    return plainMatch && plainMatch[1] ? plainMatch[1] : null;
}

async function parseResponse(response) {
    return response.json().catch(() => ({}));
}

async function apiCall(endpoint, method = 'GET', body = null, extraHeaders = {}) {
    const url = `${BASE_URL}${normalizeEndpoint(endpoint)}`;
    const options = {
        method,
        headers: getHeaders(extraHeaders)
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await parseResponse(response);

        if (!response.ok) {
            if (response.status >= 500) {
                throw new Error(data.message || `Lỗi server: ${response.status}`);
            }

            return {
                success: false,
                message: data.message || 'Yêu cầu không hợp lệ',
                data: data.data || null
            };
        }

        return data;
    } catch (error) {
        console.error(`[Lỗi gọi API] ${method} ${url}:`, error.message);
        throw error;
    }
}

async function apiUpload(endpoint, formData, extraHeaders = {}) {
    const url = `${BASE_URL}${normalizeEndpoint(endpoint)}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {...extraHeaders },
            body: formData
        });
        const data = await parseResponse(response);

        if (!response.ok) {
            if (response.status >= 500) {
                throw new Error(data.message || `Lỗi server: ${response.status}`);
            }

            return {
                success: false,
                message: data.message || 'Tải dữ liệu lên thất bại',
                data: data.data || null
            };
        }

        return data;
    } catch (error) {
        console.error(`[Lỗi gọi API] POST ${url}:`, error.message);
        throw error;
    }
}

async function apiDownload(endpoint, method = 'GET', body = null, extraHeaders = {}) {
    const url = `${BASE_URL}${normalizeEndpoint(endpoint)}`;
    const options = {
        method,
        headers: getHeaders(extraHeaders)
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const data = await parseResponse(response);

            if (response.status >= 500) {
                throw new Error(data.message || `Lỗi server: ${response.status}`);
            }

            return {
                success: false,
                message: data.message || 'Tải báo cáo thất bại'
            };
        }

        const blob = await response.blob();
        const contentType = response.headers.get('content-type') || '';
        const disposition = response.headers.get('content-disposition') || '';

        return {
            success: true,
            blob,
            contentType,
            fileName: extractFileName(disposition)
        };
    } catch (error) {
        console.error(`[Lỗi gọi API] ${method} ${url}:`, error.message);
        throw error;
    }
}

const api = {
    get: (endpoint, headers) => apiCall(endpoint, 'GET', null, headers),
    post: (endpoint, body, headers) => apiCall(endpoint, 'POST', body, headers),
    put: (endpoint, body, headers) => apiCall(endpoint, 'PUT', body, headers),
    patch: (endpoint, body, headers) => apiCall(endpoint, 'PATCH', body, headers),
    delete: (endpoint, headers) => apiCall(endpoint, 'DELETE', null, headers),
    upload: (endpoint, formData, headers) => apiUpload(endpoint, formData, headers),
    download: (endpoint, method, body, headers) => apiDownload(endpoint, method, body, headers)
};

window.api = api;