(function initAdminCatalogPage() {
    function resolveResourceFromQuery() {
        const resource = new URLSearchParams(window.location.search).get('resource');
        return resource || 'khoa';
    }

    const RESOURCE_SCHEMAS = {
        khoa: {
            label: 'Khoa',
            idKey: 'maKhoa',
            fields: [
                { name: 'maKhoa', label: 'Mã khoa', required: true },
                { name: 'tenKhoa', label: 'Tên khoa', required: true },
                { name: 'truongKhoa', label: 'Trưởng khoa' }
            ],
            columns: ['maKhoa', 'tenKhoa', 'truongKhoa']
        },
        nganh: {
            label: 'Ngành',
            idKey: 'maNganh',
            fields: [
                { name: 'maNganh', label: 'Mã ngành', required: true },
                { name: 'tenNganh', label: 'Tên ngành', required: true },
                {
                    name: 'maKhoa',
                    label: 'Mã khoa',
                    required: true,
                    type: 'select',
                    optionResource: 'khoa',
                    optionValueKey: 'maKhoa',
                    optionLabelBuilder: (item) => `${item.maKhoa} - ${item.tenKhoa || '-'}`
                }
            ],
            columns: ['maNganh', 'tenNganh', 'maKhoa']
        },
        lop: {
            label: 'Lớp',
            idKey: 'maLop',
            fields: [
                { name: 'maLop', label: 'Mã lớp', required: true },
                { name: 'tenLop', label: 'Tên lớp', required: true },
                { name: 'nienKhoa', label: 'Niên khóa', type: 'number' },
                {
                    name: 'maNganh',
                    label: 'Mã ngành',
                    required: true,
                    type: 'select',
                    optionResource: 'nganh',
                    optionValueKey: 'maNganh',
                    optionLabelBuilder: (item) => `${item.maNganh} - ${item.tenNganh || '-'}`
                }
            ],
            columns: ['maLop', 'tenLop', 'nienKhoa', 'maNganh']
        },
        monhoc: {
            label: 'Môn học',
            idKey: 'maMH',
            fields: [
                { name: 'maMH', label: 'Mã môn học', required: true },
                { name: 'tenMH', label: 'Tên môn học', required: true },
                { name: 'soTinChi', label: 'Số tín chỉ', required: true, type: 'number' },
                {
                    name: 'maKhoa',
                    label: 'Mã khoa',
                    required: true,
                    type: 'select',
                    optionResource: 'khoa',
                    optionValueKey: 'maKhoa',
                    optionLabelBuilder: (item) => `${item.maKhoa} - ${item.tenKhoa || '-'}`
                }
            ],
            columns: ['maMH', 'tenMH', 'soTinChi', 'maKhoa']
        },
        sinhvien: {
            label: 'Sinh viên',
            idKey: 'maSV',
            fields: [
                { name: 'maSV', label: 'Mã sinh viên', required: true },
                { name: 'hoTen', label: 'Họ tên', required: true },
                { name: 'ngaySinh', label: 'Ngày sinh', type: 'date' },
                {
                    name: 'gioiTinh',
                    label: 'Giới tính',
                    type: 'select',
                    options: [
                        { value: '1', label: 'Nam' },
                        { value: '0', label: 'Nữ' }
                    ]
                },
                { name: 'diaChi', label: 'Địa chỉ' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'soDienThoai', label: 'Số điện thoại' },
                {
                    name: 'maLop',
                    label: 'Mã lớp',
                    required: true,
                    type: 'select',
                    optionResource: 'lop',
                    optionValueKey: 'maLop',
                    optionLabelBuilder: (item) => `${item.maLop} - ${item.tenLop || '-'}`
                },
                {
                    name: 'trangThai',
                    label: 'Trạng thái',
                    type: 'select',
                    options: [
                        { value: 'DangHoc', label: 'Đang học' },
                        { value: 'BaoLuu', label: 'Bảo lưu' },
                        { value: 'DaTotNghiep', label: 'Đã tốt nghiệp' },
                        { value: 'ThoiHoc', label: 'Thôi học' }
                    ]
                }
            ],
            columns: ['maSV', 'hoTen', 'ngaySinh', 'gioiTinh', 'email', 'maLop', 'trangThai']
        },
        namhoc: {
            label: 'Năm học',
            idKey: 'maNamHoc',
            fields: [
                { name: 'maNamHoc', label: 'Mã năm học', required: true },
                { name: 'tenNamHoc', label: 'Tên năm học', required: true },
                { name: 'namBatDau', label: 'Năm bắt đầu', required: true, type: 'number' },
                { name: 'namKetThuc', label: 'Năm kết thúc', required: true, type: 'number' }
            ],
            columns: ['maNamHoc', 'tenNamHoc', 'namBatDau', 'namKetThuc']
        },
        hocky: {
            label: 'Học kỳ',
            idKey: 'maHocKy',
            fields: [
                { name: 'maHocKy', label: 'Mã học kỳ', required: true },
                { name: 'tenHocKy', label: 'Tên học kỳ', required: true },
                { name: 'hocKySo', label: 'Số học kỳ', required: true, type: 'number' },
                {
                    name: 'maNamHoc',
                    label: 'Mã năm học',
                    required: true,
                    type: 'select',
                    optionResource: 'namhoc',
                    optionValueKey: 'maNamHoc',
                    optionLabelBuilder: (item) => `${item.maNamHoc} - ${item.tenNamHoc || '-'}`
                },
                { name: 'ngayBatDau', label: 'Ngày bắt đầu', type: 'date' },
                { name: 'ngayKetThuc', label: 'Ngày kết thúc', type: 'date' }
            ],
            columns: ['maHocKy', 'tenHocKy', 'hocKySo', 'maNamHoc', 'ngayBatDau', 'ngayKetThuc']
        }
    };

    let session = null;
    let currentResource = RESOURCE_SCHEMAS[resolveResourceFromQuery()] ? resolveResourceFromQuery() : 'khoa';
    let editingId = null;
    let rows = [];
    let optionCache = {};

    const refs = {
        resourceSelect: null,
        reloadCatalog: null,
        catalogForm: null,
        catalogFormFields: null,
        catalogSubmit: null,
        catalogCancel: null,
        catalogHeadRow: null,
        catalogBody: null,
        statTotalUsers: null,
        statTotalStudents: null,
        statTotalDepartments: null,
        statActiveRates: null
    };

    function titleCase(name) {
        if (!name) {
            return '';
        }

        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function normalizeFieldValue(field, value) {
        if (value === undefined || value === null) {
            return '';
        }

        if (field.type === 'date') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return date.toISOString().slice(0, 10);
            }

            return String(value).slice(0, 10);
        }

        return value;
    }

    function clearOptionCache() {
        optionCache = {};
    }

    async function loadOptionResource(resource) {
        if (optionCache[resource]) {
            return optionCache[resource];
        }

        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });
        const response = await api.get(`/admin/catalog/${resource}?${params.toString()}`);

        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || `Không thể tải option cho ${resource}`);
        }

        optionCache[resource] = response.data;
        return optionCache[resource];
    }

    async function resolveSelectOptions(field) {
        if (field.optionResource) {
            const source = await loadOptionResource(field.optionResource);
            return source.map((item) => {
                const value = item[field.optionValueKey];
                const label = field.optionLabelBuilder
                    ? field.optionLabelBuilder(item)
                    : String(value ?? '');

                return {
                    value: String(value ?? ''),
                    label
                };
            });
        }

        return (field.options || []).map((option) => ({
            value: String(option.value ?? ''),
            label: option.label
        }));
    }

    async function renderField(field, value, disableIdField) {
        const val = normalizeFieldValue(field, value);
        const disabledAttr = disableIdField && field.name === RESOURCE_SCHEMAS[currentResource].idKey ? 'disabled' : '';
        const requiredAttr = field.required ? 'required' : '';

        if (field.type === 'select') {
            const options = await resolveSelectOptions(field);
            const hasValue = String(val || '').length > 0;
            const hasSelectedOption = options.some((opt) => opt.value === String(val));

            const optionMarkup = [
                `<option value="" ${!hasValue ? 'selected' : ''}>Chọn ${field.label.toLowerCase()}</option>`,
                ...options.map(
                    (opt) =>
                        `<option value="${opt.value}" ${String(val) === opt.value ? 'selected' : ''}>${opt.label}</option>`
                )
            ];

            if (hasValue && !hasSelectedOption) {
                optionMarkup.push(`<option value="${val}" selected>${val}</option>`);
            }

            return `
                <div class="form-field">
                    <label for="field-${field.name}">${field.label}</label>
                    <select id="field-${field.name}" name="${field.name}" class="select" ${requiredAttr} ${disabledAttr}>
                        ${optionMarkup.join('')}
                    </select>
                </div>
            `;
        }

        return `
            <div class="form-field">
                <label for="field-${field.name}">${field.label}</label>
                <input
                    id="field-${field.name}"
                    name="${field.name}"
                    type="${field.type || 'text'}"
                    class="input"
                    value="${val}"
                    ${requiredAttr}
                    ${disabledAttr}
                />
            </div>
        `;
    }

    async function renderForm(resource, data) {
        const schema = RESOURCE_SCHEMAS[resource];
        const disableIdField = Boolean(data);
        const fieldHtml = await Promise.all(
            schema.fields.map((field) => renderField(field, data ? data[field.name] : '', disableIdField))
        );

        refs.catalogFormFields.innerHTML = fieldHtml.join('');

        refs.catalogSubmit.textContent = editingId ? `Lưu ${schema.label}` : `Thêm ${schema.label}`;
        refs.catalogCancel.hidden = !editingId;
    }

    function renderTable(resource, dataRows) {
        const schema = RESOURCE_SCHEMAS[resource];
        const headers = schema.columns.map((column) => `<th>${titleCase(column)}</th>`).join('');
        refs.catalogHeadRow.innerHTML = `<tr>${headers}<th>Thao tác</th></tr>`;

        if (!dataRows.length) {
            refs.catalogBody.innerHTML = `<tr><td colspan="${schema.columns.length + 1}" class="empty">Chưa có dữ liệu ${schema.label.toLowerCase()}.</td></tr>`;
            return;
        }

        refs.catalogBody.innerHTML = dataRows
            .map((row) => {
                const values = schema.columns.map((column) => `<td>${row[column] ?? '-'}</td>`).join('');
                const id = row[schema.idKey];

                return `
                    <tr>
                        ${values}
                        <td>
                            <div class="catalog-action-row">
                                <button type="button" class="btn btn-ghost" data-action="edit" data-id="${id}">Sửa</button>
                                <button type="button" class="btn btn-danger" data-action="delete" data-id="${id}">Xóa</button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join('');
    }

    async function loadOverview() {
        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });
        const response = await api.get(`/admin/overview?${params.toString()}`);

        if (!response?.success || !response?.data) {
            return;
        }

        refs.statTotalUsers.textContent = response.data.totalUsers ?? 0;
        refs.statTotalStudents.textContent = response.data.totalStudents ?? 0;
        refs.statTotalDepartments.textContent = response.data.totalDepartments ?? 0;
        refs.statActiveRates.textContent = response.data.activeRates ?? 0;
    }

    async function loadCatalog(resource) {
        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });
        const response = await api.get(`/admin/catalog/${resource}?${params.toString()}`);

        if (!response?.success || !Array.isArray(response?.data)) {
            throw new Error(response?.message || 'Không thể tải danh mục');
        }

        rows = response.data;
        renderTable(resource, rows);
    }

    function getPayloadFromForm(resource) {
        const schema = RESOURCE_SCHEMAS[resource];
        const formData = new FormData(refs.catalogForm);
        const payload = {};

        schema.fields.forEach((field) => {
            const value = formData.get(field.name);
            if (value === null || value === '') {
                return;
            }

            if (field.type === 'number') {
                payload[field.name] = Number(value);
                return;
            }

            payload[field.name] = String(value).trim();
        });

        return payload;
    }

    async function resetEditing() {
        editingId = null;
        await renderForm(currentResource, null);
        refs.catalogForm.reset();
    }

    function findById(resource, id) {
        const schema = RESOURCE_SCHEMAS[resource];
        return rows.find((row) => String(row[schema.idKey]) === String(id)) || null;
    }

    async function saveRecord(event) {
        event.preventDefault();

        const schema = RESOURCE_SCHEMAS[currentResource];
        const payload = getPayloadFromForm(currentResource);
        payload.maNguoiDung = session.maNguoiDung;

        if (!editingId && !payload[schema.idKey]) {
            AppShell.showToast(`Vui lòng nhập ${schema.fields.find((f) => f.name === schema.idKey)?.label || schema.idKey}`, 'error');
            return;
        }

        refs.catalogSubmit.disabled = true;

        try {
            let response;
            if (editingId) {
                response = await api.put(`/admin/catalog/${currentResource}/${editingId}`, payload);
            } else {
                response = await api.post(`/admin/catalog/${currentResource}`, payload);
            }

            if (!response?.success) {
                AppShell.showToast(response?.message || 'Lưu dữ liệu thất bại', 'error');
                return;
            }

            AppShell.showToast('Lưu dữ liệu thành công', 'info');
            clearOptionCache();
            await resetEditing();
            await loadCatalog(currentResource);
            await loadOverview();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        } finally {
            refs.catalogSubmit.disabled = false;
        }
    }

    async function handleDelete(resource, id) {
        const schema = RESOURCE_SCHEMAS[resource];
        const confirmed = window.confirm(`Xóa ${schema.label.toLowerCase()} có mã ${id}?`);
        if (!confirmed) {
            return;
        }

        const params = new URLSearchParams({ maNguoiDung: session.maNguoiDung });

        try {
            const response = await api.delete(`/admin/catalog/${resource}/${id}?${params.toString()}`);
            if (!response?.success) {
                AppShell.showToast(response?.message || 'Không thể xóa bản ghi', 'error');
                return;
            }

            AppShell.showToast('Đã xóa bản ghi', 'info');
            clearOptionCache();
            if (editingId === id) {
                await resetEditing();
            }
            await loadCatalog(resource);
            await loadOverview();
        } catch (error) {
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    }

    function bindElements() {
        refs.resourceSelect = document.getElementById('resource-select');
        refs.reloadCatalog = document.getElementById('reload-catalog');
        refs.catalogForm = document.getElementById('catalog-form');
        refs.catalogFormFields = document.getElementById('catalog-form-fields');
        refs.catalogSubmit = document.getElementById('catalog-submit');
        refs.catalogCancel = document.getElementById('catalog-cancel');
        refs.catalogHeadRow = document.getElementById('catalog-head-row');
        refs.catalogBody = document.getElementById('catalog-body');
        refs.statTotalUsers = document.getElementById('stat-total-users');
        refs.statTotalStudents = document.getElementById('stat-total-students');
        refs.statTotalDepartments = document.getElementById('stat-total-departments');
        refs.statActiveRates = document.getElementById('stat-active-rates');
    }

    function wireActions() {
        refs.catalogForm.addEventListener('submit', saveRecord);

        refs.catalogCancel.addEventListener('click', () => {
            resetEditing().catch((error) => {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            });
        });

        refs.resourceSelect.addEventListener('change', async () => {
            currentResource = refs.resourceSelect.value;

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('resource', currentResource);
            window.history.replaceState({}, '', nextUrl);

            try {
                await resetEditing();
                await loadCatalog(currentResource);
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });

        refs.reloadCatalog.addEventListener('click', async () => {
            try {
                await loadCatalog(currentResource);
                await loadOverview();
            } catch (error) {
                AppShell.showToast(AppShell.resolveApiError(error), 'error');
            }
        });

        refs.catalogBody.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) {
                return;
            }

            const action = button.dataset.action;
            const id = button.dataset.id;

            if (!id) {
                return;
            }

            if (action === 'edit') {
                const item = findById(currentResource, id);
                if (!item) {
                    return;
                }

                editingId = id;
                await renderForm(currentResource, item);
                return;
            }

            if (action === 'delete') {
                await handleDelete(currentResource, id);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        session = AppShell.requireRole(['Admin']);
        if (!session) {
            return;
        }

        bindElements();
        refs.resourceSelect.value = currentResource;

        try {
            await renderForm(currentResource, null);
        } catch (error) {
            refs.catalogFormFields.innerHTML = '<div class="empty">Không thể tải dữ liệu option cho form.</div>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }

        wireActions();

        try {
            await Promise.all([loadOverview(), loadCatalog(currentResource)]);
        } catch (error) {
            refs.catalogBody.innerHTML = '<tr><td class="empty">Không thể tải danh mục.</td></tr>';
            AppShell.showToast(AppShell.resolveApiError(error), 'error');
        }
    });
})();
