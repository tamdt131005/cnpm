(function registerComponents() {
    const SESSION_KEY = 'hocphi_session';
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

    function getSession() {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = appPath('/pages/auth/login.html');
    }
    function roleHome(role) {
      if (role === 'SinhVien') {
        return appPath('/pages/student/overview.html');
      }

      if (role === 'Admin') {
        return appPath('/pages/admin/dashboard.html');
      }

      if (role === 'KeToan') {
        return appPath('/pages/staff/rates.html');
      }

      return appPath('/pages/auth/login.html');
    }

    function isActive(pathname, suffix) {
        return pathname.toLowerCase().includes(suffix.toLowerCase());
    }

    class AppTopbar extends HTMLElement {
        connectedCallback() {
            const session = getSession();
            const title = this.getAttribute('title') || 'Hệ thống thu học phí';
            const subtitle = this.getAttribute('subtitle') || 'Theo dõi dữ liệu thời gian thực';
            const hideActions = this.hasAttribute('hide-actions');
            const hideSearch = this.hasAttribute('hide-search') || hideActions;
            const searchPlaceholder =
                this.getAttribute('search-placeholder') || 'Tìm mã hóa đơn, mã sinh viên hoặc học kỳ';
            const userName = session?.hoTen || session?.tenDangNhap || 'Khách';
            const role = session?.vaiTro || 'Chưa đăng nhập';
            const homeHref = roleHome(session?.vaiTro);

            this.innerHTML = `
                <div class="topbar">
                  <div class="topbar-main">
                    <div class="topbar-title">
                      <small>${subtitle}</small>
                      <h2>${title}</h2>
                    </div>
                    ${hideSearch
                        ? ''
                        : `<label class="topbar-search">
                            <input type="search" placeholder="${searchPlaceholder}" aria-label="Tìm kiếm nhanh" />
                          </label>`}
                  </div>
                  ${hideActions
                      ? ''
                      : `<div class="topbar-actions">
                        <a class="btn btn-ghost" href="${homeHref}">Trang chủ</a>
                          <span class="avatar-pill"><span class="avatar-dot"></span>${userName} · ${role}</span>
                          <button type="button" class="btn btn-danger" data-action="logout">Đăng xuất</button>
                        </div>`}
                </div>
            `;

            const logoutButton = this.querySelector("[data-action='logout']");
            if (logoutButton) {
                logoutButton.addEventListener('click', logout);
            }
        }
    }

    class StudentSidebar extends HTMLElement {
        connectedCallback() {
            const path = window.location.pathname;
        const dashboardSuffix = '/pages/student/overview.html';
        const invoicesSuffix = '/pages/student/invoices.html';
        const registrationsSuffix = '/pages/student/registrations.html';
            const historySuffix = '/pages/student/history.html';
            const dashboardHref = appPath(dashboardSuffix);
        const invoicesHref = appPath(invoicesSuffix);
        const registrationsHref = appPath(registrationsSuffix);
            const historyHref = appPath(historySuffix);

            this.innerHTML = `
                <aside class="sidebar">
                  <div class="sidebar-brand">
                    <span class="sidebar-brand-mark">HP</span>
                    <div>
                      <strong>Cổng học phí</strong>
                      <small>Sinh viên</small>
                    </div>
                  </div>

                  <div class="sidebar-head">
                    <h3>Khu vực sinh viên</h3>
                    <p>Tổng quan tài chính, hóa đơn học phí, đăng ký môn và lịch sử giao dịch.</p>
                  </div>

                  <nav class="sidebar-nav">
                    <a class="sidebar-link ${isActive(path, dashboardSuffix) ? 'active' : ''}" href="${dashboardHref}">
                      <span class="sidebar-link-main">
                        <strong>Tổng quan sinh viên</strong>
                        <small>Hồ sơ học phí và chỉ số cần chú ý</small>
                      </span>
                      <span class="sidebar-link-index">01</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, invoicesSuffix) ? 'active' : ''}" href="${invoicesHref}">
                      <span class="sidebar-link-main">
                        <strong>Hóa đơn học phí</strong>
                        <small>Xem công nợ và thanh toán MoMo</small>
                      </span>
                      <span class="sidebar-link-index">02</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, registrationsSuffix) ? 'active' : ''}" href="${registrationsHref}">
                      <span class="sidebar-link-main">
                        <strong>Môn học đăng ký</strong>
                        <small>Danh sách môn và học phí dự kiến</small>
                      </span>
                      <span class="sidebar-link-index">03</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, historySuffix) ? 'active' : ''}" href="${historyHref}">
                      <span class="sidebar-link-main">
                        <strong>Lịch sử thanh toán</strong>
                        <small>Danh sách giao dịch đã phát sinh</small>
                      </span>
                      <span class="sidebar-link-index">04</span>
                    </a>
                  </nav>
                </aside>
            `;
        }
    }

    class StaffSidebar extends HTMLElement {
        connectedCallback() {
            const path = window.location.pathname;
            const ratesSuffix = '/pages/staff/rates.html';
            const reportSuffix = '/pages/staff/report.html';
            const ratesHref = appPath(ratesSuffix);
            const reportHref = appPath(reportSuffix);

            this.innerHTML = `
                <aside class="sidebar">
                  <div class="sidebar-brand">
                    <span class="sidebar-brand-mark">HP</span>
                    <div>
                      <strong>Cổng học phí</strong>
                      <small>Tài vụ</small>
                    </div>
                  </div>

                  <div class="sidebar-head">
                    <h3>Khu vực tài vụ</h3>
                    <p>Định mức học phí, hóa đơn, thanh toán và báo cáo thống kê.</p>
                  </div>

                  <nav class="sidebar-nav">
                    <a class="sidebar-link ${isActive(path, ratesSuffix) ? 'active' : ''}" href="${ratesHref}">
                      <span class="sidebar-link-main">
                        <strong>Quản lý mức học phí</strong>
                        <small>Thiết lập giá tín chỉ theo học kỳ</small>
                      </span>
                      <span class="sidebar-link-index">01</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, reportSuffix) ? 'active' : ''}" href="${reportHref}">
                      <span class="sidebar-link-main">
                        <strong>Hóa đơn và báo cáo</strong>
                        <small>Phát sinh hóa đơn, theo dõi nợ và xuất báo cáo</small>
                      </span>
                      <span class="sidebar-link-index">02</span>
                    </a>
                  </nav>
                </aside>
            `;
        }
    }

    class AdminSidebar extends HTMLElement {
        connectedCallback() {
            const path = window.location.pathname;
        const dashboardSuffix = '/pages/admin/dashboard.html';
        const usersCreateSuffix = '/pages/admin/users-create.html';
        const usersManageSuffix = '/pages/admin/users-manage.html';
        const catalogHubSuffix = '/pages/admin/catalog-hub.html';
            const catalogSuffix = '/pages/admin/catalog.html';
            const reportSuffix = '/pages/staff/report.html';
        const dashboardHref = appPath(dashboardSuffix);
        const usersCreateHref = appPath(usersCreateSuffix);
        const usersManageHref = appPath(usersManageSuffix);
        const catalogHubHref = appPath(catalogHubSuffix);
            const catalogHref = appPath(catalogSuffix);
            const reportHref = appPath(reportSuffix);

            this.innerHTML = `
                <aside class="sidebar">
                  <div class="sidebar-brand">
                    <span class="sidebar-brand-mark">HP</span>
                    <div>
                      <strong>Cổng học phí</strong>
                      <small>Quản trị</small>
                    </div>
                  </div>

                  <div class="sidebar-head">
                    <h3>Khu vực quản trị</h3>
                    <p>Phân tách tác vụ theo từng màn hình: tổng quan, tài khoản, danh mục và báo cáo.</p>
                  </div>

                  <nav class="sidebar-nav">
                    <a class="sidebar-link ${isActive(path, dashboardSuffix) ? 'active' : ''}" href="${dashboardHref}">
                      <span class="sidebar-link-main">
                        <strong>Tổng quan điều hành</strong>
                        <small>Chỉ số vận hành và truy cập nhanh</small>
                      </span>
                      <span class="sidebar-link-index">01</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, usersCreateSuffix) ? 'active' : ''}" href="${usersCreateHref}">
                      <span class="sidebar-link-main">
                        <strong>Tạo tài khoản mới</strong>
                        <small>Khởi tạo nhanh tài khoản theo vai trò</small>
                      </span>
                      <span class="sidebar-link-index">02</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, usersManageSuffix) ? 'active' : ''}" href="${usersManageHref}">
                      <span class="sidebar-link-main">
                        <strong>Quản lý tài khoản</strong>
                        <small>Sửa thông tin, đổi mật khẩu, khóa/mở khóa</small>
                      </span>
                      <span class="sidebar-link-index">03</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, catalogHubSuffix) || isActive(path, catalogSuffix) ? 'active' : ''}" href="${catalogHubHref}">
                      <span class="sidebar-link-main">
                        <strong>Danh mục đào tạo</strong>
                        <small>Tách nhóm danh mục để thao tác nhanh hơn</small>
                      </span>
                      <span class="sidebar-link-index">04</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, reportSuffix) ? 'active' : ''}" href="${reportHref}">
                      <span class="sidebar-link-main">
                        <strong>Báo cáo tài chính</strong>
                        <small>Tổng thu công nợ theo học kỳ và đơn vị</small>
                      </span>
                      <span class="sidebar-link-index">05</span>
                    </a>

                    <a class="sidebar-link ${isActive(path, catalogSuffix) ? 'active' : ''}" href="${catalogHref}">
                      <span class="sidebar-link-main">
                        <strong>Màn hình danh mục chi tiết</strong>
                        <small>Chỉnh sửa trực tiếp từng bản ghi</small>
                      </span>
                      <span class="sidebar-link-index">06</span>
                    </a>
                  </nav>
                </aside>
            `;
        }
    }

    if (!customElements.get('app-topbar')) {
        customElements.define('app-topbar', AppTopbar);
    }

    if (!customElements.get('student-sidebar')) {
        customElements.define('student-sidebar', StudentSidebar);
    }

    if (!customElements.get('staff-sidebar')) {
        customElements.define('staff-sidebar', StaffSidebar);
    }

    if (!customElements.get('admin-sidebar')) {
        customElements.define('admin-sidebar', AdminSidebar);
    }
})();