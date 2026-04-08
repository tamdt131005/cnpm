# PLAN REVIEW TEMP

## 1) Thong tin yeu cau

- Yeu cau: Doc tai lieu nghiep vu + SQL hien co de xay backend quan ly thu phi, giu login san co, khong dung JWT/verify token, dua hash password vao service.
- Nguoi de xuat: User
- Thoi diem lap plan: 2026-04-06

## 2) Muc tieu thay doi

- [x] Muc tieu 1: Chuan hoa luong dang nhap khong JWT, van dang nhap duoc voi DB hien tai.
- [x] Muc tieu 2: Dua logic hash password (batch hash plaintext) vao service, script chi con goi service.
- [x] Muc tieu 3: Bo sung module hoc phi theo layer cho student/staff dua tren bang SQL hien co.

## 3) Danh sach file du kien sua

| STT | File | Noi dung thay doi | Ly do | Trang thai duyet |
| --- | --- | --- | --- | --- |
| 1 | server/src/routes/auth.route.js | Gan middleware validate login | Dam bao input login hop le | Da duyet theo yeu cau chat |
| 2 | server/src/services/auth.service.js | Doi login sang so sanh bcrypt trong service, bo JWT flow | Theo yeu cau khong JWT + hash o service | Da duyet theo yeu cau chat |
| 3 | server/src/daos/nguoidung.dao.js | Tach query login/get profile, bo query so khop plaintext | Dung layer DAO cho service auth + student | Da duyet theo yeu cau chat |
| 4 | server/scripts/hash-passwords.js | Goi service hashPassword thay vi query truc tiep | Dua hash_pw vao service | Da duyet theo yeu cau chat |
| 5 | server/src/services/nguoidung.service.js | Bo sung ham hash hang loat plaintext mat khau | Tai su dung trong script, tap trung business logic | Da duyet theo yeu cau chat |
| 6 | server/src/routes/index.js | Dang ky route student/staff moi | Mo rong API theo tai lieu | Da duyet theo yeu cau chat |
| 7 | server/src/controllers/student.controller.js | Them controller student profile/invoice/transaction/pay | Theo nghiep vu sinh vien | Da duyet theo yeu cau chat |
| 8 | server/src/services/student.service.js | Business tinh no, lich su, thanh toan | Theo nghiep vu sinh vien | Da duyet theo yeu cau chat |
| 9 | server/src/daos/student.dao.js | Query bang sinhvien/hoadonhocphi/thanhtoan | Theo layer DAO | Da duyet theo yeu cau chat |
| 10 | server/src/routes/student.route.js | Endpoint /api/student/* | Theo thiet ke API | Da duyet theo yeu cau chat |
| 11 | server/src/validators/student.validator.js | Validate request pay | Bao dam input dung | Da duyet theo yeu cau chat |
| 12 | server/src/controllers/staff.controller.js | Them controller fee-rates/debts/generate-invoices | Theo nghiep vu ke toan | Da duyet theo yeu cau chat |
| 13 | server/src/services/staff.service.js | Business fee rates, debt report, tao hoa don | Theo nghiep vu ke toan | Da duyet theo yeu cau chat |
| 14 | server/src/daos/staff.dao.js | Query muchocphi/dangkyhoc/hoadonhocphi | Theo layer DAO | Da duyet theo yeu cau chat |
| 15 | server/src/routes/staff.route.js | Endpoint /api/staff/* | Theo thiet ke API | Da duyet theo yeu cau chat |
| 16 | server/src/validators/staff.validator.js | Validate fee rate va generate invoices | Bao dam input dung | Da duyet theo yeu cau chat |

## 4) Danh sach file du kien xoa/doi ten/di chuyen (CAN DUYET RO RANG)

| STT | Hanh dong | File | Ly do | Tac dong | Trang thai duyet |
| --- | --- | --- | --- | --- | --- |
| 1 | Khong co | - | - | Khong tac dong | Khong can |

## 5) Danh sach thay doi du lieu quan trong (CAN DUYET RO RANG)

| STT | Loai thay doi | Pham vi | Ly do | Rui ro/Tac dong | Ke hoach rollback | Trang thai duyet |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Khong doi schema SQL | Database | Chi thao tac CRUD tren bang co san | Rui ro trung binh neu sai query update hoa don | Revert code + backup DB truoc test | Da duyet theo yeu cau chat |

## 6) Rui ro tong the va cach giam thieu

- Rui ro: Du lieu cu plaintext va du lieu moi da hash cung ton tai.
- Cach giam thieu: Login ho tro compare bcrypt + fallback plaintext, dong thoi cung cap script hash hang loat.
- Rui ro: Tao hoa don trung khi staff generate nhieu lan.
- Cach giam thieu: Kiem tra ton tai hoa don theo maSV + maHocKy truoc khi insert.
- Rui ro: Trang thai hoa don cap nhat sai khi thanh toan mot phan.
- Cach giam thieu: Tinh tong da nop tu bang thanhtoan moi lan ghi nhan giao dich.

## 7) Xac nhan cua nguoi dung

- [x] Dong y toan bo
- [ ] Dong y mot phan (ghi ro STT duoc phep)
- [ ] Khong dong y
- Ghi chu phe duyet: User da yeu cau thuc hien truc tiep trong chat.

## 8) Pham vi duoc phep thuc thi

- Chi thuc thi cac file neu o muc 3.
- Khong doi schema DB, khong doi ten/xoa file.
